# actionlint: descarga directa del binario y verificación del checksum

**Punto de partida:** [El despliegue deja de borrar los chunks](2026-09-21-deploy-sin-borrado-de-chunks.md), del mismo día, que añadió el job de actionlint al CI usando el script oficial de instalación. Ese paso falla en el runner.
**Qué se toca:** solo el paso «Instalar actionlint» de `.github/workflows/ci.yml`. **Sin push.**

## El fallo

`download-actionlint.bash` descargaba **92 bytes** en lugar del tar y `tar` abortaba con `not in gzip format`.

Noventa y dos bytes es el tamaño de una respuesta de redirección, no el de un binario de 5 MB. GitHub sirve los artefactos de una release **redirigiendo** a su almacenamiento, y lo que el script guardaba era esa respuesta intermedia: un archivo de texto con extensión `.tar.gz`.

> **No se pudo reproducir en local, y conviene decirlo.** Esta máquina es macOS sobre arm64 y ahí el mismo script funciona: descarga el binario de darwin y termina con `Done: 1.7.12`. El fallo es específico del entorno del runner. Por eso la corrección no se validó reproduciendo el error, sino **comprobando directamente el artefacto de Linux** que el paso nuevo va a usar.

## El paso nuevo

```yaml
env:
    # La version de actionlint, en un UNICO sitio.
    ACTIONLINT_VERSION: 1.7.12

# …

- name: Instalar actionlint
  if: steps.cambios.outputs.workflows == 'true'
  run: |
      base="https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}"
      tar_gz="actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"
      checksums="actionlint_${ACTIONLINT_VERSION}_checksums.txt"

      curl -sSfL "${base}/${tar_gz}" -o "${tar_gz}"
      curl -sSfL "${base}/${checksums}" -o "${checksums}"

      grep " ${tar_gz}$" "${checksums}" > esperado.sha256
      sha256sum --check --strict esperado.sha256

      tar -xzf "${tar_gz}" actionlint
      ./actionlint --version
```

### Por qué cada línea es como es

**`curl -sSfL`.** La `L` sigue la redirección, que es exactamente lo que le faltaba al script. La `f` es igual de importante: sin ella, un 404 o una página de error se guardarían **como si fueran el tar**, que es la forma sutil de este mismo fallo. Y `-sS` calla la barra de progreso pero deja pasar los errores al log.

**La verificación no es un adorno.** Sin ella, este paso descarga un binario de internet y lo ejecuta contra el repositorio, en un job que tiene el código delante. Comparar el SHA-256 contra el archivo de checksums de la misma release convierte eso en algo comprobable: si el archivo no es exactamente el que se publicó, el paso se detiene **antes** de extraer nada.

**El `grep` escribe a un archivo y no va por tubería.** Es la parte menos obvia. Como comando suelto, si la línea no aparece —una versión mal escrita, un archivo de checksums con otro formato— devuelve 1 y el `set -e` del shell para el paso en el acto. Dentro de una tubería (`grep … | sha256sum -c -`) ese fallo se perdería, porque **GitHub no activa `pipefail`** en el shell por defecto: el código de salida de una tubería es el del último comando, y el `sha256sum` de la derecha podría enmascararlo.

**`--strict`** hace que `sha256sum` falle también si el archivo de checksums tiene alguna línea mal formada, en vez de saltársela en silencio.

**`tar -xzf "${tar_gz}" actionlint`** extrae solo el binario. El archivo trae además `LICENSE.txt`, `README.md`, `man/actionlint.1` y una carpeta `docs/` con siete archivos, y nada de eso pinta en el directorio de trabajo del job.

**`./actionlint --version`** es una prueba de humo: confirma que lo extraído se ejecuta, antes de que el paso siguiente dependa de ello.

### La versión, en un solo sitio

`env.ACTIONLINT_VERSION` del job. De ahí salen las tres cosas que la nombran —la etiqueta de la release, el nombre del tar y el del archivo de checksums—, y comprobado que `1.7.12` aparece **una sola vez** en todo `ci.yml`:

```
env del job actionlint: {"ACTIONLINT_VERSION":"1.7.12"}
apariciones literales de la versión en todo el archivo: 1  (debe ser 1: la del env)
```

Antes estaba en dos: la etiqueta de la que se bajaba el script y el argumento que se le pasaba.

## Verificación

### El artefacto de Linux, comprobado contra la fuente

```
$ curl -sSfL ".../v1.7.12/actionlint_1.7.12_linux_amd64.tar.gz" -o actionlint_linux.tar.gz
$ ls -l actionlint_linux.tar.gz
-rw-r--r--  2353908  actionlint_linux.tar.gz
$ file -b actionlint_linux.tar.gz
gzip compressed data, max compression, original size modulo 2^32 6267904
```

2,3 MB y gzip de verdad — no 92 bytes de una redirección.

```
$ shasum -a 256 actionlint_linux.tar.gz
8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8
$ grep linux_amd64 actionlint_1.7.12_checksums.txt
8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8  actionlint_1.7.12_linux_amd64.tar.gz
```

Contenido del archivo, que confirma que el binario está en la raíz y se llama `actionlint`:

```
LICENSE.txt   README.md   docs/README.md   docs/api.md   docs/checks.md
docs/config.md   docs/install.md   docs/reference.md   docs/usage.md
man/actionlint.1   actionlint
```

### El paso, ejecutado tal como queda en el YAML

No se probó una copia a mano del script: se **extrajo el bloque `run` del `ci.yml` ya guardado** y se ejecutó en un directorio aparte, con un sustituto de `sha256sum` porque macOS trae `shasum` en su lugar.

```
ACTIONLINT_VERSION del job: 1.7.12
═══ ejecutando el paso tal cual ═══
actionlint_1.7.12_linux_amd64.tar.gz: OK
paso.sh: line 13: ./actionlint: cannot execute binary file

═══ qué quedó en el directorio de trabajo ═══
  actionlint
  actionlint_1.7.12_checksums.txt
  actionlint_1.7.12_linux_amd64.tar.gz
  esperado.sha256
```

Las dos curls funcionan, el `grep` encuentra la línea, el checksum da **OK** y `tar` deja **solo** el binario: ni LICENSE, ni README, ni `docs/`, ni `man/`.

El `cannot execute binary file` del final es lo esperado y es buena señal: es un binario de Linux x86-64 ejecutándose en macOS arm64. En el runner sí se ejecuta — y si algún día `ubuntu-latest` dejara de ser x86-64, este mismo error avisaría en el acto en vez de fallar más adelante de forma confusa.

### Los dos caminos de fallo

Lo importante de una verificación es que **pare de verdad**. Se comprobaron los dos casos:

| Caso                                           | Salida                                                                               | Código | ¿Llegó a extraer? |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | -----: | ----------------- |
| Tar alterado (mismo nombre, un byte de más)    | `actionlint_1.7.12_linux_amd64.tar.gz: FAILED` · `1 computed checksum did NOT match` |  **1** | **No**            |
| Versión que no está en el archivo de checksums | _(el `grep` no encuentra nada)_                                                      |  **1** | **No**            |

En el primero, el directorio quedó con el tar, el archivo de checksums y `esperado.sha256`, **pero sin binario `actionlint`**: la comprobación corta antes del `tar`.

### El resto

| Comprobación                                    | Resultado                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| actionlint 1.7.12 sobre `ci.yml` y `deploy.yml` | ✅ 0 hallazgos                                                                     |
| YAML bien formado y estructura de workflow      | ✅ `ci.yml` (3 jobs: `verify`, `secret-scan`, `actionlint`) y `deploy.yml` (1 job) |
| `bash -n` de cada bloque `run`                  | ✅ los 17                                                                          |
| La versión aparece una sola vez                 | ✅                                                                                 |

## Nota para cuando toque subir de versión

Cambiar `ACTIONLINT_VERSION` y nada más. Los nombres de los artefactos (`actionlint_<version>_linux_amd64.tar.gz` y `actionlint_<version>_checksums.txt`) siguen ese patrón en todas las releases, y el checksum se lee de la propia release, así que no hay ningún valor que actualizar a mano ni que pueda quedarse desfasado.

## Confirmación

- **No se hizo push** y **no se ejecutó ningún workflow**.
- Un commit: `fix(ci): descargar el binario de actionlint directamente y verificarlo`.
- Las descargas de prueba y el binario quedaron en `/tmp`, fuera del repositorio: `git status` limpio.
