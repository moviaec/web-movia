# Los planes de `/plans` salen de `api-movia`

**Estado:** decidido y aplicado · falta rellenar las descripciones y el despliegue de la API

## Qué se decide

La página de planes deja de pintar constantes y lee el catálogo público de la API: `GET /plans/public?countryCode=EC&audience=b2c` para las tarjetas individuales y `…&audience=empresa` para el bloque corporativo. Se pintan **todos los planes activos que devuelva**, en su `sortOrder`, incluido el gratuito.

Es la segunda llamada remota del sitio, después del formulario de contacto (`2026-09-20-contacto-contra-api.md`), y la primera que **lee** contenido.

## Por qué

Los planes son datos del back-office, no copy de la landing: el precio, los beneficios y cuál es el popular se editan allí. Con los planes en `core/constants/` había dos catálogos que se desincronizaban en cuanto alguien cambiaba un precio en la BD.

## Qué hubo que añadir a la API

| Cambio                                      | Por qué                                                                                                                                               |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `?countryCode=` (ISO) además de `countryId` | La landing no tiene usuario ni país; el UUID del país cambia entre la BD de dev y la de prod, el código ISO no.                                       |
| `?audience=` (por defecto `b2c`)            | El catálogo excluía los planes de empresa, y la landing los pinta aparte. La app no cambia: sin el parámetro sigue recibiendo solo los de particular. |
| Columna `plans.description` (nullable)      | La tarjeta pinta una frase «para quién es». Migración `1788600000000-PlanDescription`, que además recrea los triggers de auditoría de `plans`.        |

## Cómo queda montado

- **Se pide solo en el navegador.** El build prerenderiza `/plans`. Pedir los planes ahí congelaría en el HTML los precios del día del build, y el build fallaría si la API no respondiera. El HTML estático lleva tarjetas de relleno y el navegador las cambia por las reales. `resource()` se queda en reposo en el servidor, así que la hidratación coincide.
- **Tres estados en pantalla:** relleno mientras carga (con aviso `aria-live`), error con «Reintentar» y las tarjetas.
- **El dinero llega en unidad mínima** con su moneda y sus decimales. Lo formatea `formatMinorUnits` (`core/utils/money.utils.ts`) con `es-EC`: `3999` se pinta como `$39,99`.
- **El JSON-LD `Product` se construye con la misma respuesta** (`buildPlansProductSchema`) y lo escribe la página al llegar los planes. Ya no está en el HTML prerenderizado; Google lo lee al renderizar la página.

## Lo que queda abierto

1. **Las descripciones están vacías en la BD.** Hasta que alguien las escriba desde el back-office (o con `PATCH /plans/:id`), las tarjetas salen sin esa línea. Los textos que tenía la landing están en el historial de `core/constants/plans.constants.ts`.
2. **CORS.** La API tiene que aceptar el origen de la landing: `https://moviapass.com` en producción. En local, el `.env` de la API solo tiene `http://localhost:4200`, que ya ocupa `web-partner-movia`.
3. **El `title` y la `description` SEO de `/plans` siguen escritos a mano** («desde $39,99 al mes, de 8 a 28 check-ins»). Con el plan gratuito y los precios en la BD pueden dejar de ser ciertos.
4. **El back-office** (`web-hub-movia`) todavía no tiene el campo `description` en su formulario de planes.
