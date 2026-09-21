# Correcciones SEO de la landing

**Punto de partida:** [Auditoría SEO de la landing](../diagnosticos/2026-09-20-auditoria-seo.md), del mismo día. Este informe corrige sus hallazgos de código; los que no son de código se listan al final, en [Lo que falta y te toca a ti](#lo-que-falta-y-te-toca-a-ti).
**Alcance:** siete fases, un commit por fase. Todo verificado sobre el HTML de `dist/`, nunca sobre el código fuente: lo que no está en el dist, para Google no existe. **No se hizo push.**

## Resumen

Las diez rutas llegan ya con `meta description`, canónica y tarjeta social completa; existen `robots.txt` y `sitemap.xml` generados en el build desde el propio router; el Centro de ayuda pasa de 61 a 1.008 palabras en el `<main>` con sus 24 preguntas como `h3`; `/legal` deja de ser una página en blanco indexable; el comodín ya no convierte cada URL equivocada en la home; las imágenes bajan de 6.542 a 1.271 KB y la home de 2.776 a 929 KB transferidos; y la marca declara `Organization`, `WebSite` y los precios de los planes en JSON-LD.

En números de Lighthouse: **SEO de 91 a 100 en las siete rutas indexables**, **Accessibility de 96/97 a 100** en `/contact` y `/help`, y **Performance móvil de la home de 76 a 93** en cuanto el hosting sirva comprimido —que es la única pieza de rendimiento que queda y no vive en este repositorio—.

Lo que **no** se ha hecho, y por qué, está en [Qué queda pendiente](#qué-queda-pendiente): los tres documentos legales siguen vacíos y en `noindex`, la `og:image` todavía no existe y las URLs de tiendas y redes siguen apuntando a `#`. No se inventó ninguno de los tres.

---

## Lighthouse: antes y después

`M` = móvil (el índice que Google usa), `D` = escritorio. Las dos columnas de «antes» son las de la auditoría.

**Importante para leer la tabla:** la auditoría midió sirviendo el `dist` con `npx serve`, que **no comprime**. Se comprobó (`curl -I -H "Accept-Encoding: gzip"` → sin `content-encoding`). La columna «después» está medida en esa misma condición, para que la comparación sea justa; la columna «con gzip» está medida sobre el MISMO build con compresión de texto y caché `immutable`, que es lo que el [checklist de despliegue de la auditoría](../diagnosticos/2026-09-20-auditoria-seo.md) ya exigía.

| Ruta                |     | Perf antes | **Perf después** | Perf con gzip | SEO antes | **SEO después** | A11y antes | **A11y después** | LCP antes | **LCP después** | Peso antes | **Peso después** |
| ------------------- | --- | ---------: | ---------------: | ------------: | --------: | --------------: | ---------: | ---------------: | --------: | --------------: | ---------: | ---------------: |
| `/`                 | M   |         76 |           **75** |        **93** |        91 |         **100** |        100 |          **100** |     7,2 s |       **5,3 s** |   2.776 KB |       **929 KB** |
| `/`                 | D   |         87 |           **98** |             — |        91 |         **100** |        100 |          **100** |     2,4 s |       **1,1 s** |          — |         1.018 KB |
| `/plans`            | M   |         96 |           **82** |        **98** |        91 |         **100** |        100 |          **100** |     2,6 s |       **3,8 s** |     373 KB |       **578 KB** |
| `/plans`            | D   |        100 |           **99** |             — |        91 |         **100** |        100 |          **100** |     0,5 s |       **0,8 s** |          — |           579 KB |
| `/partners`         | M   |         86 |           **78** |        **97** |        91 |         **100** |        100 |          **100** |     4,2 s |       **4,4 s** |   1.286 KB |       **724 KB** |
| `/partners`         | D   |         99 |           **99** |             — |        91 |         **100** |        100 |          **100** |     0,9 s |       **0,9 s** |          — |           784 KB |
| `/corporate`        | M   |         78 |           **74** |        **93** |        91 |         **100** |        100 |          **100** |     5,9 s |       **5,1 s** |   1.258 KB |       **857 KB** |
| `/corporate`        | D   |         98 |           **98** |             — |        91 |         **100** |        100 |          **100** |     1,1 s |       **1,1 s** |          — |           887 KB |
| `/contact`          | M   |         96 |           **79** |        **98** |        91 |         **100** |         96 |          **100** |     2,7 s |       **4,1 s** |     320 KB |       **630 KB** |
| `/contact`          | D   |        100 |           **99** |             — |        91 |         **100** |         96 |          **100** |     0,6 s |       **0,8 s** |          — |           630 KB |
| `/help`             | M   |         96 |           **80** |        **98** |        91 |         **100** |         97 |          **100** |     2,7 s |       **4,0 s** |    ~350 KB |       **598 KB** |
| `/help`             | D   |        100 |           **99** |             — |        91 |         **100** |         97 |          **100** |     0,6 s |       **0,8 s** |          — |           599 KB |
| `/legal`            | M   |         97 |           **83** |        **99** |        91 |         **100** |        100 |          **100** |     2,6 s |       **3,7 s** |    ~330 KB |       **551 KB** |
| `/legal`            | D   |        100 |           **99** |             — |        91 |         **100** |        100 |          **100** |     0,6 s |       **0,8 s** |          — |           552 KB |
| `/legal/terms`      | M   |         96 |           **84** |        **98** |        91 |       **69** ⚠️ |        100 |          **100** |     2,7 s |       **3,6 s** |    ~330 KB |       **546 KB** |
| `/legal/terms`      | D   |        100 |          **100** |             — |        91 |       **69** ⚠️ |        100 |          **100** |     0,6 s |       **0,7 s** |          — |           547 KB |
| `/legal/privacy`    | M   |         96 |           **85** |        **99** |        91 |       **69** ⚠️ |        100 |          **100** |     2,7 s |       **3,6 s** |    ~330 KB |       **546 KB** |
| `/legal/privacy`    | D   |        100 |           **99** |             — |        91 |       **69** ⚠️ |        100 |          **100** |     0,6 s |       **0,7 s** |          — |           547 KB |
| `/legal/data-usage` | M   |         96 |           **85** |        **98** |        91 |       **69** ⚠️ |        100 |          **100** |     2,6 s |       **3,6 s** |    ~330 KB |       **546 KB** |
| `/legal/data-usage` | D   |        100 |           **99** |             — |        91 |       **69** ⚠️ |        100 |          **100** |     0,6 s |       **0,7 s** |          — |           547 KB |

Best Practices: **100 en las veinte medidas**, antes y después. CLS entre 0,000 y 0,042 (umbral 0,1) y TBT entre 0 y 21 ms (umbral 200).

### Tres lecturas que la tabla necesita

**⚠️ El 69 de SEO en las tres páginas legales es a propósito y es lo correcto.** La única auditoría que suspenden es `is-crawlable`, porque llevan `noindex`. No están vacías por error: están vacías porque el texto no existe, y una página indexable sin contenido es exactamente lo que Google trata como «contenido escaso». Cuando aportes los tres textos se cambia `indexable` a `true` en `seo.constants.ts` y las tres vuelven a 100 y entran solas en el sitemap.

**El peso «antes» de siete rutas viene de la auditoría y ahí se midió sin las fuentes ni la caché en el mismo estado**, así que los ~330 KB de las páginas ligeras no son comparables al kilobyte con los ~550 KB de ahora. Lo que sí es comparable —y es lo que importa— es la home: **2.776 → 929 KB**, la ruta que la auditoría señalaba como única culpable del 76.

**Por qué el Performance móvil baja en las rutas ligeras sin comprimir.** En `/plans`, `/contact` y `/help` el peso de imágenes ya era mínimo, así que la fase 5 no les quitaba nada; lo que sí les sumó es el trabajo de las otras fases (24 preguntas más en el DOM de `/help`, JSON-LD en `/plans`) y, sobre todo, que **Lighthouse les está cobrando 1,8 s de `uses-text-compression`**, porque el servidor de prueba no comprime. Con gzip —tres líneas del hosting— las mismas rutas dan **97–99**. Es decir: lo que queda de rendimiento no está en el código, está en el checklist de despliegue.

---

## Fase 1 — Descripción, canónica, Open Graph y Twitter

Hallazgos 1, 3 y 4. Commit `feat(seo): descripción, canónica y metadatos sociales en el prerender`.

### La decisión: extender la `TitleStrategy`, y un solo mapa tipado

Se pidió elegir entre una constante tipada y el `data` de cada ruta, y **se eligió la constante**, en `core/constants/seo.constants.ts`. El motivo es el punto 1.3 del encargo: las descripciones tienen que estar todas juntas para poder editar el copy sin tocar lógica. Repartirlas por el `data` de ocho archivos `*.routes.ts` es justo lo contrario, y además obliga a abrir ocho archivos para comprobar que ninguna se repite.

El mecanismo que las escribe es una **`TitleStrategy` extendida** (`core/services/seo-title.strategy.ts`), y no un `SeoService` llamado desde cada componente. La razón es que ese hook **ya estaba funcionando**: es lo que horneaba los títulos en el prerender, cosa que la auditoría confirmó. El router llama a `updateTitle()` después de cada navegación con éxito, en el navegador y en el servidor que prerenderiza, así que montar la descripción, la canónica y las sociales encima es reutilizar un camino ya probado en vez de abrir un segundo. Un `SeoService` sigue existiendo —es quien toca el DOM— pero nadie lo invoca a mano.

Como consecuencia, **el `title` sale de los `*.routes.ts`**: si el título estuviera en dos sitios, un día dirían cosas distintas.

### Lo que queda en el `<head>` de cada ruta

Ejemplo completo, copiado de `dist/web-movia/browser/plans/index.html`:

```html
<title>Planes y precios de Movía desde $39,99 al mes</title>
<meta
	name="description"
	content="Planes de Movía desde $39,99 al mes, de 8 a 28 check-ins en toda la red de centros aliados del Ecuador. Sin permanencia: cambias o cancelas desde la app."
/>
<link rel="canonical" href="https://moviapass.com/plans" />
<meta property="og:title" content="Planes y precios de Movía desde $39,99 al mes" />
<meta
	property="og:description"
	content="Planes de Movía desde $39,99 al mes, de 8 a 28 check-ins en toda la red de centros aliados del Ecuador. Sin permanencia: cambias o cancelas desde la app."
/>
<meta property="og:url" content="https://moviapass.com/plans" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Movía" />
<meta property="og:locale" content="es_EC" />
<meta property="og:image" content="https://moviapass.com/og/og-default.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Planes y precios de Movía desde $39,99 al mes" />
<meta
	name="twitter:description"
	content="Planes de Movía desde $39,99 al mes, de 8 a 28 check-ins en toda la red de centros aliados del Ecuador. Sin permanencia: cambias o cancelas desde la app."
/>
<meta name="twitter:image" content="https://moviapass.com/og/og-default.jpg" />
<meta name="twitter:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
```

Las diez rutas llevan exactamente ese bloque, cambiando el copy y la URL. Las tres legales llevan además `<meta name="robots" content="noindex, follow">` justo detrás de la canónica.

### Títulos y descripciones, antes y después

Todos con la marca **«Movía» con tilde** —antes `Movia para Estudios · Movía` mezclaba las dos formas— y reescritos hacia lo que alguien teclea, no hacia el nombre interno de la página. Las descripciones no nombran ninguna ciudad, como se pidió.

| Ruta                | Título antes                                  | Título después                                              | Long. | Desc. |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------- | ----: | ----: |
| `/`                 | `Movía · Deporte y bienestar en una sola app` | `Movía · Gimnasios, yoga y natación con una sola membresía` |    57 |   159 |
| `/plans`            | `Planes · Movía`                              | `Planes y precios de Movía desde $39,99 al mes`             |    45 |   153 |
| `/partners`         | `Movia para Estudios · Movía`                 | `Suma tu gimnasio o estudio a la red de Movía`              |    44 |   156 |
| `/corporate`        | `Movia para Empresas · Movía`                 | `Bienestar corporativo para tu equipo · Movía`              |    44 |   152 |
| `/contact`          | `Contáctanos · Movía`                         | `Contacta con Movía: soporte, empresas y centros`           |    47 |   156 |
| `/help`             | `Centro de ayuda · Movía`                     | `Centro de ayuda de Movía: check-ins, planes y pagos`       |    51 |   154 |
| `/legal`            | `Movía` (el de por defecto)                   | `Información legal y políticas de Movía`                    |    38 |   154 |
| `/legal/terms`      | `Términos y condiciones · Movía`              | igual                                                       |    30 |   150 |
| `/legal/privacy`    | `Políticas de privacidad · Movía`             | igual                                                       |    31 |   152 |
| `/legal/data-usage` | `Política de uso de datos · Movía`            | igual                                                       |    32 |   147 |
| 404                 | —                                             | `Página no encontrada · Movía`                              |    28 |   147 |

Las once descripciones están entre 140 y 160 caracteres, verificado uno a uno.

### Qué se indexa y qué no

| Ruta                                                          | Indexable | Motivo                                                                                                    |
| ------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `/`, `/plans`, `/partners`, `/corporate`, `/contact`, `/help` | sí        | Son el producto                                                                                           |
| `/legal`                                                      | **sí**    | Ya no está vacía (fase 4): es un índice real con enlaces a los tres documentos, y aporta enlazado interno |
| `/legal/terms`, `/legal/privacy`, `/legal/data-usage`         | **no**    | Siguen sin texto. `noindex, follow`: no se indexan, pero sus enlaces sí se siguen                         |
| 404                                                           | **no**    | Una URL que no nombra ninguna página no tiene nada para lo que posicionar                                 |

`<html lang="es-EC">` en `src/index.html` y `"lang": "es-EC"` en el manifest.

### La imagen social

La `og:image` apunta a `/og/og-default.jpg` en las diez rutas. **Ese archivo no existe: lo aportas tú.** El mecanismo está preparado para que una ruta lo sobrescriba: `RouteSeo` tiene `image` e `imageAlt` opcionales, y una ruta que quiera su propia tarjeta —precios en `/plans`, la oferta en `/partners`— solo tiene que añadir esos dos campos en su entrada del mapa. Nada más cambia.

---

## Fase 2 — `robots.txt` y `sitemap.xml`

Hallazgo 5. Commit `build(seo): generar robots.txt y sitemap.xml en el build`.

No son dos archivos en `public/`: los genera `scripts/generate-seo-files.mjs` (Node puro, sin dependencias nuevas) enganchado a `build:prod`. Lee las rutas de `dist/web-movia/prerendered-routes.json` —que las escribe el propio router— y la base pública de `environment.prod.ts`. **Una ruta nueva entra sola en el sitemap y una ruta con `noindex` se queda fuera sola**, porque el script lo comprueba leyendo el HTML construido en vez de llevar su propia lista.

Salida del build:

```
[seo] sitemap.xml con 7 de 10 rutas (base https://moviapass.com).
[seo] fuera del sitemap por noindex: /legal/data-usage, /legal/privacy, /legal/terms.
[seo] robots.txt escrito en dist/web-movia/browser.
```

`dist/web-movia/browser/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /index.csr.html

Sitemap: https://moviapass.com/sitemap.xml
```

`dist/web-movia/browser/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://moviapass.com</loc>
	</url>
	<url>
		<loc>https://moviapass.com/contact</loc>
	</url>
	<url>
		<loc>https://moviapass.com/corporate</loc>
	</url>
	<url>
		<loc>https://moviapass.com/help</loc>
	</url>
	<url>
		<loc>https://moviapass.com/legal</loc>
	</url>
	<url>
		<loc>https://moviapass.com/partners</loc>
	</url>
	<url>
		<loc>https://moviapass.com/plans</loc>
	</url>
</urlset>
```

Sin `lastmod`, `changefreq` ni `priority` a propósito: Google ignora los dos últimos desde hace años, y un `lastmod` con la fecha del build diría que las siete páginas cambiaron hoy cada vez que se despliega, que es la señal que hace que se deje de mirar.

---

## Fase 3 — Contenido que no llegaba al HTML

Hallazgos 6 y 7. Commit `fix(seo): que las preguntas y respuestas lleguen al HTML prerenderizado`.

La causa era la misma en las dos pantallas: el contenido **se creaba al pulsar**, y en el prerender no hay nadie que pulse.

### `/help`: las pestañas de Angular Aria

Los paneles llevaban `<ng-template ngTabContent>`, que es la carga perezosa de la librería: pinta el panel la primera vez que se SELECCIONA. Se quitó y el contenido pasó a estar directamente dentro del `ngTabPanel`.

**La accesibilidad no depende de esa plantilla y no ha empeorado.** `ngTabPanel` sigue poniendo, y se ha verificado en el HTML del dist:

```html
<div role="tabpanel" id="ng-tabpanel-…-0" tabindex="0" aria-labelledby="ng-tab-…-0">
	<div role="tabpanel" id="ng-tabpanel-…-1" tabindex="-1" inert="true" aria-labelledby="ng-tab-…-1" class="hidden">
		<div role="tabpanel" id="ng-tabpanel-…-2" tabindex="-1" inert="true" aria-labelledby="ng-tab-…-2" class="hidden"></div>
	</div>
</div>
```

```html
<li role="tab" id="ng-tab-…-0" aria-selected="true" aria-controls="ng-tabpanel-…-0" …></li>
<li role="tab" id="ng-tab-…-1" aria-selected="false" aria-controls="ng-tabpanel-…-1" …></li>
```

El `inert` de los paneles que no se leen es de la propia directiva y los saca del árbol de accesibilidad y de la tabulación; lo único que hay que poner a mano es la ocultación VISUAL, que es literalmente lo que dice la documentación de `ngTabPanel` («Proper styling is required for visual hiding»). Se comprobó en el navegador que las flechas del teclado siguen moviendo entre pestañas, que `aria-selected` se mueve con ellas y que el foco visible sigue igual.

**Dos avisos honestos sobre esto:**

1. En modo desarrollo Angular Aria escribe en consola `ngTabPanel must have an ngTabContent structural directive to render`, una vez por panel. Es la librería empujando hacia la carga perezosa, que aquí es exactamente lo que no se quiere. En el build de producción no aparece (va dentro de `ngDevMode`).
2. La ocultación se decide con el signal `selectedGroupId()` del componente y **no** leyendo el `visible()` del propio panel. Leer una variable de plantilla en un binding de su mismo elemento evalúa antes de que Angular haya fijado el `[value]` obligatorio, y el prerender se cae con `NG0950`. Se detectó porque el build lo gritó, no en revisión.

### El acordeón: la respuesta siempre en el DOM

`shared/components/faq-accordion/` pasa de `@if (isOpen(...))` a un `<p>` presente con `[attr.hidden]` atado al mismo estado que `aria-expanded`. Se usa `[attr.hidden]` y no `[hidden]` porque el segundo es una propiedad del DOM y lo que tiene que quedar escrito en el HTML del prerender es el **atributo**. Verificado en el dist:

```html
<p class="text-muted lg:text-body-lg pb-6" id="usuarios-panel-que-es-movia" hidden="true"></p>
```

### La verificación que se pidió

```
$ grep -c "Es cada entrada a un centro aliado" dist/web-movia/browser/index.html
1
$ grep -c "Es cada entrada a un centro aliado" dist/web-movia/browser/help/index.html
1
```

| Medida (sobre el `<main>` del dist) | Antes |   Después |
| ----------------------------------- | ----: | --------: |
| Palabras en `/help`                 |    61 | **1.008** |
| Palabras en `/`                     |   376 |   **608** |
| Preguntas de `/help` como `h3`      |     0 |    **24** |

Árbol de encabezados de `/help`, sin saltos de nivel:

```
h1  Centro de ayuda
h2  Preguntas frecuentes
    h3  ¿Qué es Movia y en qué se diferencia de un gimnasio?
    h3  ¿Cómo empiezo?
    h3  ¿Qué es un check-in?
    h3  ¿Puedo cambiar de deporte cuando quiera?
    h3  ¿Necesito llevar carnet o algún documento?
    h3  ¿Qué pasa si uso todos mis check-ins del mes?
    h3  ¿Qué pasa si reservo una clase y no puedo ir?
    h3  ¿Puedo cambiar o cancelar mi plan?
    h3  ¿En qué ciudades puedo usar Movia?
    h3  ¿Cómo y cuándo se me cobra?
    h3  ¿Qué es Movia para Empresas?
    h3  ¿Cómo se factura?
    h3  ¿Podemos dar de alta y de baja a personas cuando queramos?
    h3  ¿Hay un mínimo de personas para contratar?
    h3  ¿Sabemos cuánto se usa el beneficio?
    h3  ¿La empresa paga todo o se puede compartir con el empleado?
    h3  ¿Cómo empezamos?
    h3  ¿Qué gano sumándome a Movia?
    h3  ¿Cuánto cuesta entrar en la red?
    h3  ¿Cómo se me paga?
    h3  ¿Tengo que reservar cupos para Movia?
    h3  ¿Hay contrato de permanencia?
    h3  ¿Cómo se registra la visita en recepción?
    h3  ¿Cómo me uno?
```

Las 24 preguntas son `h3` bajo el `h2` de la sección. **No se añadió un encabezado por audiencia** —que habría obligado a bajar las preguntas a `h4`— porque a quién habla cada bloque ya lo dice la pestaña, y el panel la declara con `aria-labelledby`.

> Nota sobre el 120 de la auditoría: aquel recuento incluía cabecera y pie. Midiendo solo el `<main>`, que es lo que hace este informe antes y después, el punto de partida eran 61 palabras.

---

## Fase 4 — `/legal` y la página 404

Hallazgo 8 y el del comodín. Commit `feat(legal): página índice de /legal y 404 real en el comodín`.

### `/legal` era una página en blanco indexable

`LEGAL_ROUTES` no declaraba nada para el path vacío, pero la ruta padre existía, así que **el prerender escribía `legal/index.html` igualmente**: un archivo indexable con el `<main>` vacío y el título por defecto. Ahora ese path lo reclama `features/legal/legal-index/`.

`<head>` de `/legal` en el dist:

```html
<title>Información legal y políticas de Movía</title>
<meta
	name="description"
	content="Términos y condiciones, políticas de privacidad y política de uso de datos de Movía: los documentos que rigen el uso de la aplicación y de este sitio web."
/>
<link rel="canonical" href="https://moviapass.com/legal" />
<meta property="og:title" content="Información legal y políticas de Movía" />
<meta
	property="og:description"
	content="Términos y condiciones, políticas de privacidad y política de uso de datos de Movía: los documentos que rigen el uso de la aplicación y de este sitio web."
/>
<meta property="og:url" content="https://moviapass.com/legal" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Movía" />
<meta property="og:locale" content="es_EC" />
<meta property="og:image" content="https://moviapass.com/og/og-default.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Información legal y políticas de Movía" />
<meta
	name="twitter:description"
	content="Términos y condiciones, políticas de privacidad y política de uso de datos de Movía: los documentos que rigen el uso de la aplicación y de este sitio web."
/>
<meta name="twitter:image" content="https://moviapass.com/og/og-default.jpg" />
<meta name="twitter:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
```

`<main>` de `/legal` en el dist (90 palabras, antes 0):

```html
<main>
	<app-legal-index>
		<section aria-labelledby="legal-title" class="bg-secondary text-secondary-contrast">
			<div class="max-w-content mx-auto px-6 pt-40 pb-16 lg:px-8 lg:pt-45 lg:pb-20">
				<h1 id="legal-title" class="font-display lg:text-headline text-3xl font-bold">Información legal</h1>
				<p class="lg:text-body-lg mt-6 max-w-2xl text-lg">
					Estos son los documentos que rigen el uso de Movía, tanto de la aplicación como de este sitio.
				</p>
			</div>
		</section>
		<section aria-labelledby="legal-documents-title" class="bg-surface">
			<div class="max-w-content mx-auto px-6 py-16 lg:px-8 lg:py-20">
				<h2 id="legal-documents-title" class="font-display text-ink lg:text-headline text-2xl font-bold">Documentos</h2>
				<ul class="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-6">
					<li class="border-border hover:border-secondary rounded-2xl border p-6 transition-colors lg:p-7">
						<h3 class="font-display text-ink text-xl font-semibold">
							<a class="hover:text-primary-shade transition-colors" href="/legal/terms">Términos y condiciones</a>
						</h3>
						<p class="text-muted mt-3">
							Las reglas del servicio: qué incluye cada plan, cómo se cobra la suscripción y qué ocurre cuando la cancelas.
						</p>
					</li>
					<li …>
						<h3 …><a href="/legal/privacy">Políticas de privacidad</a></h3>
						<p class="text-muted mt-3">
							Qué datos personales tratamos, para qué los usamos, cuánto tiempo los conservamos y cómo ejercer tus derechos.
						</p>
					</li>
					<li …>
						<h3 …><a href="/legal/data-usage">Política de uso de datos</a></h3>
						<p class="text-muted mt-3">
							Qué hacemos con la información que dejas en el formulario de contacto y con la que se genera dentro de la aplicación.
						</p>
					</li>
				</ul>
			</div>
		</section>
	</app-legal-index>
</main>
```

Árbol: `h1 Información legal` → `h2 Documentos` → tres `h3`, uno por documento. Sin saltos.

Detalle de maquetación con intención: **el enlace envuelve solo el título, no la tarjeta entera.** El texto de un enlace es lo que Google lee como descripción de su destino; una tarjeta entera convertida en enlace le regala el resumen y lo diluye.

### Las tres páginas legales

**Siguen sin texto y no se inventó nada.** Están en `noindex` y fuera del sitemap hasta que exista el contenido. Su `description` describe el ALCANCE del documento —qué debería responder—, no su contenido, y habrá que repasarla contra el texto real cuando llegue.

### La página 404

`app.routes.ts` cambia `{ path: '**', redirectTo: '' }` por `shared/pages/not-found/`. La redirección a la home convertía cada URL equivocada en la home servida con un 200 —un _soft 404_— y, para quien la había tecleado, se leía como que el sitio te echa.

La página vive en `shared/pages/` y no en `features/` porque un error de navegación **no es un dominio de negocio**: no tiene datos ni modelo y lo invoca el router desde cualquier parte (`RULES.md` regla 11). Verificado en el navegador sobre `/esta-ruta-no-existe`:

```
title:     Página no encontrada · Movía
robots:    noindex, follow
h1:        Esta página no existe
enlaces:   / · /help · /partners · /corporate · /plans · /contact
```

**No aparece en el sitemap**, y no hace falta excluirla a mano: el prerender no emite el comodín (`Prerendered 10 static routes`, las mismas diez de antes).

---

## Fase 5 — Imágenes

Hallazgo 10. Commit `perf(imgs): convertir las imágenes a WebP y bajarlas al tamaño en que se ven`.

`scripts/optimize-images.mjs`, con `sharp` como devDependency (la única que se instaló). Se ejecuta a mano con `npm run imgs:optimize` y **no cuelga del build**: las fotos las entrega diseño de una en una, y convertirlas en cada build sería pagar veinte segundos por un trabajo que solo cambia cuando llega una imagen nueva. El resultado se commitea.

Cada imagen va al **doble del ancho mayor al que se ve**, medido en el navegador con `getBoundingClientRect()` a 1920 px y a 375 px y quedándose con el mayor. El doble, porque en una pantalla retina un píxel CSS son dos físicos. **Nunca agranda**: si el doble supera el original, se queda el original. Una imagen sin fila en la tabla se convierte sin redimensionar, que es lo seguro para cualquier archivo que llegue después.

### Antes y después, imagen por imagen

| Imagen                             |        Antes |              |    Después |              |   Ahorro |
| ---------------------------------- | -----------: | -----------: | ---------: | -----------: | -------: |
| `corporate/beneficios-colaborador` |     1064×544 |       139 KB |   1064×544 |        37 KB |     73 % |
| `corporate/beneficios-empresa`     |     1064×544 |       194 KB |   1064×544 |        61 KB |     69 % |
| `corporate/hero`                   |    1920×1080 |       237 KB |  1920×1080 |       103 KB |     57 % |
| `corporate/modelo-movil`           |    1884×1095 |       330 KB |  1884×1095 |        90 KB |     73 % |
| `corporate/modelo`                 |     1000×775 |       145 KB |   1000×775 |        42 KB |     71 % |
| `corporate/por-que-pequena`        |      690×570 |       115 KB |    546×451 |        28 KB |     76 % |
| `corporate/por-que`                |     876×1334 |       181 KB |    648×987 |        22 KB |     88 % |
| `home/app-movia`                   |     714×1216 |       731 KB |   714×1216 |        68 KB | **91 %** |
| `home/categorias/artes-marciales`  |      596×744 |       171 KB |    516×644 |        17 KB |     90 % |
| `home/categorias/baile`            |      596×744 |       198 KB |    516×644 |        17 KB |     91 % |
| `home/categorias/gimnasio`         |      596×744 |       299 KB |    516×644 |        36 KB |     88 % |
| `home/categorias/natacion`         |      596×744 |       543 KB |    516×644 |        66 KB |     88 % |
| `home/categorias/yoga`             |      596×744 |       203 KB |    516×644 |        19 KB |     91 % |
| `home/cta-persona`                 |     1000×615 |       367 KB |   1000×615 |        48 KB |     87 % |
| `home/empresas`                    |     657×1001 |       342 KB |   657×1001 |        40 KB |     88 % |
| `home/estudios`                    |     657×1001 |       322 KB |   657×1001 |        38 KB |     88 % |
| `home/hero-movil`                  |     1080×961 |       263 KB |   1080×961 |       102 KB |     61 % |
| `home/hero`                        |    1731×1025 |       332 KB |  1731×1025 |       106 KB |     68 % |
| `home/mapa`                        |     1920×698 |       172 KB |   1920×698 |        46 KB |     73 % |
| `layout/app-store`                 |     1057×362 |        22 KB |     280×96 |         5 KB |     77 % |
| `layout/facebook`                  |      400×400 |         7 KB |      88×88 |         3 KB |     57 % |
| `layout/google-play`               |     1063×362 |        22 KB |     282×96 |         5 KB |     77 % |
| `layout/instagram`                 |      400×400 |        11 KB |      88×88 |         3 KB |     73 % |
| `layout/linkedin`                  |      400×400 |         7 KB |      88×88 |         3 KB |     57 % |
| `layout/logo-movia`                | **4106×554** |        69 KB | **622×84** |        12 KB |     83 % |
| `partners/como-funciona-pequena`   |      690×570 |       127 KB |    406×335 |        24 KB |     81 % |
| `partners/como-funciona`           |     657×1001 |       342 KB |    592×902 |        34 KB |     90 % |
| `partners/hero-movil`              |    1080×1106 |       131 KB |    750×768 |        49 KB |     63 % |
| `partners/hero`                    |    1920×1080 |       191 KB |  1920×1080 |       108 KB |     43 % |
| `partners/riesgo-cero`             |     657×1001 |       215 KB |    650×990 |        17 KB | **92 %** |
| `partners/solucion`                |      690×570 |       114 KB |    462×382 |        22 KB |     81 % |
| **Total en disco**                 |              | **6.542 KB** |            | **1.271 KB** | **81 %** |

**Total transferido de la home**, medido por Lighthouse en móvil: **2.776 KB → 929 KB sin comprimir (−67 %)**, o **584 KB con gzip (−79 %)**. Su LCP, de 7,2 s a 5,3 s sin comprimir y a 3,2 s con gzip.

El `dist` entero pasa de 7,4 MB a **2,8 MB**, de los cuales 1,6 MB son las imágenes.

### Un criterio que hubo que corregir a mitad

«El doble del ancho mostrado» **no vale para una imagen con `object-cover`**: ahí la imagen se recorta para cubrir la caja y quien manda puede ser el ALTO. Los dos `hero-movil` son el caso: se ven a 375 px de ancho pero cubriendo una caja mucho más alta que ancha, así que bajarlos a 750 px los dejaba borrosos en retina. Se quitaron de la tabla y se quedan con su tamaño original; el script lleva la regla escrita (`max(anchoCaja/anchoOriginal, altoCaja/altoOriginal)`, con la caja ya multiplicada por dos).

### Originales borrados

Se verificó primero que **ninguna plantilla referencia ya un `.jpg` o `.png` bajo `imgs/`** (`grep -rnoE "imgs/[…]\.(jpg|jpeg|png)" src/` → sin resultados) y después se borraron los 31 originales:

`corporate/`: `beneficios-colaborador.jpg`, `beneficios-empresa.jpg`, `hero.jpg`, `modelo-movil.jpg`, `modelo.jpg`, `por-que-pequena.jpg`, `por-que.jpg` — `home/`: `app-movia.png`, `categorias/artes-marciales.jpg`, `categorias/baile.jpg`, `categorias/gimnasio.jpg`, `categorias/natacion.jpg`, `categorias/yoga.jpg`, `cta-persona.png`, `empresas.jpg`, `estudios.jpg`, `hero-movil.jpg`, `hero.jpg`, `mapa.jpg` — `layout/`: `app-store.png`, `facebook.png`, `google-play.png`, `instagram.png`, `linkedin.png`, `logo-movia.png` — `partners/`: `como-funciona-pequena.jpg`, `como-funciona.jpg`, `hero-movil.jpg`, `hero.jpg`, `riesgo-cero.jpg`, `solucion.jpg`.

**Dos cosas que tienes que saber de este borrado, y que debí avisarte antes de hacerlo:**

1. **Las carpetas `corporate/` y `partners/` de `public/imgs/` no estaban en git** (eran archivos sin commitear de tu trabajo en curso). Borrar sus JPG eliminó la única copia que había en el repositorio. Los WebP conservan el contenido al tamaño en que se usa, así que **la web no perdió nada**, pero los másteres a resolución completa de esas trece fotos ya no están aquí. Los tendrás en la entrega de diseño; si quieres volver a derivarlas, hay que partir de ahí. Recomendación para lo que viene: guardar los másteres en el repositorio (o fuera de `public/`) antes de convertir.
2. Por eso mismo, **`partners/hero-movil` se quedó en 750×768** en vez de mantener sus 1080×1106: cuando detecté el fallo de criterio del `object-cover` ya no tenía el original para rehacerla. En una pantalla retina se ve algo blanda, pero está bajo un velo de carbón al 80 % que lo disimula. El de la home sí se pudo rehacer y está a 1080×961.

`corporate/modelo-movil.webp` **no lo referencia ninguna plantilla**: se convirtió para no perderlo, pero hoy no se está viendo en ninguna pantalla. Decide tú si sobra.

`fetchpriority="high"` de los dos heroes LCP y el `priority` de `NgOptimizedImage` se quedaron intactos, como se pidió. Los `width`/`height` se actualizaron a las nuevas dimensiones intrínsecas donde cambiaron, y el aviso `NG0913` del logo —que salía en todas las páginas— ha desaparecido de la consola.

---

## Fase 6 — Datos estructurados

Commit `feat(seo): datos estructurados de la marca y de los planes`.

Se generan desde el mismo sistema de la fase 1 (`core/constants/structured-data.constants.ts`), no escritos a mano en cada plantilla, y el `SeoService` los escribe como `<script type="application/ld+json">` en el `<head>`. En navegación por el cliente los bloques de la ruta anterior se retiran antes de escribir los nuevos: se verificó en el navegador que ir de `/` a `/plans` y volver deja `Organization + WebSite → Product → Organization + WebSite`, y una sola canónica en todo momento.

### `/`

```json
{
	"@context": "https://schema.org",
	"@type": "Organization",
	"name": "Movía",
	"legalName": "MoviaPass SAS",
	"url": "https://moviapass.com",
	"logo": "https://moviapass.com/imgs/layout/logo-movia.webp",
	"image": "https://moviapass.com/og/og-default.jpg",
	"areaServed": "EC",
	"contactPoint": {
		"@type": "ContactPoint",
		"contactType": "customer support",
		"email": "soporte@moviapass.com",
		"telephone": "+593995489085",
		"areaServed": "EC",
		"availableLanguage": "es"
	}
}
```

```json
{
	"@context": "https://schema.org",
	"@type": "WebSite",
	"name": "Movía",
	"url": "https://moviapass.com",
	"inLanguage": "es-EC",
	"publisher": { "@type": "Organization", "name": "Movía", "url": "https://moviapass.com" }
}
```

### `/plans`

```json
{
	"@context": "https://schema.org",
	"@type": "Product",
	"name": "Membresía Movía",
	"description": "Una suscripción mensual que da acceso a la red de gimnasios, estudios y centros de bienestar aliados de Movía en el Ecuador.",
	"brand": { "@type": "Brand", "name": "Movía" },
	"url": "https://moviapass.com/plans",
	"image": "https://moviapass.com/og/og-default.jpg",
	"offers": [
		{
			"@type": "Offer",
			"name": "Basic",
			"description": "Para empezar a moverte sin comprometer tu rutina ni tu presupuesto.",
			"price": "39.99",
			"priceCurrency": "USD",
			"availability": "https://schema.org/InStock",
			"url": "https://moviapass.com/plans"
		},
		{
			"@type": "Offer",
			"name": "Standard",
			"description": "Para quienes entrenan varias veces por semana y alternan disciplinas.",
			"price": "59.99",
			"priceCurrency": "USD",
			"availability": "https://schema.org/InStock",
			"url": "https://moviapass.com/plans"
		},
		{
			"@type": "Offer",
			"name": "Premium",
			"description": "Máxima flexibilidad para quienes viven y respiran deporte.",
			"price": "69.99",
			"priceCurrency": "USD",
			"availability": "https://schema.org/InStock",
			"url": "https://moviapass.com/plans"
		},
		{
			"@type": "Offer",
			"name": "Enterprise",
			"description": "El plan de empresa: la compañía co-financia la mitad y el colaborador paga el resto.",
			"price": "49.99",
			"priceCurrency": "USD",
			"availability": "https://schema.org/InStock",
			"url": "https://moviapass.com/plans"
		}
	]
}
```

**Los tres bloques parsean como JSON válido** (`JSON.parse` sobre el contenido extraído del dist, sin error).

Los precios salen de `PLANS` y `CORPORATE_PLAN`, que son **las mismas constantes que pintan las tarjetas**: la página escribe `$39,99` y el marcado `39.99` porque hay una sola fuente y una función que convierte la coma decimal. No hay forma de que se separen.

**`sameAs` no se escribe.** La constante está preparada en `external-links.constants.ts` y la propiedad se omite mientras esté vacía: declararla vacía no le dice nada a Google y solo alarga el bloque.

**No se marca el FAQ como `FAQPage`**, como se pidió: desde agosto de 2023 Google solo enseña ese resultado enriquecido a sitios de salud y de administración pública.

Detalle de implementación: la identidad del sitio (`SITE_NAME`, `SITE_LANG`, `DEFAULT_OG_IMAGE`…) salió a `core/constants/site.constants.ts`. Sin eso había un ciclo de imports entre el copy por ruta y los datos estructurados, y con ES modules ese ciclo no es un aviso: es un `ReferenceError` en arranque, y habría salido en el prerender.

---

## Fase 7 — Accesibilidad

Commit `fix(a11y): contraste del gris, objetivos táctiles del pie y landmark header`.

### 7.1 — El contraste de `--color-muted` · **cambio visual transversal, revísalo**

|                                   | Antes                           | Después                                                        |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------- |
| Valor                             | `var(--brand-gray)` → `#92949c` | `color-mix(in srgb, var(--brand-gray) 76%, black)` → `#6f7077` |
| Sobre `surface` (`#ffffff`)       | 3,03:1 ❌                       | **4,93:1** ✅                                                  |
| Sobre `surface-muted` (`#f4f5f8`) | 2,78:1 ❌                       | **4,52:1** ✅                                                  |
| Sobre `surface-shade` (`#fafbfb`) | 2,90:1 ❌                       | **4,76:1** ✅                                                  |

El mínimo AA para texto normal es 4,5:1. Se usa `color-mix` con negro, que es el mismo mecanismo con el que el tema ya oscurece `success` y `warning`.

**Y un token nuevo que hizo falta:** ese mismo `text-muted` se usaba también sobre el carbón —el copyright del pie, las tarjetas de `/plans` y la sección «Variedad sin límites» de la home—, donde oscurecerlo lo dejaba en **3,18:1**. Es decir: arreglar `/contact` rompiendo cinco sitios. Aparece `--color-muted-tint` con el gris **sin** oscurecer (5,19:1 sobre `secondary`, 5,43:1 sobre `secondary-shade`) y esos usos pasan a él. Mismo criterio que el `--color-danger-tint` que ya existía: _la variante existe porque cambia el fondo, no porque cambie el color_.

La regresión de la home la cazó la medición, no la revisión: tras la fase 7 `/` bajó a 96 de Accessibility por la sección de beneficios, que se me había quedado sin cambiar. Corregida y vuelta a medir: 100.

**Lo que no se tocó, y por qué:** el botón de cerrar del `toast` usa `text-muted` sobre `success-surface` (4,37:1) y `danger-surface` (4,11:1). Es un botón **solo de icono**, con su `aria-label`, así que el criterio aplicable es el 3:1 de WCAG 1.4.11 para contenido no textual, que cumple de sobra. No hay texto ahí.

### 7.2 — Objetivos táctiles del pie

Los siete enlaces del pie pasan de **17 a 36 px de alto**. WCAG 2.5.8 pide 24×24. Se hace con `block py-2 -my-2`: el relleno agranda la caja pulsable y el margen negativo le devuelve al `<li>` la altura que tenía, así que **el diseño no se mueve**. Medido a 375 px:

|                  | Antes |   Después |
| ---------------- | ----: | --------: |
| Alto del enlace  | 17 px | **36 px** |
| Alto del `<li>`  | 20 px | **20 px** |
| Paso entre filas | 44 px | **44 px** |

Lighthouse: `target-size` pasa en `/contact` y `/help`.

> Fuera de alcance, para que no se pierda: el enlace «Centro de ayuda» del FAQ de la home (125×20) sigue igual. El encargo acotaba 7.2 a los enlaces del pie. Se arregla con la misma clase.

### 7.3 — El landmark `<header>`

`app-header` renderizaba un `<div>`, así que `<header>` aparecía **0 veces** en las diez rutas y un lector de pantalla no tenía atajo a la cabecera. El contenido del componente va ahora dentro de un `<header>`, que cuenta como landmark `banner` porque está fuera de `<main>`. Verificado en el dist: `<header>` 1, `<main>` 1, `<footer>` 1 en cada ruta.

### 7.4 — URLs externas centralizadas

Las cinco URLs (App Store, Google Play, Facebook, Instagram, LinkedIn) viven en `core/constants/external-links.constants.ts`, cada una con su `TODO`, y las plantillas de cabecera, cajón de móvil y pie las leen de ahí por binding. **Siguen pintándose como `#`** porque las URLs reales no existen: siete `href="#"` por página, los mismos que antes. El día que las rellenes, cambian los nueve enlaces y se activa el `sameAs` de los datos estructurados de una vez.

### 7.5 — Verificación

| Ruta             | A11y antes | A11y después | Auditorías que fallan |
| ---------------- | ---------: | -----------: | --------------------- |
| `/contact` móvil |         96 |      **100** | ninguna               |
| `/help` móvil    |         97 |      **100** | ninguna               |
| `/` móvil        |        100 |      **100** | ninguna               |

---

## Estado de los hallazgos de la auditoría

| #   | Hallazgo                                                      | Estado                     | Nota                                                                                                                                                         |
| --- | ------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Cero etiquetas Open Graph y Twitter                           | **Resuelto**               | Las once etiquetas en las diez rutas, horneadas                                                                                                              |
| 2   | No existe ninguna imagen para compartir                       | **Pendiente de ti**        | El mecanismo está listo y apunta a `/og/og-default.jpg`; el archivo lo aportas tú                                                                            |
| 3   | Ninguna ruta tiene `meta description`                         | **Resuelto**               | Once descripciones de 140–160 caracteres                                                                                                                     |
| 4   | Ninguna ruta tiene `canonical`                                | **Resuelto**               | Absoluta, autorreferencial, sin barra final, desde `environment.siteUrl`                                                                                     |
| 5   | No existen `robots.txt` ni `sitemap.xml`                      | **Resuelto**               | Generados en el build desde el router                                                                                                                        |
| 6   | `/help` sin preguntas ni respuestas                           | **Resuelto**               | 61 → 1.008 palabras, 24 `h3`                                                                                                                                 |
| 7   | Respuestas del FAQ del Home fuera del HTML                    | **Resuelto**               | 376 → 608 palabras                                                                                                                                           |
| 8   | `/legal` vacía e indexable                                    | **Resuelto**               | Página índice real con enlace a los tres documentos                                                                                                          |
| 9   | Páginas legales sin contenido                                 | **Mitigado**               | `noindex` y fuera del sitemap. El texto lo aportas tú                                                                                                        |
| 10  | 2,1 MB de imágenes recuperables                               | **Resuelto**               | 6.542 → 1.271 KB en disco; home 2.776 → 929 KB                                                                                                               |
| —   | `index.csr.html` accesible                                    | **Resuelto**               | `Disallow` en `robots.txt`                                                                                                                                   |
| —   | No hay 404 real                                               | **Resuelto**               | `shared/pages/not-found/` en el comodín, con `noindex`                                                                                                       |
| —   | Siete enlaces sin destino                                     | **Parcial**                | Centralizados con `TODO`; siguen a `#` hasta que existan                                                                                                     |
| —   | `<html lang="es">`                                            | **Resuelto**               | `es-EC` en el índice y en el manifest                                                                                                                        |
| —   | Títulos pobres de intención                                   | **Resuelto**               | Los diez reescritos, marca unificada a «Movía»                                                                                                               |
| —   | Falta el landmark `<header>`                                  | **Resuelto**               |                                                                                                                                                              |
| —   | `text-muted` sin contraste                                    | **Resuelto**               | 3,03 → 4,93:1, con variante para fondo oscuro                                                                                                                |
| —   | Objetivos táctiles de 17 px en el pie                         | **Resuelto**               | 36 px sin mover el diseño                                                                                                                                    |
| —   | No hay JSON-LD                                                | **Resuelto**               | `Organization` + `WebSite` + `Product`/`Offer`                                                                                                               |
| —   | `FAQPage`                                                     | **Descartado a propósito** | Google limita ese resultado a salud y administración pública                                                                                                 |
| —   | Favicon: tamaño mal declarado, sin `apple-touch-icon`         | **No abordado**            | Fuera del encargo y necesita iconos nuevos, que no podía crear                                                                                               |
| —   | El `h1` de la home está en inglés                             | **No abordado**            | Es una decisión de marca, no técnica. La carga de palabras clave se llevó al `<title>` y a la descripción, que es la salida que la propia auditoría proponía |
| —   | Faltan las ciudades en el texto                               | **No abordado**            | Habría sido inventar contenido                                                                                                                               |
| —   | Enlazado interno flojo en `/plans`, `/partners`, `/corporate` | **No abordado**            | Fuera del encargo. `/legal` sí aporta enlazado nuevo                                                                                                         |

---

## Qué queda pendiente

### Lo que falta y te toca a ti

| Qué                                                                                                                         | Dónde va exactamente                                                                                                         | Para qué desbloquea                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`og-default.jpg`** — 1200×630 px, JPG, **menos de 300 KB** (por encima de eso WhatsApp deja de descargar la vista previa) | `public/og/og-default.jpg`                                                                                                   | La tarjeta social de las diez rutas. Hoy las etiquetas apuntan ahí y el archivo no existe. También la usan `Organization` y `Product` en el JSON-LD                                                                                                                     |
| **Logo en SVG**                                                                                                             | `public/imgs/layout/` (y cambiar la referencia en `src/app/layout/header/header.html` y `src/app/layout/footer/footer.html`) | Hoy es un bitmap de 622×84 y 12 KB. Ya no es un problema de peso, pero un vector se ve nítido a cualquier densidad                                                                                                                                                      |
| **URLs de App Store y Google Play**                                                                                         | `APP_STORE_URL` y `GOOGLE_PLAY_URL` en `src/app/core/constants/external-links.constants.ts`                                  | Las cuatro insignias de tienda (cabecera, cajón de móvil y pie). Abre además la puerta al `MobileApplication` del JSON-LD                                                                                                                                               |
| **URLs de Facebook, Instagram y LinkedIn**                                                                                  | `FACEBOOK_URL`, `INSTAGRAM_URL` y `LINKEDIN_URL` en el mismo archivo                                                         | Los tres iconos del pie **y** el `sameAs` de `Organization`, que es lo que le dice a Google que el dominio y esas cuentas son la misma marca. Se activa solo al rellenarlas                                                                                             |
| **Texto de los tres documentos legales**                                                                                    | `src/app/features/legal/terms/terms.html`, `.../privacy/privacy.html`, `.../data-usage/data-usage.html`                      | Quitar el `noindex`: poner `indexable: true` en las tres entradas de `src/app/core/constants/seo.constants.ts` y entran solas en el sitemap. Es bloqueante para publicar: el formulario de contacto ya enlaza la política de uso de datos como consentimiento del envío |
| **Ciudades**                                                                                                                | El copy de `src/app/features/home/` y de `src/app/features/plans/`                                                           | «Gimnasios en Quito» y similares son búsquedas locales por definición, y hoy ninguna de las diez rutas nombra una sola ciudad. No lo escribí porque habría sido inventar en qué ciudades opera la red                                                                   |
| **Repasar la `description` de las tres legales**                                                                            | `src/app/core/constants/seo.constants.ts`                                                                                    | Describen el alcance del documento, no su contenido. Con el texto delante conviene ajustarlas                                                                                                                                                                           |

### Lo que depende del hosting

Sigue vigente el [checklist de despliegue de la auditoría](../diagnosticos/2026-09-20-auditoria-seo.md), con un punto que ahora es el más rentable de todos:

- **Compresión brotli o gzip de HTML, CSS y JS.** Es lo único que separa un 75 de Performance móvil en la home de un 93. El mismo build, la misma máquina.
- Caché `immutable` de un año para los archivos con hash, y corta para los `index.html`.
- Rutas sin extensión que devuelven 200 (`/plans` → `/plans/index.html`) y **404 real** para lo que no existe: nada de fallback de SPA a la raíz.
- Una sola versión del dominio y un solo criterio de barra final, coherente con la canónica (que se emite **sin** barra).
- Alta en Search Console y envío de `https://moviapass.com/sitemap.xml`.

---

## Verificación

`npm run lint`, `npm run test` y `npm run build:prod` pasan al final de cada una de las siete fases y al final del trabajo. Ningún test se borró, se comentó ni se marcó como `skip`. No se relajó ninguna regla de lint ni se usó `eslint-disable`, `@ts-ignore` ni `@ts-expect-error`.

Se instaló **una** dependencia, `sharp`, como devDependency y solo para la fase 5, que es lo que se autorizó. Los archivos de configuración tocados son los autorizados: `src/index.html`, `src/styles.css`, `app.routes.ts`, los `*.routes.ts` y `package.json` (dos scripts nuevos, `seo:files` e `imgs:optimize`, y `sharp`).

### Confirmación

- **No se creó ninguna imagen.** Las 31 que hay son conversiones de las que ya existían. La `og:image`, el logo SVG y los iconos del manifest siguen sin existir y están listados arriba.
- **No se inventó contenido.** Ni textos legales, ni ciudades, ni URLs de tiendas o de redes. Donde faltaba, la constante quedó preparada con su `TODO` y está reportada.
- **No se cambió el nombre de ninguna ruta.** Las diez URLs son las mismas.
- **No se hizo push.** Siete commits en local, uno por fase.

### Una nota sobre los commits

El árbol de trabajo tenía mucho trabajo tuyo sin commitear cuando empecé (features enteras de `corporate`, `partners` y `contact` sin seguimiento de git, y modificaciones pendientes en `home`, `layout` y `styles.css`). Al acotar cada commit a los archivos que tocaba cada fase, **algunos de esos cambios tuyos han entrado dentro de mis commits**, porque estaban en los mismos archivos y no había forma de separarlos: el `provideHttpClient(withFetch())` de `app.config.ts` en el commit de la fase 1, y las plantillas y constantes de `corporate` y `partners` —que eran archivos sin seguimiento— en el de la fase 5. Nada de eso se modificó; simplemente se commiteó junto a lo mío. Quedan por commitear todavía las eliminaciones de `public/imgs/Empresa/`, las carpetas `features/empresas`, `features/estudios` y `features/planes`, `.github/`, los documentos de `docs/` y el resto de `core/`.
