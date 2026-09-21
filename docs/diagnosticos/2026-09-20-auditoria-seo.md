# Auditoría SEO de la landing

**Alcance:** las 10 rutas prerenderizadas de `web-movia`, auditadas sobre el HTML que recibe el bot (`dist/web-movia/browser/**/index.html`), no sobre el código fuente. Lighthouse 12 en móvil y escritorio contra el `dist` servido en local.
**Naturaleza:** solo lectura. **No se modificó ningún archivo del proyecto salvo este informe** y su fila en `docs/README.md`.

## Resumen ejecutivo

El sitio **se puede indexar hoy**: las diez rutas se prerenderizan con contenido real en el HTML, los títulos son únicos y están horneados, y el rendimiento en escritorio es sobresaliente (87–100). Pero **no está listo para competir**, y falla del todo en lo que el negocio pidió explícitamente: **compartir un enlace en WhatsApp, Facebook o LinkedIn muestra una vista previa vacía**, porque no existe ni una sola etiqueta Open Graph ni ninguna imagen social en todo el proyecto. A eso se suma que ninguna ruta tiene `meta description` ni `canonical`, que no hay `sitemap.xml` ni `robots.txt`, y que el Centro de ayuda —la página con más potencial de búsquedas de cola larga— llega a Google con **cero preguntas y cero respuestas** en el HTML. En móvil, que es el índice que Google usa, la home baja a 76 de Performance por 2,5 MB de imágenes sin formato moderno.

## Puntuaciones Lighthouse

`M` = móvil (emulación Moto G Power, 4G simulado, es el modo que Google usa para indexar). `D` = escritorio.

| Ruta                |     |   Perf | SEO |   A11y |  BP |   LCP |   CLS |   TBT | Elemento LCP           |
| ------------------- | --- | -----: | --: | -----: | --: | ----: | ----: | ----: | ---------------------- |
| `/`                 | M   | **76** |  91 |    100 | 100 | 7,2 s | 0,002 |  1 ms | `picture > img` (hero) |
| `/`                 | D   |     87 |  91 |    100 | 100 | 2,4 s | 0,003 |  0 ms | ídem                   |
| `/plans`            | M   |     96 |  91 |    100 | 100 | 2,6 s | 0,001 |  0 ms | texto                  |
| `/plans`            | D   |    100 |  91 |    100 | 100 | 0,5 s | 0,002 |  0 ms | texto                  |
| `/partners`         | M   |     86 |  91 |    100 | 100 | 4,2 s | 0,002 | 35 ms | texto                  |
| `/partners`         | D   |     99 |  91 |    100 | 100 | 0,9 s | 0,002 |  0 ms | texto                  |
| `/corporate`        | M   | **78** |  91 |    100 | 100 | 5,9 s | 0,030 |  1 ms | `img` (hero)           |
| `/corporate`        | D   |     98 |  91 |    100 | 100 | 1,1 s | 0,002 |  0 ms | ídem                   |
| `/contact`          | M   |     96 |  91 | **96** | 100 | 2,7 s | 0,000 |  2 ms | texto                  |
| `/contact`          | D   |    100 |  91 | **96** | 100 | 0,6 s | 0,000 |  0 ms | texto                  |
| `/help`             | M   |     96 |  91 | **97** | 100 | 2,7 s | 0,000 |  0 ms | texto                  |
| `/help`             | D   |    100 |  91 | **97** | 100 | 0,6 s | 0,047 |  0 ms | texto                  |
| `/legal`            | M   |     97 |  91 |    100 | 100 | 2,6 s | 0,019 |  0 ms | texto                  |
| `/legal`            | D   |    100 |  91 |    100 | 100 | 0,6 s | 0,001 |  0 ms | texto                  |
| `/legal/terms`      | M   |     96 |  91 |    100 | 100 | 2,7 s | 0,010 |  0 ms | texto                  |
| `/legal/terms`      | D   |    100 |  91 |    100 | 100 | 0,6 s | 0,001 |  0 ms | texto                  |
| `/legal/privacy`    | M   |     96 |  91 |    100 | 100 | 2,7 s | 0,010 |  0 ms | texto                  |
| `/legal/privacy`    | D   |    100 |  91 |    100 | 100 | 0,6 s | 0,001 |  0 ms | texto                  |
| `/legal/data-usage` | M   |     96 |  91 |    100 | 100 | 2,6 s | 0,010 | 14 ms | texto                  |
| `/legal/data-usage` | D   |    100 |  91 |    100 | 100 | 0,6 s | 0,001 |  0 ms | texto                  |

**El 91 de SEO es el mismo en las diez rutas y por la misma causa:** la única auditoría que falla es `meta-description`. Todas las demás (`is-crawlable`, `document-title`, `http-status-code`, `link-text`, `crawlable-anchors`, `image-alt`, `hreflang`) pasan.

## Hallazgos CRÍTICOS y ALTOS

| #   | Sev.    | Hallazgo                                                          |
| --- | ------- | ----------------------------------------------------------------- |
| 1   | CRÍTICO | Cero etiquetas Open Graph y Twitter Card en las 10 rutas          |
| 2   | CRÍTICO | No existe ninguna imagen para compartir (`og:image`)              |
| 3   | ALTO    | Ninguna ruta tiene `meta description`                             |
| 4   | ALTO    | Ninguna ruta tiene `<link rel="canonical">`                       |
| 5   | ALTO    | No existen `robots.txt` ni `sitemap.xml`                          |
| 6   | ALTO    | `/help` llega a Google sin ninguna de sus preguntas ni respuestas |
| 7   | ALTO    | Las respuestas del FAQ del Home tampoco están en el HTML          |
| 8   | ALTO    | `/legal` se prerenderiza **vacía** y es indexable                 |
| 9   | ALTO    | Las tres páginas legales no tienen contenido: solo un `<h1>`      |
| 10  | ALTO    | 2,1 MB de imágenes recuperables en la home; Performance móvil 76  |

---

# 1 — Indexabilidad

## [OK] Las diez rutas se prerenderizan y llevan contenido real

`dist/web-movia/prerendered-routes.json` lista `/`, `/contact`, `/corporate`, `/help`, `/legal`, `/legal/data-usage`, `/legal/privacy`, `/legal/terms`, `/partners`, `/plans`. No falta ninguna ruta pública del router.

El cuerpo NO está vacío (evidencia, fragmento del `<main>` de cada una):

- `/` — 435 palabras — «_…Así Es Como Movia Transforma La Manera En Que Te Mueves 1 Elige la red. Descubre en la app los centros aliados cerca de ti…_»
- `/plans` — 301 palabras — «_…8 check-ins al mes Acceso a más de 5.000 lugares Clases online incluidas… Plan popular Standard $59,99 /mes…_»
- `/partners` — 355 palabras — «_…pagas cuando alguien asiste. Quiero ser parte ¿Cuánto puedes crecer con Movia? Cada spot vacío es dinero que se pierde…_»
- `/corporate` — 408 palabras — «_…Cómo funciona el modelo 50/50 Movia se integra como un beneficio corporativo co-financiado…_»
- `/contact` — 198 palabras — «_…Escríbenos Cuéntanos quién eres y qué necesitas. Te confirmamos por correo con un número de solicitud…_»

## [ALTO] `/help` llega a Google sin ninguna de sus preguntas ni respuestas

**Evidencia:** `dist/web-movia/browser/help/index.html`, contenido COMPLETO del `<main>`:

> Centro de ayuda · Aquí están las respuestas a lo que más nos preguntan, ordenadas por a quién le interesan… · ¿No encontraste lo que buscabas? Escríbenos y te respondemos. · Contáctanos · Preguntas frecuentes · **Para usuarios Para empresas Para partners**

Ahí se acaba: 120 palabras, y las tres últimas son las etiquetas de las pestañas. `grep -c "check-in" help/index.html` → **0**. Árbol de encabezados: solo `h1` y un `h2`; ninguna pregunta llega como `h3`.

La causa es que las pestañas de Angular Aria renderizan el panel al seleccionarlo, y el acordeón de dentro solo pinta la respuesta abierta. En el prerender no hay nadie que pulse.

**Impacto:** el Centro de ayuda es, con diferencia, la página con más potencial de búsquedas de cola larga («¿qué es un check-in?», «¿puedo ir a distintos gimnasios?», «¿hay permanencia?»). Hoy Google ve una página de 120 palabras que no responde ninguna de esas preguntas, así que no puede posicionarla para ninguna.

**Propuesta:** que los tres bloques y todas sus preguntas y respuestas estén en el DOM desde el primer render, y que lo que hagan las pestañas y el acordeón sea **mostrar y ocultar**, no crear y destruir. Con `@if` el contenido no existe; con `[hidden]` o con paneles `inert` sí existe y el bot lo lee. En el acordeón, la respuesta puede ir dentro de un `<details>`/`<summary>` nativo o en un panel presente y colapsado por CSS.

## [ALTO] Las respuestas del FAQ del Home tampoco están en el HTML

**Evidencia:** en `dist/web-movia/browser/index.html` aparecen las seis preguntas como `h3` («¿Qué es un check-in?», «¿Puedo ir a distintos gimnasios?»…), pero `grep -c "Es cada entrada a un centro aliado"` → **0**: ninguna respuesta está.

**Impacto:** se pierde el texto que de verdad responde a la búsqueda, y sin las respuestas en el HTML **no se puede optar a un rich result de FAQ** aunque se añada el JSON-LD (Google exige que el marcado corresponda a contenido visible en la página).

**Propuesta:** la misma que arriba, en `shared/components/faq-accordion/`.

## [ALTO] `/legal` se prerenderiza vacía y es indexable

**Evidencia:** `dist/web-movia/browser/legal/index.html` → `<title>Movía</title>` (el título por defecto de `src/index.html`, 5 caracteres), `<main>` **completamente vacío** (`''`), sin ningún `<h1>`, 59 palabras en todo el body que son solo cabecera y pie.

La causa: `features/legal/legal.routes.ts` declara `terms`, `privacy` y `data-usage`, pero **no declara nada para el path vacío**, y aun así el prerenderizador emite `/legal/index.html`.

**Impacto:** una página en blanco, indexable, con un título genérico que compite con la marca. Es el caso de libro de «contenido escaso» que Google penaliza.

**Propuesta:** o bien un `{ path: '', redirectTo: 'terms', pathMatch: 'full' }` en `LEGAL_ROUTES` (y entonces `/legal` deja de emitirse como página propia), o bien una página índice de verdad que enlace a los tres documentos. La segunda opción además aporta enlazado interno.

## [ALTO] No existen `robots.txt` ni `sitemap.xml`

**Evidencia:**

```
ls dist/web-movia/browser/robots.txt  → No such file or directory
ls dist/web-movia/browser/sitemap.xml → No such file or directory
ls public/robots.txt public/sitemap.xml → No such file or directory
```

**Impacto:** sin `sitemap.xml`, el descubrimiento de las diez URLs depende solo del rastreo por enlaces y de Search Console; para un dominio nuevo sin enlaces entrantes, eso es semanas de diferencia. Sin `robots.txt` no se declara dónde está el sitemap.

> **Matiz posterior al informe (mismo 2026-09-20):** aquí se contaba también que sin `robots.txt` no se bloqueaba `/index.csr.html`. Ya no aplica: el despliegue dejó de subir ese archivo (ver el hallazgo de más abajo). El `sitemap.xml` sigue siendo el motivo entero de este hallazgo.

**Propuesta:** dos archivos estáticos en `public/` (se copian tal cual al `dist`).
`robots.txt`: `User-agent: *`, `Allow: /`, y `Sitemap: https://moviapass.com/sitemap.xml`. (El `Disallow: /index.csr.html` que proponía el informe ya no hace falta: ese archivo dejó de desplegarse.)
`sitemap.xml`: las diez URLs absolutas con `https://moviapass.com`, sin barra final y **sin `/legal`** si se resuelve el hallazgo anterior con una redirección. Ojo a la tentación de escribirlo a mano: la base pública ya vive en `environment.siteUrl` y lo suyo es generarlo en el build desde la misma fuente, no tener dos verdades.

## [ALTO] Ninguna ruta tiene `<link rel="canonical">`

**Evidencia:** en los diez `index.html`, los únicos `<link>` del `<head>` son `icon` y `manifest`. No hay `canonical` en ninguno.

**Impacto:** `moviapass.com/plans`, `www.moviapass.com/plans`, `/plans/` y `/plans?utm_source=…` son cuatro URLs distintas sirviendo lo mismo. Sin canónica, Google elige por su cuenta cuál indexa y reparte la autoridad entre todas. Con campañas de pago o enlaces con parámetros, esto se nota rápido.

**Propuesta:** una canónica **absoluta y autorreferencial** por ruta, compuesta desde `environment.siteUrl`, con criterio único de barra final (recomendado: **sin** barra, que es como el router emite las rutas). Va junto con el hallazgo 3: el mismo servicio que fije la descripción fija la canónica.

## [MEDIO] `index.csr.html` es accesible como URL pública — RESUELTO

> **Resuelto el mismo 2026-09-20, después de esta auditoría.** La pasada de HTML de `.github/workflows/deploy.yml` lleva ahora `--exclude "index.csr.html"` como último filtro, así que **el archivo ya no se publica**: no llega a existir como URL en `moviapass.com`. El hallazgo se conserva porque describe el `dist`, que lo sigue emitiendo; lo que cambió es lo que se sube. Ver `docs/cambios/2026-09-20-workflows-de-ci-y-deploy.md`.

**Evidencia:** servido el `dist` con un servidor estático plano, `GET /index.csr.html` → **200**. Su `<body>` es `<body ngcm="">`: el cascarón vacío de la app.

**Impacto:** una URL indexable con cero contenido. Poco probable que Google la encuentre (nadie la enlaza), pero es gratis cerrarla.

**Propuesta:** `Disallow: /index.csr.html` en `robots.txt`, y si el hosting lo permite, no servirla. → **Se hizo lo segundo, que es lo fuerte:** el despliegue no la sube, así que no hay nada que desindexar y el `Disallow` sobra.

## [MEDIO] No hay página 404 real; el comodín redirige a la home

**Evidencia:** `src/app/app.routes.ts:40` → `{ path: '**', redirectTo: '' }`. El comentario del propio archivo dice que el 404 real «aterriza en `shared/pages/not-found/` cuando esa página exista»; **no existe**.

Comprobado sobre el `dist` servido en estático plano: `/noexiste` → **404 real**. Es decir, hoy el comodín de Angular **no llega a actuar**, porque el servidor responde antes.

**Impacto:** depende por completo del hosting, que sigue sin decidirse (`docs/decisiones/2026-09-20-dominio-y-hosting.md`). Si quien lo despliegue configura el fallback típico de SPA (todo a `/index.html`), **cada URL inexistente devolverá la home con estado 200**: un _soft 404_ multiplicado por infinitas URLs, que es de lo que más se queja Search Console.

**Propuesta:** dejarlo escrito en la guía de despliegue —el hosting resuelve `/ruta` → `/ruta/index.html` y **no** hace fallback a la raíz—, y crear `shared/pages/not-found/` con su ruta, para que el comodín muestre un 404 con sentido cuando la navegación es interna.

## [OK] No hay enlaces internos rotos

Todos los `routerLink` apuntan a rutas que existen y se prerenderizan; Lighthouse da `crawlable-anchors` y `link-text` en verde en las diez rutas.

## [MEDIO] Siete enlaces sin destino en cada página

**Evidencia:** `grep -c 'href="#"'` → **7 en cada uno** de los diez `index.html`: las dos insignias de tienda de la cabecera, las dos del pie y las tres redes sociales. (En el prerender el cajón de móvil está cerrado, así que sus dos insignias no salen; en el navegador son nueve.)

**Impacto:** no es un problema de rastreo —`href="#"` no crea una URL— pero sí de confianza y de señales: las redes sociales de la marca son lo que alimenta `sameAs` en los datos estructurados (hallazgo 4), y sin ellas Google no puede vincular el sitio con los perfiles.

**Propuesta:** URLs reales de App Store, Google Play, Facebook, Instagram y LinkedIn, en constantes de `core/constants/navigation.constants.ts` (aparecen en tres plantillas distintas).

---

# 2 — Metadatos por ruta

| Ruta                | `title` (long.)                                    | `meta description` | `canonical` | ¿Único?          |
| ------------------- | -------------------------------------------------- | ------------------ | ----------- | ---------------- |
| `/`                 | `Movía · Deporte y bienestar en una sola app` (43) | **ninguna**        | **ninguna** | sí               |
| `/plans`            | `Planes · Movía` (14)                              | **ninguna**        | **ninguna** | sí               |
| `/partners`         | `Movia para Estudios · Movía` (27)                 | **ninguna**        | **ninguna** | sí               |
| `/corporate`        | `Movia para Empresas · Movía` (27)                 | **ninguna**        | **ninguna** | sí               |
| `/contact`          | `Contáctanos · Movía` (19)                         | **ninguna**        | **ninguna** | sí               |
| `/help`             | `Centro de ayuda · Movía` (23)                     | **ninguna**        | **ninguna** | sí               |
| `/legal`            | `Movía` (5)                                        | **ninguna**        | **ninguna** | sí (por defecto) |
| `/legal/terms`      | `Términos y condiciones · Movía` (30)              | **ninguna**        | **ninguna** | sí               |
| `/legal/privacy`    | `Políticas de privacidad · Movía` (31)             | **ninguna**        | **ninguna** | sí               |
| `/legal/data-usage` | `Política de uso de datos · Movía` (32)            | **ninguna**        | **ninguna** | sí               |

## [ALTO] Ninguna ruta tiene `meta description`

**Evidencia:** no hay ni una sola `<meta name="description">` en los diez HTML. Es la única auditoría de SEO que Lighthouse suspende, y la suspende en las diez.

**Impacto:** Google se inventa el fragmento del resultado recortando la página. En `/plans` acabará mostrando una lista de características sueltas; en `/legal` no hay nada que recortar. El fragmento es lo que decide si alguien hace clic: se pierde el control del argumento de venta justo en el momento de la decisión.

**Propuesta:** una descripción por ruta, 140–160 caracteres, escrita como argumento y no como resumen, con el término de búsqueda y la ubicación. Ejemplo para `/plans`: «Planes de Movía desde $39,99 al mes: entra a gimnasios, yoga, natación y más en todo Ecuador con una sola membresía. Sin permanencia.»

## [ALTO] No existe un `SeoService` ni equivalente

**Evidencia:** no hay ningún uso de `Title` ni `Meta` de `@angular/platform-browser` en `src/app` (la búsqueda solo encuentra la palabra «Title» dentro de interfaces del dominio). Los títulos —que sí funcionan y sí quedan horneados— vienen de la propiedad `title` de cada ruta.

**Impacto:** hoy no hay ningún sitio donde poner descripción, canónica u Open Graph. Es la pieza que bloquea los hallazgos 1, 2, 3 y 4 a la vez.

**Propuesta:** un `core/services/seo.service.ts` que, en cada `NavigationEnd`, fije descripción, canónica y las etiquetas sociales a partir de un mapa tipado por ruta (`core/constants/seo.constants.ts` + su interfaz). **Clave:** tiene que ejecutarse también en el servidor de prerender, no solo en el navegador; si se hace dentro de un `afterNextRender` o detrás de un `isPlatformBrowser`, las etiquetas no quedarán en el HTML y no habrá servido de nada. La forma de comprobarlo es la de este informe: `grep og: dist/.../index.html`.

## [MEDIO] `<html lang="es">` en vez de `es-EC`

**Evidencia:** `<html lang="es">` en los diez HTML (`src/index.html:2`). El `manifest.webmanifest` declara igualmente `"lang": "es"`.

**Impacto:** el sitio opera en Ecuador, con precios en USD y ciudades ecuatorianas. `es-EC` le dice a Google a qué variante regional sirve; `es` a secas compite contra España y México sin señal de país.

**Propuesta:** `lang="es-EC"` en `src/index.html` y en el manifest; y `og:locale` con `es_EC` cuando se añadan las sociales. No hace falta `hreflang`: hay un solo idioma y una sola región.

## [MEDIO] Títulos correctos de forma, pobres de intención

**Evidencia:** `Planes · Movía` son 14 caracteres de los ~60 que Google muestra. `Movia para Estudios · Movía` habla el idioma interno del producto («estudios»), no el de quien busca. Ninguno de los diez menciona **Ecuador**, **Quito** ni **Guayaquil**.

**Impacto:** el título es la señal más fuerte de relevancia. Un título que no contiene la palabra que se busca parte con desventaja frente a otro que sí.

**Propuesta:** reescribirlos hacia la búsqueda y aprovechar el espacio. Por ejemplo: `Planes y precios · Una membresía para todos los gimnasios de Ecuador · Movía`, `Gimnasios y estudios aliados: gana con tus spots vacíos · Movía`, `Bienestar corporativo en Ecuador: gimnasios para tu equipo · Movía`.

## [OK] `charset`, `viewport`, `theme-color` y `color-scheme`

`<meta charset="utf-8">` es lo primero del `<head>`; `viewport` es `width=device-width, initial-scale=1`. Ambos correctos en las diez rutas. `theme-color` y `color-scheme` están puestos y documentados.

---

# 3 — Vista previa al compartir (Open Graph)

## [CRÍTICO] Cero etiquetas Open Graph y Twitter en las diez rutas

**Evidencia:** el extractor de metadatos recorre los diez `index.html` y no encuentra **ni una sola** etiqueta `property="og:*"` ni `name="twitter:*"`. Los únicos `<meta>` del `<head>` son `charset`, `viewport`, `color-scheme` y `theme-color`.

**Impacto:** este es el hallazgo que toca de lleno el objetivo declarado. WhatsApp, Facebook, LinkedIn y X **no ejecutan JavaScript**: leen el HTML crudo y nada más. Hoy, al pegar `https://moviapass.com/plans` en un chat, el destinatario no ve tarjeta, o ve una tarjeta con la URL pelada y sin imagen. Para un producto que se difunde por WhatsApp en Ecuador, es perder el enlace compartido como canal.

**Propuesta:** por ruta, `og:title`, `og:description`, `og:type` (`website`; `product` en `/plans` si se quiere), `og:url` (absoluta, la misma que la canónica), `og:site_name` (`Movía`), `og:locale` (`es_EC`), `og:image` con sus `og:image:width`, `og:image:height` y `og:image:alt`; y `twitter:card` = `summary_large_image` con `twitter:title`, `twitter:description` y `twitter:image`. Todo desde el mismo `SeoService` del hallazgo anterior, y **verificado en el HTML prerenderizado**, no en el navegador.

## [CRÍTICO] No existe ninguna imagen para compartir

**Evidencia:** no hay `og:image` porque no hay imagen. El inventario del `dist` (23 JPG, 8 PNG, 13 SVG) no contiene ningún archivo con proporción ~1,91:1 pensado para redes. La única imagen de marca es `imgs/layout/logo-movia.png`, de **4106 × 554** (proporción 7,4:1): pegada en una tarjeta social saldría recortada a una banda ilegible.

**Impacto:** aunque mañana se añadan las etiquetas del hallazgo anterior, sin imagen la tarjeta sale sin foto y ocupa una cuarta parte del espacio en el chat.

**Propuesta:** producir **1200 × 630 px** (la proporción que piden las cuatro redes), en JPG o PNG y **por debajo de 300 KB**, que es donde WhatsApp deja de descargar la vista previa. Mínimo una genérica en `public/imgs/og/movia.jpg`; lo ideal, una por dominio (home, planes, partners, empresas) con el titular de cada página, porque la tarjeta de un enlace a `/plans` debería hablar de precios. La URL en la etiqueta va **absoluta y con https**: `https://moviapass.com/imgs/og/…`; una ruta relativa la ignoran los cuatro.

## [MEDIO] Favicon único, sin `apple-touch-icon` y con el tamaño mal declarado

**Evidencia:** `<link rel="icon" type="image/png" href="favicon.png">` es el único icono. El archivo real es **557 × 565 px**, pero `manifest.webmanifest` lo declara como `"sizes": "64x64"`. No hay `apple-touch-icon` en ningún HTML.

**Impacto:** el tamaño declarado en falso puede hacer que el navegador elija mal el icono. Sin `apple-touch-icon`, «Añadir a pantalla de inicio» en iOS genera una miniatura de la captura en lugar del logo: se pierde el icono de marca justo en el gesto de más compromiso.

**Propuesta:** declarar el tamaño real en el manifest, añadir `apple-touch-icon` de 180 × 180 y sumar al manifest los iconos de 192 y 512 (los que pide Android para instalar). Son archivos estáticos en `public/`, ningún cambio de código.

---

# 4 — Datos estructurados (JSON-LD)

## [MEDIO] No hay ningún bloque `application/ld+json`

**Evidencia:** `grep -c 'application/ld+json'` → **0** en las diez rutas. La auditoría `structured-data` de Lighthouse sale como «no aplicable» por lo mismo.

**Impacto:** Google no puede construir el panel de conocimiento de la marca, no puede enlazar el sitio con los perfiles sociales, no puede mostrar los precios de los planes en el resultado ni ofrecer la ficha de la app. Nada de esto sube el puesto por sí solo, pero sí cambia **cuánto espacio ocupa el resultado** y cuántos clics se lleva.

**Propuesta** (qué tipos y qué campos; el JSON no se escribe aquí):

- **`Organization`** — en todas las rutas, o al menos en la home. Campos: `name`, `legalName` («MoviaPass SAS», que ya aparece en el pie), `url`, `logo` (URL absoluta), `sameAs` con los perfiles sociales —**bloqueado hasta que existan**, hallazgo del apartado 1—, `contactPoint` con `telephone` (+593 99 548 9085), `email` (soporte@moviapass.com), `contactType` `customer support`, `areaServed` `EC` y `availableLanguage` `es`.
- **`WebSite`** — `name`, `url`, `inLanguage` `es-EC`. `potentialAction`/`SearchAction` **no**: no hay buscador interno, y declararlo sería falso.
- **`MobileApplication`** (o `SoftwareApplication`) — `name`, `operatingSystem` `iOS, Android`, `applicationCategory` `HealthApplication`, `installUrl` con los enlaces de tienda y `offers`. **Bloqueado hasta que existan las URLs de App Store y Google Play.**
- **`Product` + `Offer`** en `/plans` — un `Offer` por plan con `price` (39.99, 59.99, 69.99), `priceCurrency` `USD`, `availability` y `url`. Es el que puede hacer que el resultado muestre el precio. Cuidado con el plan Enterprise, cuyo precio es «desde»: eso se marca con `PriceSpecification` y no como precio cerrado.
- **`FAQPage`** — ver abajo.

## [BAJO] Sobre marcar el FAQ como `FAQPage`

Desde agosto de 2023 Google **solo muestra el rich result de FAQ a sitios de salud y administración pública**; para el resto, el marcado es válido pero no pinta nada en el resultado. Es decir: hoy no da estrellas ni acordeón en la búsqueda.

Aun así merece la pena, por dos razones: ayuda a Google a entender de qué va la página, y es lo que alimenta las respuestas de los asistentes conversacionales. Pero **es lo último de la lista**, y solo tiene sentido **después** de arreglar los hallazgos 6 y 7: marcar como `FAQPage` unas respuestas que no están en el HTML visible incumple las directrices de Google y puede acarrear una acción manual.

---

# 5 — Contenido y semántica

## [OK] Un solo `h1` por ruta y jerarquía sin saltos

Árbol de encabezados de cada ruta (verificado sobre el HTML prerenderizado):

- **`/`** — `h1` Move Freely. Belong Everywhere. → `h2` Así Es Como Movia Transforma… (`h3` ×3) → `h2` Categorías de actividades → `h2` Variedad sin límites (`h3` ×3) → `h2` Encuentra tu club más cercano → `h2` Movia para Estudios → `h2` Movia para Empresas (`h3` ×4) → `h2` ¿Tienes preguntas? (`h3` ×6) → `h2` Muévete con Movia
- **`/plans`** — `h1` Elige la suscripción que mejor se adapta… → `h2` Basic / Standard / Premium / Enterprise
- **`/partners`** — `h1` Llena tus clases. Gana más. Sin riesgo. → `h2` ×5 con sus `h3`
- **`/corporate`** — `h1` Bienestar corporativo que genera retorno. → `h2` ×5 con sus `h3`
- **`/contact`** — `h1` Contáctanos → `h2` Escríbenos → `h2` ¿Prefieres escribirnos directamente?
- **`/help`** — `h1` Centro de ayuda → `h2` Preguntas frecuentes _(y nada más: hallazgo 6)_
- **`/legal/*`** — `h1` con el nombre del documento, sin más
- **`/legal`** — **ningún encabezado** _(hallazgo 8)_

Ni un salto de nivel, ni un `h1` duplicado. Esto no hay que tocarlo.

## [MEDIO] Falta el landmark `<header>`

**Evidencia:** las diez rutas tienen `<main>` (1), `<footer>` (1) y `<nav>` (1), pero **`<header>` aparece 0 veces**: `app-header` renderiza un `<div>`.

**Impacto:** es de accesibilidad más que de SEO —un lector de pantalla pierde el atajo a la cabecera—, pero forma parte de la semántica que Google usa para separar plantilla de contenido.

**Propuesta:** que el elemento raíz del componente sea `<header>`, o envolver su contenido en uno.

## [MEDIO] El `h1` de la home está en inglés y no contiene ninguna palabra clave

**Evidencia:** `<h1>Move Freely.<br>Belong Everywhere.</h1>`.

**Impacto:** el `h1` es la segunda señal de relevancia después del título. El de la página más importante del sitio no contiene «gimnasio», ni «Ecuador», ni «membresía», ni ninguna palabra que nadie vaya a teclear en Google.

**Propuesta:** es una decisión de marca, no técnica, y ese claim es el de la identidad. La salida habitual sin tocar el diseño: mantener el claim como elemento visual y bajarlo a `<p>`, y poner el `h1` en el subtítulo que ya existe («Deporte y bienestar a tu medida en una sola app»), reescrito con la intención de búsqueda. Si el claim se queda como `h1`, entonces la carga de palabras clave tiene que ir al `<title>` y a la descripción.

## [ALTO] Las tres páginas legales no tienen contenido

**Evidencia:** el `<main>` completo de `/legal/terms` es `'Términos y condiciones'`. El de `/legal/privacy`, `'Políticas de privacidad'`. El de `/legal/data-usage`, igual. Entre 62 y 64 palabras por página, todas de la cabecera y el pie.

**Impacto:** tres páginas indexables sin contenido. Y más allá del SEO: el formulario de contacto ya enlaza a la política de uso de datos como consentimiento del envío, así que **hoy se está pidiendo aceptar un documento que está en blanco**.

**Propuesta:** redactar los tres documentos. No es trabajo de código, pero sí es bloqueante para publicar; mientras no existan, lo prudente es `noindex` en esas tres rutas y quitarlas del sitemap.

## [OK] Imágenes: ninguna rota, todas con `alt` correcto

Ninguna de las rutas referencia un archivo que no exista en el `dist`. Todas las imágenes de contenido llevan `alt` descriptivo y en español («Tres personas entrenando de noche: carrera, tenis y atletismo», «Entrenador de un estudio aliado con una tablilla en la mano»). Las decorativas —insignias de tienda y redes del pie— llevan `alt` vacío **y** su `aria-label` en el enlace que las envuelve, que es exactamente lo correcto y lo confirma Lighthouse con `image-alt` en verde en las diez rutas.

**Texto dentro de imágenes:** las insignias de App Store y Google Play son PNG con texto, pero es el material oficial de las tiendas y no puede sustituirse; su `aria-label` cubre el caso. No se detectó ningún otro texto importante metido en una imagen.

## [MEDIO] Palabras clave: buena densidad en `/` y `/corporate`, ausencia total en `/help` y `/partners`

Términos encontrados en el `<main>` de cada ruta:

| Ruta         | Términos presentes                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `/`          | gimnasio, **Ecuador**, membresía, suscripción, bienestar, clases, deporte, natación, spa, check-in, cerca de ti, precio, $ |
| `/corporate` | gimnasio, **yoga**, **Ecuador**, membresía, bienestar, **corporativo**, natación, pilates, spa, $                          |
| `/plans`     | suscripción, bienestar, clases, deporte, check-in, precio, $                                                               |
| `/partners`  | clases, spa, check-in, $                                                                                                   |
| `/contact`   | gimnasio                                                                                                                   |
| `/help`      | _(ninguno)_                                                                                                                |
| `/legal*`    | _(ninguno)_                                                                                                                |

Lo que hay está bien escrito: _«Disponible en todo el Ecuador. Conectando personas, clubes y experiencias deportivas desde una sola aplicación»_, _«Movia es una membresía mensual que te abre la puerta de toda una red de centros: gimnasios, estudios de yoga, artes marciales, natación, danza y bienestar»_.

**Lo que falta es la ciudad.** Ni **Quito** ni **Guayaquil** ni **Cuenca** aparecen **en ninguna de las diez rutas**, y las búsquedas de este sector son locales casi por definición: «gimnasios en Quito», «clases de yoga Quito», «gimnasio cerca de mí». La sección del mapa dice «Encuentra tu club más cercano» sin nombrar un solo sitio, y las tarjetas de centros que se ven en la maqueta de la app (Zenda La Floresta, Iron House Quito Norte, AquaVida Quito) son **una imagen**, así que ese texto no existe para Google.

**Propuesta:** nombrar las ciudades en el texto de la home y de `/plans`; y, en cuanto haya red suficiente, páginas por ciudad (`/gimnasios/quito`), que es lo que de verdad captura la búsqueda local. Eso último es un proyecto de contenido, no un ajuste.

## [MEDIO] El enlazado interno se acaba en la home

**Evidencia:** enlaces internos dentro del `<main>` de cada ruta:

- `/` → `/plans`, `/partners`, `/corporate`, `/help` (7 enlaces: las tres tarjetas del hero, dos «Saber más», el FAQ y el CTA final). **Bien.**
- `/help` → `/contact`
- `/contact` → `/legal/data-usage`
- **`/plans` → ninguno. `/partners` → ninguno. `/corporate` → ninguno.**

**Impacto:** las tres páginas de negocio son callejones sin salida: reciben autoridad de la home y no la reparten. Sus CTA salen del dominio (`app.moviapass.com`, `partner.moviapass.com`), así que no dejan ninguna señal dentro del sitio.

**Propuesta:** enlaces contextuales dentro del texto —`/plans` mencionando los centros aliados hacia `/partners`, `/corporate` enlazando a `/plans` al hablar del co-pago, las tres hacia `/help`—. Con texto de enlace descriptivo, no «aquí».

---

# 6 — Rendimiento y Core Web Vitals

## [ALTO] 2,1 MB de imágenes recuperables en la home

**Evidencia** (Lighthouse `image-delivery-insight`, móvil):

| Archivo                            |   Peso | Real vs. mostrado     |                         Ahorro |
| ---------------------------------- | -----: | --------------------- | -----------------------------: |
| `home/app-movia.png`               | 768 KB | 714×1216 → 637×1085   |                     **619 KB** |
| `home/categorias/natacion.jpg`     | 576 KB | 596×744 → 404×504     |                     **510 KB** |
| `home/categorias/gimnasio.jpg`     | 320 KB | 596×744 → 404×504     |                         266 KB |
| `partners/como-funciona.jpg`       | 384 KB | 657×1001 → 299×456    |                         319 KB |
| `home/categorias/yoga.jpg`         | 256 KB | 596×744 → 404×504     |                         170 KB |
| `home/hero-movil.jpg`              | 320 KB | 951×961 → 818×728     |                         166 KB |
| `home/categorias/baile.jpg`        | 256 KB | 596×744 → 404×504     |                         165 KB |
| `partners/riesgo-cero.jpg`         | 256 KB | 657×1001 → 299×456    |                         193 KB |
| `corporate/beneficios-empresa.jpg` | 192 KB | 1064×518 → 637×326    |                         161 KB |
| `layout/logo-movia.png`            |  84 KB | **4106×554 → 467×63** | 68 KB **en todas las páginas** |

Peso total transferido, en móvil: **home 2.776 KB** (2.557 KB de imágenes), partners 1.286 KB, corporate 1.258 KB. El resto de rutas, 320–373 KB.

El inventario del `dist` son **23 JPG, 8 PNG y 13 SVG: ni un solo WebP o AVIF**, 7,4 MB en total.

**Impacto:** es la única causa del 76 de Performance en la home móvil y del 7,2 s de LCP. Google usa el índice móvil y los Core Web Vitals son señal de posicionamiento; además, en 4G ecuatoriano, 2,7 MB es una espera real que se traduce en abandono.

**Propuesta, en orden de rentabilidad:**

1. **Convertir a WebP** (o AVIF con WebP de respaldo). Es lo que más ahorra y no cambia una línea de plantilla si se mantienen los nombres.
2. **Redimensionar al tamaño en que se muestran.** `natacion.jpg` pesa 576 KB para pintarse a 404×504; `logo-movia.png` son 4106 px de ancho para verse a 467.
3. **`srcset`** para servir crops distintos a móvil y escritorio. `NgOptimizedImage` lo genera solo si se configura un loader; sin loader hay que escribirlo.
4. `app-movia.png` es el mayor de todos, y es una captura de interfaz: probablemente pueda ser WebP con pérdida sin que se note.

## [OK] El LCP está bien tratado

En las dos rutas cuyo LCP es una imagen (`/` y `/corporate`), Lighthouse confirma las tres condiciones: `fetchpriority=high` aplicado, recurso descubrible en el documento inicial y **sin** `loading=lazy`. En las otras ocho rutas el LCP es texto, que es el mejor caso posible.

Detalle: el hero de la home usa `<picture>` con dos recortes y **no** `NgOptimizedImage` —que no soporta `<picture>`—, pero lleva el `fetchpriority="high"` puesto a mano, así que el efecto es el mismo. `/corporate` sí usa `NgOptimizedImage` con `fill priority`.

## [OK] CLS prácticamente cero y TBT irrelevante

CLS entre 0,000 y 0,047 en las veinte medidas; el umbral de Google es 0,1. TBT entre 0 y 35 ms, con un umbral de 200 ms: **INP no va a ser un problema**. Las imágenes llevan `width`/`height` o `fill`, que es justo lo que evita el desplazamiento.

## [OK] Fuentes no bloqueantes

`src/index.html` declara Google Fonts con un `<link rel="stylesheet">`, pero el build lo **inlina** (beasties): en el HTML final no queda ninguna hoja de estilos externa, solo los `@font-face` en línea, todos con `font-display: swap`, más los dos `preconnect`. Lighthouse da `render-blocking-insight` y `font-display-insight` en verde. **No hay que tocarlo.**

El único matiz: los archivos `.woff2` (74 KB) siguen viniendo de `fonts.gstatic.com`, un tercero. Auto-hospedarlos ahorraría una conexión y quitaría de encima la cuestión de privacidad, pero **no es urgente**: no bloquean el render.

## [OK] JavaScript contenido

Entre **107 y 129 KB** transferidos por ruta (bundle principal de 144 KB sin comprimir más el chunk de la página). Para una SPA de Angular es una cifra buena, consecuencia del `loadComponent` por ruta. Única mejora señalada: 23 KB de JS sin usar.

---

# 7 — Móvil

## [OK] Sin desbordamiento horizontal a 360 px

Medido en las ocho rutas principales con el viewport a 360 px: `document.scrollWidth` = 360 en todas, ninguna se desborda. Los carruseles de la home y de `/plans` tienen scroll horizontal **propio**, que es intencionado y no arrastra la página.

## [OK] Texto legible sin zoom

El tamaño de fuente más pequeño del sitio es **14 px** (contador de caracteres, avisos legales, enlaces del pie). Por encima del mínimo recomendado de 12 px.

## [MEDIO] Objetivos táctiles de 17 px en el pie

**Evidencia** a 360 px: los siete enlaces del pie (`Hazte Partner` 91×17, `Para Empresas` 99×17, `Planes` 44×17, `Contáctanos` 84×17, `Términos & Condiciones` 161×17, `Políticas de Privacidad` 150×17, `Política de Uso de Datos` 162×17) y el enlace «Centro de ayuda» del FAQ (125×20). El mínimo de WCAG 2.5.8 es 24×24; Google recomienda 48×48.

Están separados 24 px en vertical, lo que reduce el riesgo de pulsar el equivocado, pero el objetivo sigue siendo pequeño.

**Propuesta:** `py-2` en esos enlaces (los sube a 33 px sin mover el diseño, porque el hueco visual ya existe) o `min-h-11` con `inline-flex items-center`.

## [MEDIO] `text-muted` sobre blanco no llega al contraste mínimo

**Evidencia:** Lighthouse suspende `color-contrast` en `/contact` (A11y 96) y `/help` (97):

> _Element has insufficient color contrast of 3.02 (foreground #92949c, background #ffffff)_ — `<p class="text-muted mt-4 max-w-2xl lg:text-lg">`
> _…of 2.77 (foreground #92949c, background #f4f5f8)_ — `<p class="text-muted mt-2 text-sm">`, `<p id="contact-message-count">`, el aviso de la política de uso de datos y su enlace.

El mínimo AA para texto normal es 4,5:1.

**Impacto:** no es una señal de posicionamiento directa, pero `--brand-gray` es un token del tema usado en todo el sitio, así que el problema es transversal: hoy solo salta donde ese gris cae sobre blanco en texto pequeño.

**Propuesta:** oscurecer `--color-muted` en `styles.css` hasta pasar 4,5:1 sobre `surface` y sobre `surface-muted` (un `color-mix` con negro, como ya se hace con `success` y `warning`). Es un cambio en un token y afecta a todo el sitio de una vez, así que conviene revisarlo visualmente después.

---

# 8 — Checklist para el despliegue (no verificable en local)

- [ ] **HTTPS** con certificado válido y redirección 301 de `http://` a `https://`.
- [ ] **Una sola versión del dominio**: 301 de `www.moviapass.com` a `moviapass.com` (o al revés), nunca las dos sirviendo 200.
- [ ] **Rutas sin extensión**: `/plans` debe devolver **200** con su `index.html`. En S3+CloudFront, una función `viewer-request` que añada `/index.html` cuando el URI no tenga extensión; en Nginx, `try_files $uri $uri/index.html =404`. Está detallado en `docs/decisiones/2026-09-20-dominio-y-hosting.md`.
- [ ] **Una URL inexistente debe devolver 404 real**, no 200. Prohibido el fallback típico de SPA a la raíz: convertiría cada error en un _soft 404_ (ver hallazgo del apartado 1).
- [ ] **Criterio único de barra final**, coherente con la canónica: `/plans` y `/plans/` no pueden responder 200 los dos.
- [ ] **Compresión** brotli o gzip para HTML, CSS y JS. Cada `index.html` pesa 39–70 KB sin comprimir por el CSS de fuentes inlinado.
- [ ] **Caché**: `immutable` y un año para los archivos con hash (`main-*.js`, `styles-*.css`); corta o revalidable para los `index.html`.
- [ ] **Alta en Google Search Console**, verificación del dominio y envío del `sitemap.xml`.
- [ ] Comprobar la vista previa real con el depurador de Facebook, el Post Inspector de LinkedIn y **pegando el enlace en un WhatsApp de verdad**, que es el que más falla.
- [ ] Alta en **Bing Webmaster Tools** (alimenta también a otros buscadores y asistentes).

# 9 — Fuera de este repositorio

1. Perfil de empresa en Google (Google Business Profile) para Movía y, si procede, para los centros aliados.
2. Enlaces entrantes desde las webs y redes de los estudios aliados: es el activo de enlaces natural de este modelo.
3. Contenido nuevo y sostenido: blog o guías por ciudad y por disciplina.
4. Reseñas y valoraciones, tanto de la app en las tiendas como del negocio.
5. Citaciones locales (directorios de Ecuador) con nombre, dirección y teléfono idénticos en todas.
6. Presencia y actividad en las redes que luego se declararán en `sameAs`.
7. Fichas de App Store y Google Play optimizadas (ASO): son otro buscador.

---

# Plan de acción

Ordenado por impacto entre esfuerzo. Los cuatro primeros son un solo trabajo técnico —el `SeoService`— y desbloquean la mitad del informe.

| Orden | Qué                                                                                                                                         | Sev.         | Esfuerzo        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- |
| 1     | `SeoService` + mapa de metadatos por ruta: descripción, canónica, Open Graph y Twitter. **Verificar que quedan en el HTML prerenderizado.** | CRÍTICO/ALTO | Medio           |
| 2     | Imagen social 1200×630 (<300 KB) y `apple-touch-icon`                                                                                       | CRÍTICO      | Bajo (diseño)   |
| 3     | `robots.txt` y `sitemap.xml` en `public/`, con la base de `environment.siteUrl`                                                             | ALTO         | Bajo            |
| 4     | Que `/help` y las respuestas del FAQ estén en el DOM desde el primer render                                                                 | ALTO         | Medio           |
| 5     | Resolver `/legal` (redirección o página índice)                                                                                             | ALTO         | Bajo            |
| 6     | Convertir imágenes a WebP y redimensionarlas a lo que se muestra                                                                            | ALTO         | Medio           |
| 7     | Redactar los tres documentos legales                                                                                                        | ALTO         | Fuera de código |
| 8     | `lang="es-EC"`, títulos reescritos hacia la búsqueda, ciudades en el texto                                                                  | MEDIO        | Bajo            |
| 9     | JSON-LD: `Organization` + `WebSite` primero; `Product`/`Offer` en `/plans`                                                                  | MEDIO        | Medio           |
| 10    | Landmark `<header>`, contraste de `text-muted`, objetivos táctiles del pie                                                                  | MEDIO        | Bajo            |
| 11    | Enlaces contextuales entre `/plans`, `/partners` y `/corporate`                                                                             | MEDIO        | Bajo            |
| 12    | URLs reales de tiendas y redes sociales (desbloquea `sameAs` y `MobileApplication`)                                                         | MEDIO        | Fuera de código |
| 13    | Página `not-found` real y guía de despliegue con el comportamiento del 404                                                                  | MEDIO        | Bajo            |

# Lo que está bien y no hay que tocar

- **El prerender.** Las diez rutas emiten HTML con el contenido dentro, no un cascarón. Es la base sobre la que se sostiene todo lo demás, y ya está resuelta.
- **Los títulos por ruta**, únicos y horneados en el HTML vía la propiedad `title` del router. Habrá que reescribir el copy, no el mecanismo.
- **La jerarquía de encabezados**: un solo `h1` por página y ningún salto de nivel en ninguna de las diez.
- **Las imágenes, en lo semántico**: ninguna rota, `alt` descriptivos en español, decorativas con `alt` vacío y `aria-label` en su enlace.
- **El tratamiento del LCP**: `fetchpriority=high`, descubrible y sin `lazy` en las dos rutas cuyo LCP es una imagen.
- **CLS y TBT**: 0,000–0,047 y 0–35 ms. Ni desplazamientos ni bloqueo del hilo principal.
- **Las fuentes**: inlinadas por el build, `font-display: swap`, sin hoja de estilos bloqueante.
- **El peso del JavaScript**: 107–129 KB por ruta gracias al `loadComponent`.
- **Best Practices 100** en las veinte medidas.
- **Móvil**: cero desbordamiento horizontal a 360 px y tipografía mínima de 14 px.
- **`charset`, `viewport`, `theme-color`, `color-scheme`** y el manifest, correctos.

# Confirmación

No se modificó ningún archivo del proyecto. Lo único que se escribió es **este informe** y su fila en `docs/README.md`. Se ejecutaron `npm run build:prod` (que reescribe `dist/`, artefacto de build), `npx serve` y `npx lighthouse` de forma temporal, sin añadir nada a `package.json`; el servidor temporal quedó apagado. No hay commits ni push.
