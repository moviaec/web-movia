# Workflows de CI y despliegue, adaptados desde `app-movia`

Encargo: revisar la carpeta `.github/` que había en local y dejarla equivalente a la de `app-movia`, **adaptada a este proyecto**.

Lo que había era una **copia byte a byte** de `app-movia` — `diff` de los dos archivos contra los originales: idénticos, sin una sola línea cambiada. Es decir, todas las referencias al proyecto estaban mal: el script que se ejecuta, la carpeta que se sube, el bucket, el dominio que se verifica y el grupo de concurrencia.

## Diferencias encontradas

### `ci.yml`

| #   | Qué estaba mal                                                                            | Consecuencia                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `- run: npm run build:native`                                                             | **El job siempre fallaba.** Ese script no existe en `web-movia` (es el build de Capacitor de la app); npm corta con `Missing script: "build:native"` después de que lint, test y build hayan pasado |
| 2   | El comentario de `TZ` hablaba de «aserciones sobre horarios» y de `vitest-base.config.ts` | Ninguna de las dos cosas existe aquí. La variable sí tiene sentido en este repositorio, pero por otra razón                                                                                         |
| 3   | `- run: npm run test` a secas                                                             | En `app-movia` el script ya trae `--no-watch`; aquí `"test": "ng test"`. Funciona igualmente en CI, pero por un motivo frágil (ver abajo)                                                           |

### `deploy.yml`

| #   | Qué estaba mal                                         | Valor correcto                                                                                                                    |
| --- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 4   | `concurrency.group: deploy-app-produccion`             | `deploy-web-produccion` — si no, dos despliegues de proyectos distintos se serializan entre sí sin motivo                         |
| 5   | `dist/app-movia/browser` (dos veces)                   | `dist/web-movia/browser`                                                                                                          |
| 6   | `s3://app-moviapass-com` (dos veces)                   | `s3://moviapass-com` — **subía la landing encima de la app**                                                                      |
| 7   | `### 🚀 Desplegado en app.moviapass.com` en el resumen | `moviapass.com`                                                                                                                   |
| 8   | `curl -sfI https://app.moviapass.com`                  | `https://moviapass.com` — verificaba un dominio que no es el que se acaba de desplegar, así que un despliegue roto salía en verde |
| 9   | Comentario «A diferencia del API…»                     | Reescrito para este proyecto                                                                                                      |

## Comprobaciones pedidas

| Punto                                             | Resultado                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. No incluir `build:native`                      | Eliminado                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2. Ruta de build `dist/web-movia/browser`         | **Confirmada.** `angular.json` no declara `outputPath`, así que el builder usa `dist/<nombre-del-proyecto>`, y el proyecto se llama `web-movia`. Verificado además contra la salida real de `npm run build:prod`                                                                                                                                                                                                                               |
| 3. Bucket `s3://moviapass-com`                    | Aplicado en las dos pasadas de `s3 sync`                                                                                                                                                                                                                                                                                                                                                                                                       |
| 4. `npm run test` sin modo vigilancia en CI       | **Sí corre sin vigilancia**, pero por defecto implícito: el builder `@angular/build:unit-test` documenta `watch` como «true en entornos TTY, false en el resto», y un runner de GitHub no es TTY. Se dejó **explícito en el workflow** (`npm run test -- --no-watch`) sin tocar `package.json`, porque un default no es un contrato y el modo de fallar es el peor posible: el job no revienta, se queda colgado hasta el límite de seis horas |
| 5. `.nvmrc` compatible con `engines: ">=22.12.0"` | **Sí.** `.nvmrc` = `v22.23.1`. `actions/setup-node` acepta el prefijo `v` en `node-version-file`                                                                                                                                                                                                                                                                                                                                               |
| 6. Nunca deploy automático en push                | `deploy.yml` solo tiene `workflow_dispatch`. Se añadió un comentario que dice por qué, para que nadie «lo arregle» añadiendo un `push`                                                                                                                                                                                                                                                                                                         |

## Qué hace falta en GitHub para que el deploy funcione

Nada de esto está en el repositorio y sin ello el workflow falla en el paso de credenciales:

- Un **environment llamado `production`** en el repositorio (y ahí es donde conviene exigir aprobación manual).
- Secreto **`AWS_DEPLOY_ROLE_ARN`**: el rol que GitHub asume por OIDC. Requiere que el proveedor OIDC de GitHub esté dado de alta en la cuenta de AWS y que la política de confianza del rol restrinja `sub` a este repositorio. El workflow ya pide `id-token: write`, que es la mitad que le toca a GitHub.
- Secreto **`CLOUDFRONT_DISTRIBUTION_ID`** de la distribución que sirve `moviapass.com`.
- El bucket **`moviapass-com`** creado, y la distribución de CloudFront resolviendo las rutas sin extensión a su `index.html` (ver `docs/decisiones/2026-09-20-dominio-y-hosting.md`: hace falta una función en `viewer-request`; el `DefaultRootObject` **no** sirve).

## Dos cosas que quedaban sabidas — resueltas el mismo día

Las dos se dejaron fuera del encargo original, que pedía equivalencia con `app-movia`. Se corrigieron después, en el mismo 2026-09-20, tocando solo la pasada de HTML de `deploy.yml`:

```diff
-  --exclude "*" --include "*.html"
+  --delete --exclude "*" --include "*.html" --exclude "index.csr.html"
```

1. **El HTML viejo no se borraba nunca.** El `--delete` iba solo en la pasada de assets, y esa pasada excluye `*.html`; la segunda no lo llevaba. En `app-movia`, que es una SPA con un solo `index.html`, da igual. Aquí son **once** archivos HTML, uno por ruta prerenderizada: el día que se retirase una ruta, su `index.html` se quedaba en S3 sirviéndose y siendo indexable. **Ahora la pasada de HTML lleva su propio `--delete`**, así que el HTML de una ruta retirada desaparece en el siguiente despliegue.
2. **`index.csr.html` se subía.** Es el cascarón vacío de client-side rendering que el build emite siempre. **Ahora el último `--exclude` lo deja fuera**, así que ya no se publica: la auditoría SEO del mismo día lo recogía como hallazgo y su `Disallow` en el `robots.txt` deja de hacer falta. Ver `docs/diagnosticos/2026-09-20-auditoria-seo.md`.

### Por qué ese `--delete` no se lleva por delante los assets

Era el motivo por el que no estaba, y el comentario del workflow lo afirmaba al revés. La documentación de `aws s3 sync` lo desmiente en la propia descripción del flag:

> _Files that exist in the destination but not in the source are deleted during sync. **Note that files excluded by filters are excluded from deletion.**_

Es decir, **los filtros acotan también el borrado**, no solo la subida. Como esta pasada empieza por `--exclude "*"`, todo lo que no sea `.html` queda fuera de las dos cosas: los assets que acaba de subir el paso anterior ni se vuelven a tocar ni se borran.

El orden de los filtros importa, y es el que documenta AWS: _«los filtros que aparecen después en el comando tienen precedencia sobre los que aparecen antes»_. Por eso la secuencia es `--exclude "*"` → `--include "*.html"` → `--exclude "index.csr.html"`: el último gana sobre el `--include` anterior y saca el cascarón de la subida **y del borrado**.

No se pudo verificar con un `aws s3 sync --dryrun` real porque el bucket `moviapass-com` **todavía no existe** (`NoSuchBucket`); la comprobación es documental. Eso mismo hace que el `index.csr.html` que ya estuviera publicado no sea un problema: al estar excluido, un despliegue no lo borraría, pero nunca ha llegado a subirse nada.

## Sin tocar

`package.json` (el `test` sigue siendo `ng test`, con vigilancia en local), `angular.json`, `.nvmrc` y el resto del proyecto. Los dos workflows conservan la indentación de cuatro espacios de `app-movia`: Prettier preferiría dos, pero ni `.prettierrc` ni `lint-staged` cubren `.yml` en este repositorio, y el original tiene exactamente el mismo formato.
