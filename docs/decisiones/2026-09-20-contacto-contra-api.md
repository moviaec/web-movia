# El formulario de contacto habla con `api-movia`

**Estado:** decidido y aplicado · el despliegue de la API para producción sigue ABIERTO

## Qué se decide

La landing **deja de ser 100 % estática en un punto y solo en uno**: el formulario de `/contact` envía lo que se escribe a la API de Movía (`api-movia`, el mismo NestJS que sirve a la app y al portal de partners), que guarda la solicitud en MariaDB y manda el acuse por correo desde `no-reply@moviapass.com`.

Todo lo demás sigue igual: el contenido de las páginas son constantes tipadas en `core/constants/`, el build sigue siendo `outputMode: "static"` con un HTML prerenderizado por ruta, y no hay ningún otro sitio del sitio que consulte nada.

## Por qué había que decidirlo y no simplemente escribirlo

`CLAUDE.md` prohíbe `HttpClient` y exige hablarlo ANTES, con este ejemplo literal: «un formulario de contacto contra un servicio externo». La razón de esa regla es que un sitio sin backend y un sitio con backend no se despliegan, ni se prueban, ni se rompen igual. Al aceptarla, lo que cambia es esto:

- Aparece una dependencia de red en tiempo de ejecución. La página sigue pintándose sin la API, pero **el formulario deja de funcionar si la API no responde**, y eso hay que verlo en pantalla, no en un log: por eso el estado de envío es un `signal` con cuatro valores y el error ofrece el correo del pie como salida.
- Aparece un **segundo repositorio en el camino crítico** de una pantalla de la landing. El contrato entre los dos (campos, topes, valores de la audiencia) está escrito dos veces, una en cada lado, porque no hay paquete compartido.
- Aparece **CORS**. La API mantiene una lista explícita de orígenes (`CORS_ORIGINS`), nunca `*`.

## Qué se descartó

- **Un servicio de formularios de terceros** (Formspree y similares): mete un proveedor más en un producto que ya tiene su propia API con su tabla, su correo y su panel. El mensaje viviría fuera de Movía.
- **Un `mailto:` y nada más**: no deja registro. Una solicitud que solo existe en una bandeja de entrada no se puede contar, ni repartir por equipo, ni buscar por número.
- **Crear una API nueva solo para esto**: ya existe `api-movia`, con SES configurado y el remitente `no-reply@moviapass.com` verificado. Un segundo servicio sería un segundo despliegue que mantener para un endpoint.

## Cómo queda montado

| Pieza                   | Dónde                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- |
| Base de la API          | `environment.apiUrl` (dev `http://localhost:3000`)                           |
| Cliente HTTP            | `provideHttpClient(withFetch())` en `app.config.ts`                          |
| Única llamada del sitio | `core/services/contact.service.ts`                                           |
| Contrato tipado         | `core/interfaces/contact.interface.ts` + `core/types/contact.type.ts`        |
| Endpoint                | `POST /contact-requests` en `api-movia`                                      |
| Tabla                   | `contact_requests` (migración `1788400000000-ContactRequests`)               |
| Correo                  | plantilla `contact_received`, enviada con SES desde `no-reply@moviapass.com` |

`core/services/` es una carpeta NUEVA en `core/`. `CLAUDE.md` describía `interfaces/`, `types/`, `constants/` y `utils/`, y un service inyectable no es ninguna de las cuatro: no es una forma, ni una unión, ni un valor en runtime, ni una función pura. Va en `core/` porque es transversal y singleton (`providedIn: 'root'`), como el resto de `core/`.

## Lo que queda abierto

1. **La URL de la API en producción.** `environment.prod.ts` apunta hoy a `https://api.moviapass.com`, que es la forma que sigue a `app.moviapass.com` pero **todavía no existe**. Mientras no se despliegue, el formulario de una build de producción no envía nada.
2. **`CORS_ORIGINS` de la API tiene que incluir `https://moviapass.com`** el día que se publique la landing. Hoy solo lleva los dos orígenes de desarrollo, así que el navegador bloquearía la petición antes de que salga.
3. **Nadie en Movía recibe aviso de que llegó una solicitud.** El acuse va a quien escribe; el equipo tiene que mirar la tabla. Un correo interno, o un listado en el back-office, es trabajo aparte.
4. **Sin captcha.** La defensa hoy es el límite por IP del endpoint (3 por minuto). Si empieza a entrar basura, el siguiente paso es un captcha o una pregunta trampa, y eso cambia la pantalla.
