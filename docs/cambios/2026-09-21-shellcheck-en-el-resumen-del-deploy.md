# SC2086 y SC2129 en el resumen del despliegue

**Punto de partida:** [actionlint: descarga directa del binario](2026-09-21-actionlint-descarga-directa.md), del mismo día. Con el job de actionlint ya funcionando en el runner, aparecen los primeros hallazgos reales.
**Qué se toca:** un solo paso de `.github/workflows/deploy.yml`. **Sin push.**

## Por qué no salieron antes

Los dos informes anteriores decían que actionlint daba **0 hallazgos**. Era cierto, pero incompleto, y quedó anotado entonces: actionlint delega el análisis de los `run:` en **shellcheck**, y si el binario no está lo desactiva en silencio.

```
verbose: Rule "shellcheck" was disabled: exec: "shellcheck": executable file not found in $PATH
```

Es decir: las reglas que revisan el shell nunca se ejecutaron en local. En el runner sí —`ubuntu-latest` trae shellcheck preinstalado—, y de ahí salen estos seis hallazgos.

Para esta corrección se consiguió shellcheck en local (0.11.0, vía `npx shellcheck`, que descarga el binario), así que **por primera vez se ha podido reproducir lo que ve el CI**:

```
$ PATH="…:$PATH" actionlint .github/workflows/deploy.yml .github/workflows/ci.yml
deploy.yml:46:15: SC2086:info:1:45: Double quote to prevent globbing and word splitting
deploy.yml:46:15: SC2086:info:2:12: Double quote to prevent globbing and word splitting
deploy.yml:46:15: SC2086:info:3:57: Double quote to prevent globbing and word splitting
deploy.yml:46:15: SC2086:info:4:50: Double quote to prevent globbing and word splitting
deploy.yml:46:15: SC2086:info:5:49: Double quote to prevent globbing and word splitting
deploy.yml:46:15: SC2129:style:1:1: Consider using { cmd1; cmd2; } >> file instead of individual redirects
exit=1
```

Cinco SC2086 —uno por línea— y un SC2129, todo en el mismo paso. **Nada en `ci.yml`.**

## El cambio

```diff
               - name: Mostrar commit desplegado
                 run: |
-                  echo "### 🚀 Desplegado en moviapass.com" >> $GITHUB_STEP_SUMMARY
-                  echo "" >> $GITHUB_STEP_SUMMARY
-                  echo "**Commit:** \`$(git rev-parse --short HEAD)\`" >> $GITHUB_STEP_SUMMARY
-                  echo "**Mensaje:** $(git log -1 --pretty=%s)" >> $GITHUB_STEP_SUMMARY
-                  echo "**Autor:** $(git log -1 --pretty=%an)" >> $GITHUB_STEP_SUMMARY
+                  {
+                    echo "### 🚀 Desplegado en moviapass.com"
+                    echo ""
+                    echo "**Commit:** \`$(git rev-parse --short HEAD)\`"
+                    echo "**Mensaje:** $(git log -1 --pretty=%s)"
+                    echo "**Autor:** $(git log -1 --pretty=%an)"
+                  } >> "$GITHUB_STEP_SUMMARY"
```

Es el diff completo de la tarea: `git diff --name-only` devuelve **un solo archivo**, y dentro de él **un solo bloque**. No se tocó nada más del workflow.

## SC2086 no era pedantería

Es fácil despachar «entrecomilla la variable» como manía del linter, sobre todo cuando la ruta la pone GitHub y hoy no lleva espacios. Se comprobó ejecutando las dos versiones contra la misma ruta con un espacio dentro:

```
$ GITHUB_STEP_SUMMARY="/tmp/con espacios.md" bash paso-nuevo.sh
  → escribió 5 líneas ✅

$ GITHUB_STEP_SUMMARY="/tmp/viejo espacios.md" bash paso-viejo.sh
  paso-viejo.sh: line 1: $GITHUB_STEP_SUMMARY: ambiguous redirect
  paso-viejo.sh: line 2: $GITHUB_STEP_SUMMARY: ambiguous redirect
  → no creó ningún archivo
```

La versión anterior **no escribe nada** y suelta cinco «ambiguous redirect». Lo que había, entonces, era una suposición sobre cómo nombra GitHub sus archivos temporales; entrecomillar cuesta dos caracteres y deja de hacerla.

SC2129, por su parte, es de estilo puro: cinco `>>` abren y cierran el archivo cinco veces donde una basta. La ventaja práctica del bloque es otra: **la ruta aparece una sola vez**, así que no puede quedarse a medio corregir.

## Verificación

### La salida del paso no cambia

Se extrajo el bloque `run` del YAML ya guardado, se ejecutaron las dos versiones contra archivos temporales y se compararon:

```
### 🚀 Desplegado en moviapass.com

**Commit:** `cadc136`
**Mensaje:** docs(ci): informe de la descarga directa de actionlint
**Autor:** Carlos Sanchez
```

`diff` entre la salida vieja y la nueva: **idénticas byte a byte**.

### El barrido del resto de variables

Se revisaron **todas** las referencias a variables de shell dentro de los `run:` de los dos workflows, comprobando una a una si estaban dentro de comillas dobles:

| Archivo      | Paso                              |                                                                          Referencias | Sin comillas |
| ------------ | --------------------------------- | -----------------------------------------------------------------------------------: | -----------: |
| `deploy.yml` | Mostrar commit desplegado         |                                                           1 (`$GITHUB_STEP_SUMMARY`) |            0 |
| `ci.yml`     | Detectar cambios en los workflows | 10 (`$EVENTO`, `$BASE_PR`, `$BASE_PUSH`, `$base` ×3, `$ACTUAL`, `$GITHUB_OUTPUT` ×3) |            0 |
| `ci.yml`     | Instalar actionlint               |             12 (`$ACTIONLINT_VERSION` ×3, `$base` ×2, `$tar_gz` ×4, `$checksums` ×3) |            0 |

Ninguna más pendiente. Los pasos de `ci.yml` ya se habían escrito con las variables entrecomilladas, y los `run:` restantes de `deploy.yml` —los tres `aws s3 sync`, el `cp`, el `rm`, la invalidación y el `curl` de verificación— no usan variables de shell.

### actionlint, ahora con shellcheck de verdad

```
$ PATH="…:$PATH" actionlint .github/workflows/deploy.yml .github/workflows/ci.yml
$ echo $?
0
```

Y la comprobación de que esta vez sí corrió: en el modo verboso, `shellcheck` **ya no aparece** en la lista de reglas desactivadas.

```
verbose: Rule "pyflakes" was disabled: exec: "pyflakes": executable file not found in $PATH
verbose: Found total 0 errors in 30 ms for .github/workflows/deploy.yml
```

Solo queda `pyflakes` fuera, y da igual: no hay ni un `run:` de Python en los dos workflows.

| Comprobación                                | Resultado                              |
| ------------------------------------------- | -------------------------------------- |
| actionlint 1.7.12 **con** shellcheck 0.11.0 | ✅ 0 hallazgos en los dos archivos     |
| Salida del paso, vieja vs. nueva            | ✅ idéntica                            |
| Comportamiento con una ruta con espacios    | ✅ la nueva funciona; la vieja fallaba |
| Referencias a variables sin comillas        | ✅ ninguna en los dos archivos         |
| Alcance del diff                            | ✅ un archivo, un bloque               |

## Una recomendación, no aplicada

La forma de que esto no se repita es **tener shellcheck en local**, no descubrirlo en el push. Hay dos caminos y ninguno se ha tomado, porque se sale de lo que pedía esta tarea:

- Un script de npm que envuelva `actionlint` para poder pasarlo antes de commitear. Hoy no se puede, porque actionlint no está entre las dependencias del proyecto y añadirlo requiere autorización.
- Un hook de `pre-commit` que lo ejecute cuando cambie algo de `.github/workflows/`. Lo mismo.

Mientras tanto, el job del CI cumple esa función, con la diferencia de que avisa un paso más tarde.

## Confirmación

- **No se hizo push** y **no se ejecutó ningún workflow**.
- Un commit para el arreglo: `fix(ci): agrupar las redirecciones del resumen del deploy y entrecomillar la ruta`.
- No se tocó `ci.yml`: no tenía nada que corregir.
- El binario de shellcheck se obtuvo con `npx` y vive en la caché de npx, fuera del repositorio; no se añadió ninguna dependencia al proyecto.
