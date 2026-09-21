# Gobernanza versionada, juego de iconos y diagnóstico del remoto

**Punto de partida:** [Cierre de los pendientes de las correcciones SEO](2026-09-21-cierre-pendientes-seo.md), del mismo día. Esta tarea cierra los pendientes que dejó.
**Sin push. Contra el remoto, solo un `git fetch`.**

## Resumen

La razón social queda como **MOVIAPASS SAS** —la triple S de ayer era un error de tipeo—, la gobernanza del proyecto sale del `.gitignore` y pasa a viajar en el repositorio, el máster del logo se guarda fuera de `public/` para que se versione sin publicarse, y el juego de iconos queda completo: `.ico` multi-tamaño, favicon de 96, icono de 192 y `maskable` de 512, todos con rutas absolutas.

Y una corrección de lo que informé ayer: **no hay ninguna divergencia con `origin/main`**. Lo di por hecho leyendo mal un comando. Está en [Fase 5](#fase-5--diagnóstico-de-la-divergencia-con-originmain).

---

## Fase 1 — Razón social

`LEGAL_NAME` pasa de `MOVIAPASSS SAS` a **`MOVIAPASS SAS`**.

`grep -rni "moviapasss\|moviapass sas" src/` devuelve **una sola línea**, que es la constante:

```
src/app/core/constants/site.constants.ts:36:export const LEGAL_NAME = 'MOVIAPASS SAS';
```

Ningún valor escrito a mano en plantillas: el pie lo lee de la constante desde el commit de ayer, así que tocar una línea corrige los dos sitios a la vez.

### Verificación en el dist

`legalName` del JSON-LD de `/`:

```json
"legalName": "MOVIAPASS SAS"
```

Copyright del pie, comprobado en tres rutas a distinta profundidad:

```
/index.html               © 2026 MOVIAPASS SAS · Todos los derechos reservados
/plans/index.html         © 2026 MOVIAPASS SAS · Todos los derechos reservados
/legal/terms/index.html   © 2026 MOVIAPASS SAS · Todos los derechos reservados
```

---

## Fase 2 — Versionar la gobernanza

### Qué había dentro de `.claude/`

Se listó entera, ocultos y subcarpetas incluidos. **Solo los tres `.md`**, nada más: ni settings locales, ni caché, ni credenciales.

```
[file] .claude/CLAUDE.md     11.567 B
[file] .claude/RULES.md      22.371 B
[file] .claude/SETUP.md       7.676 B
```

### El cambio en `.gitignore`

```diff
-# Claude
-.claude
+# Claude — la gobernanza se versiona; lo demás no
+.claude/*
+!.claude/CLAUDE.md
+!.claude/RULES.md
+!.claude/SETUP.md
```

El patrón es **selectivo**: ignora todo el contenido de la carpeta y tres negaciones dejan pasar solo esos archivos. No es abrir `.claude/` de par en par.

`git status --short` tras el `git add`, con los tres entrando como nuevos y nada más de la carpeta:

```
A  .claude/CLAUDE.md
A  .claude/RULES.md
A  .claude/SETUP.md
M  .gitignore
```

**Comprobado que la exclusión sigue tapando lo demás:** se creó una sonda `.claude/settings.local.json` y `git check-ignore -v` respondió `.gitignore:10:.claude/*`. La sonda se retiró (la había creado yo un segundo antes; no se borró nada del usuario).

### Por qué importaba

La regla 25 —nunca borrar un archivo sin versionar sin preguntar antes— se escribió ayer y **existía únicamente en un disco**. Una norma contra la pérdida de archivos no versionados, guardada en un archivo no versionado. Lo mismo valía para la regla 24 y para `CLAUDE.md` entero: quien clonara el repositorio no recibía ninguna de las reglas que dicen cómo se toca.

### El pendiente que se cierra

No hay ningún documento en `docs/decisiones/` que mencione esto, así que **no se añadió ninguna línea ahí**. Donde estaba registrado era en la columna «Estado» del índice, y ahí sí se cerró:

```diff
-| [Gobernanza, dominio y bump de @ng-icons](…) | … | Vigente — la salida de la gobernanza del `.gitignore` queda pendiente |
+| [Gobernanza, dominio y bump de @ng-icons](…) | … | Vigente — la salida de la gobernanza del `.gitignore` se cerró el 2026-09-21 |
```

Los documentos con fecha de `docs/cambios/` y `docs/diagnosticos/` que lo mencionan —`2026-09-20-gobernanza-y-dominio.md`, `2026-09-20-update-angular-y-limpieza.md`, `2026-09-20-estado-inicial.md` y el de ayer— **no se tocaron**: son fotos de un momento y reescribirlas destruiría la única prueba de cómo estaba el proyecto ese día (regla 24).

---

## Fase 3 — El máster de marca, fuera de `public/`

`public/imgs/logos/logo+tag.jpg` tenía los dos problemas a la vez: al vivir en `public/` **se publicaba** en moviapass.com —382 KB que nadie enlazaba—, y al no estar en git era **el único ejemplar** del máster.

Ahora vive en `assets-src/brand/logo-tag.jpg`, fuera de `public/` y de `src/`. Se le quitó el `+` del nombre: en una URL significa espacio y en un shell hay que escaparlo.

### Movimiento, no borrado

|         | Ruta                             | ¿Existe?  |   Bytes | md5                                |
| ------- | -------------------------------- | --------- | ------: | ---------------------------------- |
| Origen  | `public/imgs/logos/logo+tag.jpg` | **ya no** |       — | —                                  |
| Destino | `assets-src/brand/logo-tag.jpg`  | **sí**    | 391.316 | `548e2b6d7bfb9fe68375732e24131797` |

El md5 es idéntico al que tenía el origen antes de moverlo: el archivo llegó intacto, byte a byte. Y ahora está commiteado, que es lo que la regla 25 pedía desde el principio.

### Nadie lo lee ni lo publica

- `angular.json` → `assets: [{ "glob": "**/*", "input": "public" }]`. Solo copia `public/**`.
- `scripts/optimize-images.mjs` → `const IMAGES_DIR = 'public/imgs'`. Solo recorre esa carpeta.
- `grep -rn "assets-src" src/ scripts/ angular.json tsconfig*.json` → sin resultados.
- En el dist: `find dist -iname '*logo*tag*'` → nada. `find dist -path '*assets-src*'` → nada.

Como `deploy.yml` sincroniza `dist/web-movia/browser`, lo que no está en el dist no llega a S3.

---

## Fase 4 — Iconos

### Los cuatro archivos

| Archivo                              | Dimensiones  |             Peso | Tipo real                  |     |
| ------------------------------------ | ------------ | ---------------: | -------------------------- | --- |
| `public/favicon.ico`                 | 16 + 32 + 48 |   3 KB (3.911 B) | `image/vnd.microsoft.icon` | ✅  |
| `public/favicon.png`                 | 96 × 96      |   2 KB (2.531 B) | `image/png`                | ✅  |
| `public/icons/icon-192.png`          | 192 × 192    |   5 KB (5.286 B) | `image/png`                | ✅  |
| `public/icons/icon-maskable-512.png` | 512 × 512    | 14 KB (15.219 B) | `image/png`                | ✅  |

El `.ico` se verificó leyendo su cabecera, no fiándose del nombre: **tres imágenes dentro**, de 16 × 16 (666 B), 32 × 32 (1.261 B) y 48 × 48 (1.930 B), las tres a 32 bpp.

El favicon pasa de **557 × 565 a 96 × 96**. El anterior era siete veces más grande de lo que se llega a pintar y, además, el manifest lo declaraba como `64x64`, que no era verdad.

### El `<head>`

```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

**Sobre las rutas absolutas, con un matiz honesto:** el encargo las pedía porque con `favicon.png` relativo el navegador lo buscaría en `/legal/favicon.png`. Eso **hoy no llegaba a pasar**, porque `src/index.html` lleva `<base href="/">` y con esa etiqueta las relativas ya resuelven contra la raíz. Aun así el cambio vale: quita la dependencia de que `<base>` no cambie nunca, que es una atadura invisible entre dos partes del `<head>` que nadie recuerda al tocar una de las dos.

### El manifest

```json
"icons": [
	{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
	{ "src": "/brand/logo-square.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
	{ "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

Fuera la entrada del favicon: el manifest es para instalar la aplicación, y ahí el icono de 16 px no pinta nada.

### Fuera del script de optimización

`public/icons` se suma a `EXCLUDED_DIRS`, junto a `og/` y `brand/`:

```js
const EXCLUDED_DIRS = ['public/og', 'public/brand', 'public/icons'];
```

El motivo no es solo de formato: el manifest **declara** `"type": "image/png"` y un `purpose`. Convertirlos a WebP dejaría esa declaración mintiendo justo en el momento en que alguien intenta instalar la aplicación, que es cuando Android descarta el icono que no puede leer. Tras el cambio, `npm run imgs:optimize` convierte **0 imágenes**.

### Verificación

`npm run lint`, `npm run test` y `npm run build:prod` pasan. `Prerendered 10 static routes`.

`<head>` de iconos de `/legal/terms` —la ruta más profunda— tal cual sale del dist:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="manifest.webmanifest" />
```

`icons` del manifest servido desde el dist:

```json
[
	{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
	{ "src": "/brand/logo-square.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
	{ "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

Y lo que de verdad importa: **cargando `/legal/terms` en un navegador**, las cuatro etiquetas resuelven a la raíz y los seis archivos se descargan con su tipo correcto.

| URL                            | Respuesta                    |
| ------------------------------ | ---------------------------- |
| `/favicon.ico`                 | `200 image/x-icon` · 3.911 B |
| `/favicon.png`                 | `200 image/png` · 2.531 B    |
| `/apple-touch-icon.png`        | `200 image/png` · 10.258 B   |
| `/icons/icon-192.png`          | `200 image/png` · 5.286 B    |
| `/icons/icon-maskable-512.png` | `200 image/png` · 15.219 B   |
| `/brand/logo-square.png`       | `200 image/png` · 22.120 B   |

### Lighthouse móvil de `/`

| Performance | Accessibility | Best Practices |     SEO |
| ----------: | ------------: | -------------: | ------: |
|          92 |       **100** |        **100** | **100** |

**Sobre «no hay avisos de manifest ni de iconos»:** no los hay, pero conviene saber por qué. **Lighthouse 12 retiró la categoría PWA**, así que ya no existen las auditorías `installable-manifest`, `maskable-icon` ni `apple-touch-icon`: buscándolas por nombre en el informe no aparece ninguna. Decir «pasa las auditorías de iconos» sería falso, porque no se ejecutan. Lo que sí se puede afirmar es que **ninguna auditoría de ninguna categoría falla por manifest o iconos**, y que la comprobación directa de la tabla de arriba —los seis archivos descargados desde la ruta más profunda— cubre lo que aquellas auditorías miraban.

Las nueve auditorías que Lighthouse suspende son todas de Performance y todas por lo mismo de siempre: el servidor de pruebas no comprime. Ya está documentado en el [informe del día 20](2026-09-20-correcciones-seo.md).

### Un efecto secundario de la caché que conviene tener en cuenta

Al verificar en el navegador, `/favicon.png` devolvió 7.464 B en lugar de 2.531. No era un fallo del build —el archivo del dist tiene el md5 correcto y `curl` devuelve 2.531 B—: era **la caché del navegador**, porque el servidor de pruebas manda `cache-control: immutable` para todo lo que no es HTML.

Y eso mismo hace `deploy.yml` en producción: la primera pasada de `aws s3 sync` sube todo lo que no es `.html` con `max-age=31536000, immutable`. Como `favicon.png` **no lleva hash en el nombre** y ha cambiado de contenido, quien ya haya visitado el sitio puede seguir viendo el icono viejo hasta un año. Los demás archivos de esta tanda son nuevos, así que no les afecta.

Opciones, para cuando toque: invalidar explícitamente esas rutas en CloudFront tras el despliegue (el workflow ya invalida `/*`, así que el CDN se limpia; lo que persiste es la caché **del navegador** de cada persona), o servir los iconos sin caché larga. No es urgente —el sitio aún no está publicado— pero es el tipo de detalle que solo se ve cuando ya molesta.

---

## Fase 5 — Diagnóstico de la divergencia con `origin/main`

### Corrección: no hay divergencia

En el [informe de ayer](2026-09-21-cierre-pendientes-seo.md) escribí que «`origin/main` apunta a `ece4cb7`, que no está en esa lista: el remoto tiene una historia distinta de la local», y recomendé mirarlo antes del primer push. **Eso era falso, y el error fue mío.**

Lo deduje de que `git log --oneline origin/main..HEAD` no mostraba `ece4cb7`. Pero el rango `A..B` **excluye A por definición**: que `origin/main` no salga en `origin/main..HEAD` no significa nada, es lo que tiene que pasar siempre. Lo leí como una señal de divergencia y no lo era.

Lo correcto:

```
$ git merge-base --is-ancestor origin/main HEAD
  SÍ: origin/main es ancestro directo de HEAD. NO hay divergencia.

$ git rev-list --left-right --count origin/main...HEAD
  el remoto tiene 0 commits que el local no tiene
  el local tiene 38 commits que el remoto no tiene
```

### Las salidas que se pidieron

`git fetch origin` — sin salida: no había nada nuevo que descargar.

```
$ git log --oneline --graph origin/main -15
* ece4cb7 chore: setup inicial de web-movia
* e568078 initial commit

$ git merge-base HEAD origin/main
ece4cb75fabbe078eb673932878eab7b806c62fe

$ git diff --stat HEAD origin/main
…
 src/index.html        |   23 +-
 src/main.server.ts    |   13 -
 src/styles.css        |  208 +-
 tsconfig.app.json     |   18 +-
 214 files changed, 2867 insertions(+), 14420 deletions(-)
```

`git show --stat ece4cb7` — el commit que es la punta del remoto:

```
commit ece4cb75fabbe078eb673932878eab7b806c62fe
Author: Carlos Sanchez <carlospasamora@gmail.com>
Date:   Sun Sep 20 17:00:08 2026 -0500

    chore: setup inicial de web-movia

    Proyecto en blanco para la landing estática de Movía, partiendo de la copia
    de web-partner-movia: se borra todo el código del portal (core, features,
    layout, shared) y se conservan las configuraciones (husky, commitlint,
    eslint, prettier, tsconfig) y los estilos globales con los tokens de marca.
```

29 archivos, entre ellos `package-lock.json`, `angular.json`, `tsconfig.json`, `eslint.config.js`, los dos environments, `src/index.html`, `src/styles.css` y `public/manifest.webmanifest`.

> **Ojo a un detalle de ese commit:** borró un `public/favicon.ico` de 15.086 B (`Bin 15086 -> 0 bytes`) y añadió el `favicon.png` de 7.464 B. Es decir, el proyecto **tuvo** un `.ico` y se retiró en el setup inicial. El que se añade hoy en la fase 4 es otro archivo distinto, de 3.911 B.

### 5.3 · Qué contiene el remoto que no tiene el local

**Nada. Ni un archivo.**

```
$ git diff --name-status HEAD origin/main | grep '^A'
  → total: 0
```

Cero archivos existen en `origin/main` y faltan en `HEAD`. Los dos commits del remoto están **íntegros dentro** de la historia local: se comprobó uno a uno que cada commit de `origin/main` es ancestro de `HEAD`.

Los 214 archivos del `git diff --stat` se descomponen así, leyendo el diff en el sentido `HEAD → origin/main`:

|                   | Cuántos | Qué significan                                                                            |
| ----------------- | ------: | ----------------------------------------------------------------------------------------- |
| Añadidos (`A`)    |   **0** | Archivos que el remoto tiene y el local no. **Ninguno.**                                  |
| Borrados (`D`)    | **199** | Archivos que existen en el local y todavía no en el remoto: todo el trabajo de estos días |
| Modificados (`M`) |  **15** | Existen en los dos, y el remoto tiene la versión **anterior**                             |

Los 15 modificados, con cuántos commits locales toca cada uno:

| Archivo                                | Commits locales que lo tocan |
| -------------------------------------- | ---------------------------: |
| `.gitignore`                           |                            1 |
| `angular.json`                         |                            1 |
| `package-lock.json`                    |                            4 |
| `package.json`                         |                            5 |
| `public/favicon.png`                   |                            1 |
| `public/manifest.webmanifest`          |                            3 |
| `src/app/app.config.ts`                |                            3 |
| `src/app/app.html`                     |                            2 |
| `src/app/app.routes.ts`                |                            2 |
| `src/app/app.ts`                       |                            1 |
| `src/environments/environment.prod.ts` |                            1 |
| `src/environments/environment.ts`      |                            1 |
| `src/index.html`                       |                            3 |
| `src/styles.css`                       |                            6 |
| `tsconfig.app.json`                    |                            2 |

En los 15 casos el remoto tiene una versión **más vieja** de un archivo que el local ha ido cambiando por encima. **No hay ningún cambio del remoto que el local no contenga**, así que no hay nada que rescatar ni nada que se pueda perder.

### 5.4 · Cómo integrarlo

Al ser un avance rápido —`origin/main` es ancestro de `HEAD`, 38 por delante y 0 por detrás— **no hace falta integrar nada**: no hay merge, no hay rebase y no hay conflictos posibles. Publicar es literalmente mover el puntero del remoto hacia delante.

**NO ejecuté ninguno de estos comandos.** Van para cuando decidas publicar:

```bash
# 1. Confirmar que sigue siendo avance rápido (si alguien ha empujado mientras, esto lo dice).
git fetch origin
git merge-base --is-ancestor origin/main HEAD && echo "avance rápido: se puede publicar"
```

```bash
# 2. Publicar. `--force-with-lease` NO hace falta y no se usa: esto no reescribe nada.
#    Si el remoto se hubiera movido, git rechaza el push por su cuenta.
git push origin main
```

```bash
# 3. Comprobar que el remoto quedó donde toca.
git fetch origin && git rev-list --left-right --count origin/main...HEAD   # debe dar "0	0"
```

**Si al hacer el paso 1 resultara que ya no es avance rápido** —porque alguien empujó algo en medio—, entonces sí habría que integrar, y la forma que no pierde nada de ninguno de los dos lados es un merge, nunca un rebase ni un force:

```bash
git fetch origin
git merge origin/main          # crea un commit de merge; conserva las dos historias
# resolver conflictos si los hubiera, y después:
git push origin main
```

Nada de `--force`, nada de `--force-with-lease`, nada de `reset --hard`: los tres tiran commits, y aquí no hay ninguno que sobre.

**Dos cosas que mirar antes del primer push**, ninguna de ellas bloqueante:

1. `ci.yml` se dispara con el push a `main` y corre lint, tests, build y Gitleaks sobre el historial completo. Los tres primeros pasan en local; el escaneo de secretos mirará 38 commits que nunca han pasado por él. No debería encontrar nada —los environments solo llevan URLs públicas—, pero es la primera vez que corre.
2. `deploy.yml` **no se dispara con el push**. Publicar en moviapass.com sigue siendo una decisión manual.

---

## Lo que sigue pendiente

| Qué                                        | Dónde                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **URLs de App Store y Google Play**        | `APP_STORE_URL` y `GOOGLE_PLAY_URL` en `src/app/core/constants/external-links.constants.ts`             |
| **URLs de Facebook, Instagram y LinkedIn** | En el mismo archivo. Activan solas el `sameAs` de `Organization`                                        |
| **Texto de los tres documentos legales**   | `src/app/features/legal/{terms,privacy,data-usage}/`, y después `indexable: true` en `seo.constants.ts` |
| **Ciudades en el copy**                    | Home y `/plans`                                                                                         |
| **Logo en SVG**                            | Para `header.html` y `footer.html`; el máster está en `assets-src/brand/`                               |
| **Compresión en el hosting**               | Lo único que separa un 92 de Performance móvil de un 99. Checklist de la auditoría                      |
| **Caché de `favicon.png`**                 | Cambió de contenido y se sirve con `immutable` sin hash en el nombre                                    |

---

## Confirmación

- **No se hizo push.** Cinco commits nuevos en local.
- **Contra el remoto, solo `git fetch origin`.** Ni `push`, ni `pull`, ni `rebase`, ni `merge`, ni `reset`. Los comandos de integración de la fase 5 están escritos pero **no ejecutados**.
- **No se borró nada sin versionar.** El máster del logo se movió (mismo md5 en destino) y quedó commiteado. La única retirada fue una sonda `.claude/settings.local.json` que creé yo para probar el `.gitignore`.
- **No se crearon imágenes.** Las cuatro de la fase 4 las aportó el usuario.
- `npm run lint`, `npm run test` y `npm run build:prod` pasan, y `git status` queda limpio.
