# docs/

Documentación del proyecto `web-movia`. Todo archivo `.md` del repositorio vive aquí, agrupado por tipo, salvo dos excepciones: el `README.md` de la raíz (portada del repo) y los archivos de `.claude/` (gobernanza del agente).

## Convención

- Los archivos se nombran `YYYY-MM-DD-nombre-en-kebab-case.md`. La fecha es la de creación y **no se actualiza** después: un documento con fecha es un registro, no una página viva.
- Todo en minúsculas, sin acentos ni `ñ` en el nombre del archivo.
- Cada subcarpeta tiene su `README.md` diciendo qué entra y qué no.

| Carpeta                          | Qué contiene                                         |
| -------------------------------- | ---------------------------------------------------- |
| [`diagnosticos/`](diagnosticos/) | Auditorías y fotos del estado del proyecto           |
| [`cambios/`](cambios/)           | Informes de migraciones, refactors y actualizaciones |
| [`decisiones/`](decisiones/)     | Decisiones técnicas y su porqué (ADR ligeros)        |
| [`guias/`](guias/)               | Cómo desplegar, cómo arrancar, runbooks              |

## Índice

| Documento                                                                              | Fecha      | Qué contiene                                                                                                                                                                    | Estado                                                                    |
| -------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Estado inicial del proyecto](diagnosticos/2026-09-20-estado-inicial.md)               | 2026-09-20 | Diagnóstico de solo lectura del proyecto recién vaciado: entorno, dependencias, build, estructura, SEO, estilos y gobernanza                                                    | **Superado** — anterior a la migración SSG; sus §3 y §4 ya no son ciertas |
| [Migración a prerender SSG](cambios/2026-09-20-migracion-ssg.md)                       | 2026-09-20 | Paso de SPA client-side a `outputMode: "static"` sin servidor Node: qué hizo `ng add @angular/ssr`, por qué `main.server.ts` no se puede borrar y cómo se verificó el prerender | Vigente                                                                   |
| [Update de Angular 22.1.x y limpieza](cambios/2026-09-20-update-angular-y-limpieza.md) | 2026-09-20 | Convención de `docs/`, subida del árbol de Angular de 22.0.6 a 22.1.x, retirada de `@types/node` y activación de `withEventReplay()`                                            | Vigente                                                                   |
| [Dominio y hosting de la landing](decisiones/2026-09-20-dominio-y-hosting.md)          | 2026-09-20 | `moviapass.com` como apex de la landing y `app.moviapass.com` para la app; qué implica para `base href`, `siteUrl` y la resolución de rutas en el hosting                       | Vigente — el hosting concreto sigue abierto                               |
| [Design system derivado del Home](decisiones/2026-09-20-design-system.md)              | 2026-09-20 | Tokens de color, tipografía, espaciado y radios medidos sobre las capturas del Home, con su nivel de confianza y lo que falta por derivar                                       | Vigente — parcial, faltan Estudios, Empresas y Planes                     |
| [Gobernanza, dominio y bump de @ng-icons](cambios/2026-09-20-gobernanza-y-dominio.md)  | 2026-09-20 | Separación en commits de lo que quedaba pendiente, `docs/` documentado en CLAUDE.md, decisión de dominio y subida de `@ng-icons` a 36                                           | Vigente — la salida de la gobernanza del `.gitignore` queda pendiente     |
