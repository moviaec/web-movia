# El despliegue deja de borrar los chunks, y tres cosas más

**Punto de partida:** [Caché del despliegue: tres grupos en vez de dos](2026-09-21-cache-del-deploy.md), del mismo día. Esto cierra los dos cabos sueltos que aquel informe dejó anotados y quita una ventana de rotura que aquel cambio no tocaba.
**Qué se toca:** `.github/workflows/deploy.yml` y `ci.yml`. **Sin push y sin ejecutar ningún workflow.**

## Los cuatro cambios, un commit cada uno

| Commit                                                          | Qué                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `ci(deploy): no borrar los chunks con hash al desplegar`        | El grupo 1 pierde el `--delete`                      |
| `ci(deploy): corregir el content-type del manifest en S3`       | `application/manifest+json` en vez de `octet-stream` |
| `ci(deploy): retirar index.csr.html de S3 si quedara publicado` | Paso idempotente de limpieza                         |
| `ci: validar los workflows con actionlint`                      | Job nuevo en el CI, versión fijada                   |

---

## 1 · El `--delete` del grupo 1

### Qué rompía

El grupo 1 sincroniza los `.js` y `.css` con hash, y llevaba `--delete`: retiraba de S3 los bundles del build anterior. El problema es que **un despliegue no es instantáneo y el HTML viejo sigue vivo un rato**, así que había dos ventanas en las que la página se rompía sin que nadie hubiera hecho nada raro:

**Durante el despliegue.** Entre el grupo 1 y el grupo 3 pasan segundos: los chunks viejos ya no están, pero el HTML que se sirve todavía es el anterior y los sigue pidiendo. Resultado: 404 a media carga.

**Después del despliegue, y esto dura mucho más.** Quien tenga la pestaña abierta conserva el HTML viejo en memoria. Al navegar a otra ruta, el router de Angular pide un chunk perezoso —el proyecto usa `loadComponent` en todas las rutas, así que **cada página es un chunk aparte**— con el hash antiguo. Si se borró, la navegación falla: la persona pulsa «Planes» y no pasa nada. La caché de CloudFront alarga la ventana hasta que la invalidación termina de propagarse.

Esta segunda es la mala: no dura el despliegue, dura lo que dure la sesión de alguien.

### Qué se hace ahora

`--delete` fuera del grupo 1. **Los archivos con hash se acumulan a propósito.** Se puede, porque:

- **Sus nombres no colisionan nunca.** El hash es del contenido: dos builds distintos no pueden producir la misma clave con contenido diferente. No hay riesgo de que un archivo viejo «tape» a uno nuevo.
- **No se sirven a nadie** salvo que un HTML los pida, y el HTML nuevo solo pide los suyos.
- **Lo único que crece es el almacenamiento**, en céntimos: los 23 archivos del build actual suman unos 400 KB.

Los grupos 2 y 3 **conservan** el `--delete`, y ahí sí hace falta: sus claves se reutilizan —`imgs/home/hero.webp` es siempre la misma URL—, así que un archivo retirado de `public/` o el HTML de una ruta eliminada tienen que desaparecer del bucket.

El comentario del paso lo dice en mayúsculas y con el porqué entero, porque «esta pasada no borra» se lee como un descuido y la reacción natural de quien lo vea es devolverlo.

### El precio, y cómo se paga

Los chunks se acumulan: cada despliegue deja unos cuantos. Al final del workflow queda escrito el procedimiento de limpieza manual, en tres pasos y **sin ejecutar nada automáticamente**:

1. **Qué pide el sitio ahora mismo** — extraído del HTML que se está sirviendo, no del dist local, que puede ir por delante:

    ```bash
    for ruta in "" plans partners corporate contact help legal; do
      aws s3 cp "s3://moviapass-com/${ruta:+$ruta/}index.html" - 2>/dev/null
    done | grep -oE '(main|chunk|styles)-[A-Za-z0-9_-]{8}\.(js|css)' | sort -u
    ```

2. **Qué hay en el bucket**, del más viejo al más nuevo:

    ```bash
    aws s3api list-objects-v2 --bucket moviapass-com \
      --query "sort_by(Contents, &LastModified)[?ends_with(Key, '.js') || ends_with(Key, '.css')].[LastModified, Size, Key]" \
      --output text
    ```

3. **La diferencia es lo que sobra**, y se borra de una en una por su clave exacta:

    ```bash
    aws s3 rm s3://moviapass-com/chunk-VIEJO123.js
    ```

Nunca con `--recursive` ni con comodín: en la raíz de este bucket eso se lleva el sitio entero. Y con margen: no borrar lo de los últimos despliegues aunque no aparezca en (1), porque alguien puede llevar la pestaña abierta desde ayer.

La alternativa es una regla de ciclo de vida en el bucket que expire por antigüedad. Se configura en S3 y habría que acotarla a `.js` y `.css`, porque las imágenes de `public/` no cambian de nombre nunca y una regla por antigüedad se las llevaría.

---

## 2 · El `content-type` del manifest

En el informe de la caché quedó como sospecha; ahora está cerrada.

`aws s3 sync` deduce el tipo de contenido de la extensión usando la tabla `mimetypes` de Python, y **`.webmanifest` no está en ella**: el manifest se subía como `application/octet-stream`. Un navegador que recibe eso lo descarta, así que la aplicación se queda sin nombre, sin iconos y sin «Añadir a pantalla de inicio» —justo el trabajo de los iconos de ayer— con un aviso en consola que no dice de dónde viene.

```yaml
- name: 'Grupo 2 bis · Corregir el content-type del manifest'
  run: |
      aws s3 cp \
        s3://moviapass-com/manifest.webmanifest \
        s3://moviapass-com/manifest.webmanifest \
        --metadata-directive REPLACE \
        --content-type "application/manifest+json" \
        --cache-control "public,max-age=86400"
```

Tres decisiones dentro de esas seis líneas:

- **Copiar el objeto sobre sí mismo** es la forma de cambiar metadatos en S3 sin volver a subir el archivo.
- **`--metadata-directive REPLACE`** es obligatorio: por defecto una copia **conserva** los metadatos del original, así que sin esto el `content-type` equivocado sobreviviría a la copia.
- **El `cache-control` se repite aquí**, y no es redundancia: REPLACE sustituye **todos** los metadatos, así que omitirlo dejaría el manifest sin el día de caché que le acaba de dar el grupo 2. Es el mismo valor, `public,max-age=86400`, y si un día cambia el del grupo 2 hay que cambiarlo en los dos sitios.

Va como paso aparte y no dentro del sync porque `--content-type` se aplicaría a los 52 archivos de esa pasada, no solo a este.

---

## 3 · `index.csr.html`

El cascarón vacío de client-side rendering que el build emite siempre no se sube: lo excluye el filtro del grupo 3. Pero **excluirlo lo deja también fuera del `--delete`**, así que si alguna vez llegó a publicarse —con la configuración anterior, que subía todo lo que no fuera `.html`… aunque este sí lo es, o a mano— ahí seguiría: un `<body>` vacío respondiendo 200 y siendo indexable. La auditoría SEO lo marcó como URL a cerrar, y el informe de ayer reconoció que «deja de publicarse» era verdad solo a medias.

```yaml
- name: 'Retirar index.csr.html si quedara publicado'
  run: |
      aws s3 rm s3://moviapass-com/index.csr.html
```

**Es idempotente sin necesidad de trucos.** `aws s3 rm` sobre una clave concreta llama a `DeleteObject`, que en S3 responde igual exista el objeto o no. En el caso normal —que no esté— el paso sale en verde sin hacer nada.

Dos ausencias deliberadas:

- **Sin `|| true`.** Tapar el código de salida haría que un fallo real —permisos del rol, bucket mal escrito— pasara desapercibido. Como el comando ya es idempotente, el `|| true` solo serviría para ocultar los errores que sí importan.
- **Sin `--recursive` y sobre una clave literal.** Un borrado recursivo en la raíz de este bucket se lleva el sitio entero.

---

## 4 · actionlint en el CI

En el informe de la caché quedó anotado que no se había podido pasar actionlint en local: es un binario de Go y no hay paquete de npm con ejecutable. La forma de cerrarlo de verdad es que corra en el runner, que es Linux.

```yaml
- name: Instalar actionlint
  if: steps.cambios.outputs.workflows == 'true'
  run: |
      curl -sSfL \
        https://raw.githubusercontent.com/rhysd/actionlint/v1.7.12/scripts/download-actionlint.bash \
        -o download-actionlint.bash
      bash download-actionlint.bash 1.7.12 .
      ./actionlint --version
```

**La versión va fijada en los dos sitios**, y los dos hacen falta: la etiqueta `v1.7.12` de la que se descarga el script, y el argumento `1.7.12` que elige el binario. Apuntar el script a `main` dejaría que el propio instalador cambiara sin avisar, y pasar `latest` haría que cada ejecución usara una versión distinta sin que el historial lo registre — un CI que empieza a fallar sin que nadie haya tocado nada.

> El argumento va **sin** la `v`: lo pide así el script (`bash download-actionlint.bash 1.6.9`). Se comprobó leyendo el propio script, no de memoria. Detalle curioso: el script en la etiqueta `v1.7.12` tiene como valor por defecto `1.7.11`, así que pasar la versión explícita no es opcional si se quiere exactamente la 1.7.12.
>
> `v1.7.12` es la última publicada (30 de marzo de 2026), consultada contra la API de GitHub antes de escribirla.

**Solo corre si cambia algo en `.github/workflows/`.** La detección va dentro del job y no en un `paths:` de arriba, porque `paths:` filtra el workflow **entero**: pondría también el lint, las pruebas y el build a saltarse cuando se toca cualquier otra cosa, que es exactamente lo contrario de lo que se quiere.

```yaml
- name: Detectar cambios en los workflows
  id: cambios
  env:
      EVENTO: ${{ github.event_name }}
      BASE_PR: ${{ github.event.pull_request.base.sha }}
      BASE_PUSH: ${{ github.event.before }}
      ACTUAL: ${{ github.sha }}
  run: |
      if [ "$EVENTO" = "pull_request" ]; then base="$BASE_PR"; else base="$BASE_PUSH"; fi
      if [ -z "$base" ] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
        echo "workflows=true" >> "$GITHUB_OUTPUT"; exit 0
      fi
      if git diff --name-only "$base" "$ACTUAL" | grep -q '^\.github/workflows/'; then
        echo "workflows=true" >> "$GITHUB_OUTPUT"
      else
        echo "workflows=false" >> "$GITHUB_OUTPUT"
      fi
```

Dos detalles con intención:

- **Ante la duda, valida.** Una rama nueva trae `github.event.before` a ceros y un push forzado puede dejar un SHA que ya no existe. En esos casos no hay con qué comparar, y el job sale por `true`: quedarse sin revisar los workflows justo cuando el historial está raro es el peor momento para ahorrar un minuto.
- **Los valores del evento entran por `env:`**, no interpolados dentro del script. Es la forma de que un valor del evento no pueda acabar ejecutándose como parte del comando. Aquí son SHAs y el nombre del evento, así que el riesgo es teórico, pero es la costumbre correcta y actionlint la premia.

---

## Verificación

### actionlint, ahora sí, ejecutado

Se descargó el binario 1.7.12 a un directorio temporal —nada dentro del repositorio— y se pasó sobre los dos workflows:

```
$ actionlint --version
1.7.12
$ actionlint .github/workflows/ci.yml .github/workflows/deploy.yml
$ echo $?
0
```

**Cero errores en los dos.** Se pasó además después de cada uno de los cuatro commits, no solo al final.

> Con una salvedad honesta: en modo verboso actionlint informa de que dos reglas quedaron desactivadas por falta de sus binarios en esta máquina — `Rule "shellcheck" was disabled` y `Rule "pyflakes" was disabled`. En el runner de `ubuntu-latest` shellcheck viene preinstalado, así que **el job del CI hará más comprobaciones que las que se han podido hacer aquí**, no menos.

### La partición, releída del YAML nuevo

Se volvió a parsear `deploy.yml` ya guardado, a extraer los filtros de cada `aws s3 sync` y a aplicarlos a las 88 claves reales del dist:

```
═══ pasadas de sync leídas del YAML nuevo ═══
  · Grupo 1 · JS y CSS con hash (caché de un año, SIN --delete)
      cache-control: public,max-age=31536000,immutable
      --delete: NO
      filtros: [["exclude","*"],["include","*.js"],["include","*.css"]]
  · Grupo 2 · Estáticos de public/ sin hash (caché de un día)
      cache-control: public,max-age=86400
      --delete: SÍ
      filtros: [["exclude","*.js"],["exclude","*.css"],["exclude","*.html"],["exclude","robots.txt"],["exclude","sitemap.xml"]]
  · Grupo 3 · HTML, robots y sitemap (sin caché)
      cache-control: no-cache
      --delete: SÍ
      filtros: [["exclude","*"],["include","*.html"],["include","robots.txt"],["include","sitemap.xml"],["exclude","index.csr.html"]]

═══ reparto de las 88 claves reales ═══
   23  Grupo 1 · JS y CSS con hash (caché de un año, SIN --delete)   [--delete: NO]
   52  Grupo 2 · Estáticos de public/ sin hash (caché de un día)   [--delete: sí]
   12  Grupo 3 · HTML, robots y sitemap (sin caché)   [--delete: sí]
    1  sin pasada: index.csr.html

  ¿claves en DOS pasadas?  NINGUNA ✅
  ¿claves sin subir?       solo index.csr.html, y ahora un paso propio lo RETIRA de S3 ✅
```

**La partición sigue intacta.** 23 + 52 + 12 + 1 = 88.

Los dos pasos nuevos quedan **fuera** de la partición y no la alteran, porque no son pasadas de sincronización: uno es un `aws s3 cp` sobre una clave concreta y el otro un `aws s3 rm` sobre otra.

### Quién borra y quién no

| Pasada                            | `--delete` | Por qué                                                                        |
| --------------------------------- | :--------: | ------------------------------------------------------------------------------ |
| Grupo 1 · JS y CSS con hash       |   **NO**   | Las claves no se reutilizan; borrarlas rompe el HTML que aún se está sirviendo |
| Grupo 2 · Estáticos de `public/`  |   **SÍ**   | Las claves se reutilizan; una imagen retirada tiene que desaparecer            |
| Grupo 3 · HTML, robots, sitemap   |   **SÍ**   | El HTML de una ruta eliminada se quedaría sirviéndose e indexable              |
| _(paso)_ Retirar `index.csr.html` |     —      | `aws s3 rm` de una clave exacta, no es un sync                                 |

Sigue siendo seguro que dos pasadas borren, por la misma razón que antes: **los filtros particionan el espacio de claves**, así que una pasada solo puede borrar dentro de su grupo y ninguna toca lo que otra acaba de subir.

### YAML y shell

| Comprobación                                                                          | Resultado                                                                          |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| YAML bien formado                                                                     | ✅ los dos archivos                                                                |
| Estructura de workflow (`name`, `on`, `jobs`, `runs-on`, `steps`, `uses` **o** `run`) | ✅ `ci.yml` con 3 jobs (`verify`, `secret-scan`, `actionlint`), `deploy.yml` con 1 |
| `bash -n` de cada bloque `run`                                                        | ✅ los 17                                                                          |
| actionlint 1.7.12                                                                     | ✅ 0 errores                                                                       |

---

## Lo que queda por comprobar en el primer despliegue

Sigue en pie del informe anterior, y ahora con una línea más:

```bash
curl -sI https://moviapass.com/main-XXXXXXXX.js      | grep -i cache-control   # max-age=31536000, immutable
curl -sI https://moviapass.com/favicon.png           | grep -i cache-control   # max-age=86400
curl -sI https://moviapass.com/robots.txt            | grep -i cache-control   # no-cache
curl -sI https://moviapass.com/manifest.webmanifest  | grep -iE 'content-type|cache-control'
#   → application/manifest+json  y  max-age=86400
curl -sI https://moviapass.com/index.csr.html        | head -1                 # 403 o 404, nunca 200
```

## Confirmación

- **No se hizo push** y **no se ejecutó ningún workflow**. Los comandos de AWS de este informe describen lo que hará el despliegue; ninguno se ha lanzado.
- Cuatro commits, uno por cambio. Los tres de `deploy.yml` se separaron reconstruyendo los estados intermedios, y se comprobó que el resultado final coincide **byte a byte** con el archivo que se verificó.
- El binario de actionlint se descargó a `/tmp`, no al repositorio: `git status` queda limpio.
