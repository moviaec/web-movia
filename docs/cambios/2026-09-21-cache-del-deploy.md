# Caché del despliegue: tres grupos en vez de dos

**Qué se toca:** solo `.github/workflows/deploy.yml`, la sincronización con S3.
**No se hizo push y no se ejecutó el workflow.**

## El problema

La sincronización iba en dos pasadas: «el HTML» y «todo lo demás». Y ese «todo lo demás» subía con `max-age=31536000, immutable`.

`immutable` le dice al navegador «esta URL no va a cambiar nunca, ni te molestes en preguntar». Eso es cierto para un `main-EUQ5FH5G.js`, porque si el contenido cambia el nombre cambia con él. Pero **no es cierto para nada de lo que viene de `public/`**, que se sirve siempre con la misma clave: `favicon.png`, `imgs/home/hero.webp`, `og/og-default.jpg`. Cambiar cualquiera de esos archivos dejaba a quien ya hubiera entrado viendo el viejo **hasta un año**, sin forma de arreglarlo desde el servidor.

No es teórico: ayer, al reemplazar `favicon.png` de 557 × 565 por el de 96 × 96, el navegador siguió devolviendo el viejo desde su caché. Lo pilló la verificación de los iconos, y de ahí sale esta tarea.

**Y había un caso peor del que no se había hablado.** Con `--exclude "*.html"` como único filtro, también caían en el saco de `immutable`:

| Archivo                | Consecuencia de `immutable` un año                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `robots.txt`           | Un `Disallow: /` por error se queda un año. Es el archivo con el que se le dice a Google qué NO rastrear                |
| `sitemap.xml`          | Se regenera en cada build con las rutas indexables, y el navegador y los intermediarios se quedarían con la lista vieja |
| `manifest.webmanifest` | Cambia cada vez que se toca un icono; ayer cambió dos veces                                                             |

Un `robots.txt` equivocado con `immutable` no se corrige: se espera.

## Qué lleva hash y qué no

Inventario de las **88 claves** del dist, clasificadas por si el nombre lleva el hash de contenido:

| Grupo                       | Cuántos | Quién los genera                 | ¿Hash en el nombre?  |
| --------------------------- | ------: | -------------------------------- | -------------------- |
| `.js` y `.css`              |  **23** | Angular (`outputHashing: "all"`) | **Sí**, 8 caracteres |
| `.html`                     |      11 | El prerender de Angular          | No                   |
| `robots.txt`, `sitemap.xml` |       2 | `scripts/generate-seo-files.mjs` | No                   |
| Estáticos e imágenes        |      51 | Copiados de `public/` tal cual   | No                   |
| `manifest.webmanifest`      |       1 | Copiado de `public/`             | No                   |

**Ni un solo `.js` o `.css` sin hash**, comprobado con el patrón `-[A-Za-z0-9_-]{8}\.(js|css)$` sobre los 88 archivos. Los 23 son:

```
main-EUQ5FH5G.js          styles-EY4R6GX5.css       chunk-0xu6aOu1.js
chunk-7L13j-0T.js         chunk-B2nd7Vjd.js         chunk-B73XclUi.js
chunk-BS4Ht6zj.js         chunk-BVbemYgy.js         chunk-B_Bhnk0o.js
chunk-B_YfSViY.js         chunk-BfbeqspJ.js         chunk-BtRo2GEE.js
chunk-BxmbbFwx.js         chunk-C5AKFj1g.js         chunk-CHta-7TH.js
chunk-CaALQmLN.js         chunk-D6Lqwovn.js         chunk-DDX2XNAD.js
chunk-DFjnlIcY.js         chunk-DOX1mFXu.js         chunk-Dp6yewVX.js
chunk-fTJIQ3dp.js         chunk-sMm9Avrd.js
```

**No existe carpeta `media/`.** Angular la usa para los assets que se importan desde el código y sí les pone hash; aquí todas las imágenes vienen de `public/` como `assets`, que se copian con su nombre intacto. Por eso el reparto es tan limpio: con hash = `.js` y `.css`, sin hash = todo lo demás.

## Los tres grupos

| Grupo                          | Patrón de filtros                                                                                                    | `cache-control`                     | Archivos | Ejemplos reales del dist                                                                                                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 · Con hash**               | `--exclude "*"` `--include "*.js"` `--include "*.css"`                                                               | `public,max-age=31536000,immutable` |   **23** | `main-EUQ5FH5G.js`, `chunk-0xu6aOu1.js`, `styles-EY4R6GX5.css`                                                                                                                                  |
| **2 · Sin hash, de `public/`** | `--exclude "*.js"` `--exclude "*.css"` `--exclude "*.html"` `--exclude "robots.txt"` `--exclude "sitemap.xml"`       | `public,max-age=86400`              |   **52** | `imgs/home/hero.webp`, `icons/icon-192.png`, `og/og-default.jpg`, `brand/logo-square.png`, `favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `manifest.webmanifest`, `imgs/iconos/menu.svg` |
| **3 · Siempre fresco**         | `--exclude "*"` `--include "*.html"` `--include "robots.txt"` `--include "sitemap.xml"` `--exclude "index.csr.html"` | `no-cache`                          |   **12** | `index.html`, `legal/terms/index.html`, `plans/index.html`, `robots.txt`, `sitemap.xml`                                                                                                         |
| —                              | _(ninguno: excluido a propósito)_                                                                                    | —                                   |    **1** | `index.csr.html`                                                                                                                                                                                |

23 + 52 + 12 + 1 = **88**. Cuadra.

### Por qué el grupo 2 no enumera lo que incluye

Porque el encargo pedía que **una imagen nueva en `public/` cayera sola en su grupo**, y una lista de archivos no hace eso: hay que acordarse de editarla.

El grupo 2 está escrito como «todo lo que no son los otros dos». Es el **cajón por defecto**, y eso es deliberado: lo que el workflow no reconozca se cachea un día, nunca un año. Los dos errores no son simétricos — equivocarse hacia un día se arregla mañana; equivocarse hacia `immutable` no se arregla.

Comprobado con claves hipotéticas que hoy no existen:

| Clave inventada                       | Cae en  | ¿Correcto?                                      |
| ------------------------------------- | ------- | ----------------------------------------------- |
| `imgs/nueva/foto.avif`                | Grupo 2 | Sí: formato nuevo, un día                       |
| `fonts/inter.woff2`                   | Grupo 2 | Sí: carpeta nueva en `public/`                  |
| `video/demo.mp4`                      | Grupo 2 | Sí                                              |
| `llms.txt`                            | Grupo 2 | Sí: es un `.txt`, pero **no** es `robots.txt`   |
| `legal/sitemap.xml`                   | Grupo 2 | Sí: solo el sitemap **de la raíz** va sin caché |
| `main-VIEJO123.js` (huérfano en S3)   | Grupo 1 | Sí: lo borrará su propia pasada                 |
| `ruta-retirada/index.html` (huérfano) | Grupo 3 | Sí                                              |

`--include "robots.txt"` casa la **clave exacta**, no cualquier `.txt`; por eso `sub/robots.txt` cae en el grupo 2 y no en el 3.

## El `--delete` y el orden de las pasadas

**Las tres pasadas llevan `--delete`, y es seguro.** El razonamiento tiene dos patas:

1. `aws s3 sync` **excluye del borrado lo que los filtros excluyen** de la subida. Cada pasada solo puede borrar claves de su propio grupo.
2. Los tres grupos son **disjuntos por construcción de los patrones**, no por casualidad del dist de hoy. Ninguna clave casa dos grupos, así que **ninguna pasada puede borrar lo que otra acaba de subir**.

La alternativa —dejar el `--delete` en una sola pasada— **no vale**: al quedar excluidos del borrado los archivos de los otros dos grupos, una imagen retirada de `public/` o el HTML de una ruta eliminada se quedarían en S3 sirviéndose para siempre. Lo segundo ya estaba identificado como problema en la auditoría SEO.

**Orden: grupo 1 → grupo 2 → grupo 3.** Para el borrado da igual, porque son disjuntos; importa por otra razón: el HTML es quien referencia los bundles con hash y las imágenes, así que sube el último. Al revés habría una ventana en la que la página nueva pide archivos que todavía no están.

> **Una ventana que sigue existiendo, y que no toco aquí:** el `--delete` del grupo 1 retira los chunks viejos mientras el HTML antiguo todavía se está sirviendo desde la caché de CloudFront. Es inherente a cualquier despliegue por sincronización y dura lo que tarde la invalidación. Cerrarlo del todo pide otra estrategia —subir primero, borrar en una pasada posterior, o no borrar y limpiar por ciclo de vida del bucket— y es un cambio de diseño, no un ajuste de cabeceras.

## Verificación

### La partición, leída del propio archivo

No se comprobó contra lo que yo creía haber escrito, sino **parseando el YAML ya guardado**, extrayendo los `--exclude`/`--include` de cada paso y aplicándolos a las 88 claves reales del dist con la misma semántica que la CLI (evaluación en orden, gana el último que casa, se parte de «incluido», y el `*` cruza las barras):

```
═══ pasadas leídas del workflow ═══
  · Grupo 1 · JS y CSS con hash (caché de un año)
      cache-control: public,max-age=31536000,immutable  ·  --delete: true
      filtros: [["exclude","*"],["include","*.js"],["include","*.css"]]
  · Grupo 2 · Estáticos de public/ sin hash (caché de un día)
      cache-control: public,max-age=86400  ·  --delete: true
      filtros: [["exclude","*.js"],["exclude","*.css"],["exclude","*.html"],["exclude","robots.txt"],["exclude","sitemap.xml"]]
  · Grupo 3 · HTML, robots y sitemap (sin caché)
      cache-control: no-cache  ·  --delete: true
      filtros: [["exclude","*"],["include","*.html"],["include","robots.txt"],["include","sitemap.xml"],["exclude","index.csr.html"]]

═══ reparto de las 88 claves reales ═══
   23  Grupo 1 · JS y CSS con hash (caché de un año)
   52  Grupo 2 · Estáticos de public/ sin hash (caché de un día)
   12  Grupo 3 · HTML, robots y sitemap (sin caché)
    1  sin pasada: index.csr.html

  ¿alguna clave en DOS pasadas? NINGUNA ✅
  ¿alguna sin subir?            solo index.csr.html, intencionado ✅
  ¿todas las pasadas borran?    sí — y es seguro porque los grupos son disjuntos ✅
```

### `actionlint`: no está disponible

**No se pudo ejecutar.** `actionlint` es un binario de Go; el paquete `actionlint` de npm no expone ejecutable (`npx actionlint` → «could not determine executable to run») y los nombres alternativos que probé, `@rhysd/actionlint` y `actionlint-cli`, devuelven 404. Tampoco está instalado en el sistema. Instalarlo globalmente con Homebrew se salía de lo autorizado.

Lo que sí se validó, con `js-yaml` que ya está en `node_modules`:

| Comprobación                                    | `deploy.yml`                    | `ci.yml`   |
| ----------------------------------------------- | ------------------------------- | ---------- |
| YAML bien formado                               | ✅                              | ✅         |
| `name`, `on` y `jobs` presentes                 | ✅                              | ✅         |
| Cada job con `runs-on` y `steps`                | ✅                              | ✅         |
| Cada paso con `uses` **o** `run`, nunca los dos | ✅ 11 pasos (3 `uses`, 8 `run`) | ✅ 6 pasos |
| Sintaxis de shell de cada `run` (`bash -n`)     | ✅ los 8                        | —          |

La forma de cerrar este hueco de verdad es añadir actionlint al propio `ci.yml`, donde sí corre en Linux. Queda apuntado abajo.

## El diff

Quitando los comentarios, que son la mayor parte de las 85 líneas añadidas:

```diff
-            - name: Subir assets con caché larga
+            - name: 'Grupo 1 · JS y CSS con hash (caché de un año)'
               run: |
                   aws s3 sync dist/web-movia/browser s3://moviapass-com \
-                    --delete --exclude "*.html" \
+                    --delete \
+                    --exclude "*" --include "*.js" --include "*.css" \
                     --cache-control "public,max-age=31536000,immutable"

-            - name: Subir HTML sin caché
+            - name: 'Grupo 2 · Estáticos de public/ sin hash (caché de un día)'
               run: |
                   aws s3 sync dist/web-movia/browser s3://moviapass-com \
-                    --delete --exclude "*" --include "*.html" --exclude "index.csr.html" \
-                    --cache-control "no-cache"
+                    --delete \
+                    --exclude "*.js" --exclude "*.css" --exclude "*.html" \
+                    --exclude "robots.txt" --exclude "sitemap.xml" \
+                    --cache-control "public,max-age=86400"
+
+            - name: 'Grupo 3 · HTML, robots y sitemap (sin caché)'
+              run: |
+                  aws s3 sync dist/web-movia/browser s3://moviapass-com \
+                    --delete \
+                    --exclude "*" --include "*.html" --include "robots.txt" --include "sitemap.xml" \
+                    --exclude "index.csr.html" \
+                    --cache-control "no-cache"
```

`git diff --stat`: `1 file changed, 85 insertions(+), 23 deletions(-)`.

## Dos cosas que vi de paso y no toqué

**1 · `index.csr.html` nunca se borra.** El `--exclude` final lo saca de la subida, y por eso mismo queda fuera del `--delete` de las tres pasadas. Hoy da igual, porque el sitio no se ha desplegado nunca y no hay copia en S3; pero si alguna vez llegara a subirse, ninguna pasada lo retiraría. El comentario del workflow decía que ese `--exclude` «lo saca tanto de la subida como del borrado: deja de publicarse», lo cual era verdad a medias: deja de publicarse **de ahora en adelante**, no retira lo ya publicado.

**2 · El `content-type` de `manifest.webmanifest`.** `aws s3 sync` deduce el tipo de la extensión con la tabla de `mimetypes` de Python, y `.webmanifest` no suele estar en ella: es posible que S3 lo acabe sirviendo como `application/octet-stream`. No lo puedo confirmar sin desplegar, y si pasa se arregla con una pasada extra o un `--content-type` explícito. Lo dejo apuntado para comprobarlo en el primer despliegue real, junto al resto del checklist.

## Para el primer despliegue

Vale la pena comprobar las cabeceras de un archivo de cada grupo:

```bash
curl -sI https://moviapass.com/main-EUQ5FH5G.js | grep -i cache-control   # max-age=31536000, immutable
curl -sI https://moviapass.com/favicon.png      | grep -i cache-control   # max-age=86400
curl -sI https://moviapass.com/robots.txt       | grep -i cache-control   # no-cache
curl -sI https://moviapass.com/manifest.webmanifest | grep -i content-type  # application/manifest+json
```

Y queda pendiente, como mejora del CI: añadir `actionlint` a `ci.yml` —hay una acción oficial— para que los workflows se validen en cada push, que es donde esta comprobación tiene sentido.
