# Cierre de los pendientes de las correcciones SEO

**Punto de partida:** [Correcciones SEO de la landing](2026-09-20-correcciones-seo.md), del día anterior, y la [auditoría](../diagnosticos/2026-09-20-auditoria-seo.md) que la originó.
**Qué cierra:** el trabajo que quedó sin commitear, las tres imágenes de marca que faltaban y los datos de `Organization` que estaban puestos a ojo.
**No se hizo push. No se borró ningún archivo sin versionar.**

## Resumen

El repositorio tenía 79 entradas sin commitear —features enteras, todo `core/`, los informes de `docs/` y los workflows de CI— y **no construía desde un checkout limpio**: `app.routes.ts` importaba archivos que solo existían en el disco de quien los escribió. Eso queda cerrado en siete commits agrupados por tema.

Con las tres imágenes que aportó el usuario, la `og:image` deja de ser un 404 —llevaba un día apuntando a un archivo inexistente—, aparece el `apple-touch-icon` y el `logo` de los datos estructurados pasa a un cuadrado de 512 px que sí cumple el mínimo de Google. Y `legalName`, `email` y `telephone` quedan con los datos confirmados.

**Lo que hay que mirar:** la razón social se escribió como `MOVIAPASSS SAS`, con triple S, que es lo que se confirmó. Sale en el pie de las diez páginas. Está en [Dato que conviene reconfirmar](#dato-que-conviene-reconfirmar).

---

## Fase A — Cerrar lo que quedó sin commitear

### A1 · Punto de partida

`git status --short` antes de empezar, 79 entradas:

```
 D public/imgs/Empresa/50-50-responsive.jpg
 D public/imgs/Empresa/50-50.jpg
 D public/imgs/Empresa/Banner-principa.jpg
 D public/imgs/Empresa/Colaborador.jpg
 D public/imgs/Empresa/Empresa.jpg
 D "public/imgs/Empresa/Flecha direcci\303\263n.svg"
 D "public/imgs/Empresa/Porqu\303\251-movia-imagen-peque\303\261a.jpg"
 D "public/imgs/Empresa/Porqu\303\251-movia.jpg"
 M src/app/core/constants/navigation.constants.ts
 M src/app/core/interfaces/home.interface.ts
 M src/app/core/interfaces/navigation.interface.ts
 D src/app/features/empresas/empresas.html
 D src/app/features/empresas/empresas.routes.ts
 D src/app/features/empresas/empresas.ts
 D src/app/features/estudios/estudios.html
 D src/app/features/estudios/estudios.routes.ts
 D src/app/features/estudios/estudios.ts
 M src/app/features/home/components/home-faq-section/home-faq-section.html
 M src/app/features/home/components/home-faq-section/home-faq-section.ts
 D src/app/features/planes/planes.html
 D src/app/features/planes/planes.routes.ts
 D src/app/features/planes/planes.ts
 M src/environments/environment.prod.ts
 M src/environments/environment.ts
?? .github/
?? docs/cambios/2026-09-20-ajuste-fiel-al-diseno.md
?? docs/cambios/2026-09-20-esqueleto-y-layout.md
?? docs/cambios/2026-09-20-gobernanza-y-dominio.md
?? docs/cambios/2026-09-20-home-completo.md
?? docs/cambios/2026-09-20-imagenes-conectadas.md
?? docs/cambios/2026-09-20-pagina-de-contacto.md
?? docs/cambios/2026-09-20-pagina-de-corporate.md
?? docs/cambios/2026-09-20-pagina-de-partners.md
?? docs/cambios/2026-09-20-pagina-de-planes.md
?? docs/cambios/2026-09-20-rutas-en-ingles.md
?? docs/cambios/2026-09-20-workflows-de-ci-y-deploy.md
?? docs/decisiones/2026-09-20-contacto-contra-api.md
?? docs/diagnosticos/2026-09-20-auditoria-seo.md
?? docs/disenos/
?? public/imgs/iconos/whatsapp.svg
?? public/imgs/logos/logo+tag.jpg
?? public/imgs/og/
?? src/app/core/constants/contact.constants.ts
?? src/app/core/constants/help.constants.ts
?? src/app/core/constants/partners.constants.ts
?? src/app/core/constants/plans.constants.ts
?? src/app/core/interfaces/contact.interface.ts
?? src/app/core/interfaces/corporate.interface.ts
?? src/app/core/interfaces/faq.interface.ts
?? src/app/core/interfaces/help.interface.ts
?? src/app/core/interfaces/partners.interface.ts
?? src/app/core/interfaces/plan.interface.ts
?? src/app/core/services/contact.service.ts
?? src/app/core/types/contact.type.ts
?? src/app/core/types/form.type.ts
?? src/app/core/types/toast.type.ts
?? src/app/features/contact/components/
?? src/app/features/contact/contact.html
?? src/app/features/contact/contact.ts
?? src/app/features/corporate/components/corporate-benefits-section/
?? src/app/features/corporate/components/corporate-cta-section/
?? src/app/features/corporate/components/corporate-hero-section/corporate-hero-section.ts
?? src/app/features/corporate/components/corporate-model-section/corporate-model-section.ts
?? src/app/features/corporate/components/corporate-onboarding-section/
?? src/app/features/corporate/components/corporate-reasons-section/corporate-reasons-section.ts
?? src/app/features/corporate/corporate.html
?? src/app/features/corporate/corporate.ts
?? src/app/features/legal/data-usage/
?? src/app/features/legal/privacy/
?? src/app/features/legal/terms/
?? src/app/features/partners/components/partners-cta-section/
?? src/app/features/partners/components/partners-growth-section/
?? src/app/features/partners/components/partners-guarantees-section/partners-guarantees-section.ts
?? src/app/features/partners/components/partners-hero-section/partners-hero-section.ts
?? src/app/features/partners/components/partners-solution-section/partners-solution-section.ts
?? src/app/features/partners/components/partners-steps-section/partners-steps-section.ts
?? src/app/features/partners/partners.html
?? src/app/features/partners/partners.ts
?? src/app/features/plans/plans.ts
?? src/app/shared/components/faq-accordion/faq-accordion.ts
?? src/app/shared/components/toast/
```

`git log --oneline origin/main..HEAD`, 26 commits sin publicar:

```
928b659 perf(home): el width/height de las categorías, a su tamaño real
00f08f3 docs(seo): informe de las correcciones de la auditoría SEO
21d1a7b fix(a11y): contraste del gris, objetivos táctiles del pie y landmark header
d37709f feat(seo): datos estructurados de la marca y de los planes
91b455a perf(imgs): convertir las imágenes a WebP y bajarlas al tamaño en que se ven
6a51d98 feat(legal): página índice de /legal y 404 real en el comodín
a8d2369 fix(seo): que las preguntas y respuestas lleguen al HTML prerenderizado
1c62d81 build(seo): generar robots.txt y sitemap.xml en el build
77ed4bf feat(seo): descripción, canónica y metadatos sociales en el prerender
9eb0d65 fix(home): la imagen de la sección de pasos, un 10 % más grande
2f138e2 fix(home): reducir la imagen de la sección de pasos y ensanchar los pasos
bbb1854 fix(home): ajustar todas las secciones a las medidas de las capturas
ad401d5 fix(home): que la foto del hero se vea entre las tarjetas
3f877e4 fix(ui): escalar el desktop al 80 % y corregir los iconos de tienda
ab1835d fix(home): ajustar el hero y el header a las medidas del diseño
1aeb44b feat(home): conectar las imágenes reales del diseño
88b2e81 feat(home): maquetar la página Home completa
4481f6e feat(layout): header y footer de la landing
4d35ec6 feat(styles): escala tipográfica, contenedores y espaciado del diseño
d22f2f8 feat(routing): esqueleto de las cuatro páginas de la landing
41b2838 build(deps): subir @ng-icons de 34 a 36
2b65d06 docs: registrar el dominio de la landing y lo que exige al hosting
c2a00a0 chore: limpiar residuos del schematic de SSR
352f9c5 build(deps): alinear el árbol de Angular en 22.1.x
650d426 docs: establecer docs/ como destino de la documentación generada
92511e6 build: prerenderizar la landing con outputMode static
```

`origin/main` apunta a `ece4cb7`, que no está en esa lista: el remoto tiene una historia distinta de la local. **Conviene mirarlo antes del primer push**, porque no es un simple «26 commits por delante».

### A2 · Los dos workflows de `.github/`

Se leyeron enteros antes de commitear nada, y se commitearon **con el visto bueno explícito del usuario**.

| Workflow     | Disparador                                     | ¿Despliega?           | Secretos                                            |
| ------------ | ---------------------------------------------- | --------------------- | --------------------------------------------------- |
| `ci.yml`     | `push` a `main`/`master` y todo `pull_request` | **No**                | `GITHUB_TOKEN`, el que emite GitHub automáticamente |
| `deploy.yml` | **Solo `workflow_dispatch`** (a mano)          | Sí, a `moviapass.com` | `AWS_DEPLOY_ROLE_ARN`, `CLOUDFRONT_DISTRIBUTION_ID` |

**`ci.yml`** fija `TZ: America/Guayaquil` —el año del copyright del pie sale de `new Date().getFullYear()` y un runner en UTC lo sacaría mal un 31 de diciembre—, y corre `npm ci`, `npm run lint`, `npm run test -- --no-watch` y `npm run build:prod`. Un segundo job pasa `gitleaks` con `fetch-depth: 0` para ver el historial completo.

**`deploy.yml`** no tiene disparador por push, y el propio archivo dice por qué: «lo que llega a main se valida en CI, pero quién y cuándo lo publica en moviapass.com es una decisión de personas». Lleva `environment: production` (permite exigir aprobación desde los ajustes del repo), un `concurrency` que impide dos despliegues simultáneos y un input `ref` para desplegar un commit concreto o hacer rollback. Asume el rol de AWS por OIDC, sincroniza `dist/web-movia/browser` contra `s3://moviapass-com` en dos pasadas —assets con caché de un año, HTML sin caché y con `index.csr.html` excluido—, invalida CloudFront entero y comprueba el sitio con un `curl`.

**Nada se despliega solo.** Y commitear no ejecuta nada: haría falta un push, que no se hizo.

### A3 · Los commits

| Commit                                                                         | Qué entra                                                                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `docs: incorporar los informes de la landing que faltaban por versionar`       | 13 documentos de `docs/` y las 3 capturas de `docs/disenos/`                 |
| `ci: versionar los workflows de validación y de despliegue`                    | `.github/workflows/ci.yml` y `deploy.yml`                                    |
| `chore(features): retirar las carpetas del nombrado antiguo`                   | Borrado de `features/{empresas,estudios,planes}` y de `public/imgs/Empresa/` |
| `feat(core): interfaces, tipos y constantes de los dominios de la landing`     | Todo `core/` pendiente, los dos environments y `imgs/iconos/whatsapp.svg`    |
| `feat(landing): páginas de partners, corporate, contacto y legal`              | Las cuatro páginas con sus secciones y los dos componentes de `shared/`      |
| `feat(brand): imagen social, logo cuadrado y apple-touch-icon`                 | Fase B                                                                       |
| `fix(seo): razón social confirmada y logo cuadrado en los datos estructurados` | Fase C                                                                       |

**Verificación antes de borrar las carpetas viejas.** Se comprobó con `grep -rn` sobre `src/` y `scripts/` que nadie las referencia:

- `features/(empresas|estudios|planes)` en imports → sin resultados.
- `EMPRESAS_ROUTES`, `ESTUDIOS_ROUTES`, `PLANES_ROUTES` → sin resultados.
- Las rutas `/empresas`, `/estudios`, `/planes` en `routerLink` o en constantes → sin resultados.
- `imgs/Empresa/` en plantillas, constantes, scripts o `public/` → sin resultados.

Las trece imágenes de `public/imgs/Empresa/` **sí estaban versionadas**, así que se recuperan del historial si hacen falta. Es exactamente lo que la nueva regla 25 obliga a comprobar.

**Orden de los commits y una nota honesta sobre el build.** El árbol **no construía desde un checkout limpio antes de esta tanda**: `app.routes.ts` —commiteado ayer— importaba `@features/partners/partners.routes`, cuyo componente solo existía en disco. Por eso los commits van de menos a más acoplado (docs → CI → borrados → `core/` → páginas) y **es el último de los cinco el que devuelve el árbol a un estado construible**. Los intermedios no construyen por su cuenta, igual que no construía el punto de partida.

### A4 · Verificación

`npm run lint`, `npm run test` y `npm run build:prod` pasan. `Prerendered 10 static routes`, y el generador de la fase 2 sigue emitiendo `sitemap.xml` con 7 de 10 rutas y dejando fuera las tres legales por su `noindex`.

### A5 · Lo que NO se commiteó

`git status --short` al terminar la fase A:

```
?? public/imgs/logos/logo+tag.jpg
?? public/imgs/og/
```

- **`public/imgs/og/`** son las tres imágenes de la fase B. Se commitean ahí, ya en su ruta definitiva.
- **`public/imgs/logos/logo+tag.jpg`** (3383 × 2481, 382 KB) **se queda sin commitear a propósito y se reporta**: no lo referencia ninguna plantilla, constante ni script, y no sé de dónde sale ni para qué es. Decide tú: si es un máster de marca, lo suyo es versionarlo (un archivo sin seguimiento no es un archivo guardado); si es un descarte, se borra — **pero eso lo decides tú, no yo**, que es justo lo que dice la regla nueva.

---

## La regla nueva

Queda escrita en `.claude/RULES.md`, al final y con el número **25**, con el mismo formato y el mismo criterio de numeración que la 24: nunca borrar un archivo que no esté versionado en git sin preguntar antes, con la comprobación obligatoria (`git ls-files --others --exclude-standard -- <ruta>`), la extensión a mover y renombrar, y el caso del que sale —las trece fotos perdidas de `corporate/` y `partners/`—.

> **Ojo con esto:** `.gitignore:10` ignora `.claude` entera, así que `CLAUDE.md`, `RULES.md` y `SETUP.md` **no están versionados**. La regla 25 existe en tu disco y en ningún commit. Es, literalmente, el riesgo del que habla la propia regla. Sacarla del `.gitignore` toca un archivo de configuración y `RULES.md` regla 1 no me deja hacerlo por mi cuenta: dime y lo hago. En `docs/cambios/2026-09-20-gobernanza-y-dominio.md` ya quedó apuntado como pendiente.

---

## Fase B — Imágenes de marca

### B1 · Las tres, verificadas

Estaban en `public/imgs/og/` y se movieron a las rutas del encargo, con tu visto bueno. Moverlas de `public/imgs/` no es un detalle: esa carpeta es la que recorre el script de WebP.

| Archivo                        | Dimensiones |             Peso | Tipo real    | Requisito              |     |
| ------------------------------ | ----------- | ---------------: | ------------ | ---------------------- | --- |
| `public/og/og-default.jpg`     | 1200 × 630  | 32 KB (33.540 B) | `image/jpeg` | 1200×630, JPG, <300 KB | ✅  |
| `public/brand/logo-square.png` | 512 × 512   | 21 KB (22.120 B) | `image/png`  | 512×512                | ✅  |
| `public/apple-touch-icon.png`  | 180 × 180   | 10 KB (10.258 B) | `image/png`  | 180×180                | ✅  |

La social pesa **32 KB de los 300 KB** que es el techo a partir del cual WhatsApp deja de descargar la vista previa: sobra margen.

### B2 · Fuera del script de optimización

El script recorre `public/imgs` y las tres imágenes ya no cuelgan de ahí, así que hoy no las alcanza. Aun así lleva ahora una guardia explícita:

```js
const EXCLUDED_DIRS = ['public/og', 'public/brand'];
…
if (EXCLUDED_DIRS.includes(dir)) return found;
```

Porque ampliar `IMAGES_DIR` a `public` es el cambio de una línea y se las llevaría a WebP sin que nadie se entere hasta que WhatsApp deje de pintar la tarjeta: varios rastreadores sociales no descargan WebP, y Google pide para el `logo` de `Organization` un formato rastreable.

**Un aviso:** al ejecutar el script para probar la guardia, convirtió `public/imgs/logos/logo+tag.jpg` —el archivo huérfano del que hablo arriba— y generó un `logo+tag.webp` que no debía existir. **El JPG original no se tocó**, porque el script nunca borra. Retiré el `.webp` que acababa de generar yo mismo; no borré nada tuyo.

### B3 · Iconos del `<head>`

```html
<link rel="icon" type="image/png" sizes="557x565" href="favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="manifest.webmanifest" />
```

El favicon dejaba de declarar su tamaño real: el archivo es de **557 × 565** y el manifest lo anunciaba como `64x64`. Un tamaño mentido hace que el navegador elija mal el icono cuando hay varios candidatos. Ahora el manifest dice la verdad y suma los dos archivos nuevos:

```json
"icons": [
	{ "src": "favicon.png", "sizes": "557x565", "type": "image/png" },
	{ "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
	{ "src": "/brand/logo-square.png", "sizes": "512x512", "type": "image/png" }
]
```

**Lo que falta y no se creó, porque no se crean imágenes:**

- **192 × 192** — es uno de los dos tamaños que Android pide para instalar la app desde el navegador. Con el de 512 se puede instalar, pero el de 192 es el que se usa en la pantalla de inicio y sin él Android reescala.
- **Un icono `maskable`** — el que permite que Android recorte el icono a la forma del sistema (círculo, cuadrado redondeado) sin comerse el logo. Necesita el logo centrado dentro de una zona segura, así que no sale de recortar el que hay.

### B4 · Verificación en el dist

Los tres archivos se copian al build:

```
dist/web-movia/browser/og/og-default.jpg        33.540 B
dist/web-movia/browser/brand/logo-square.png    22.120 B
dist/web-movia/browser/apple-touch-icon.png     10.258 B
```

`og:image` de `/` y de `/plans` (idénticas, las diez rutas comparten la imagen por defecto):

```html
<meta property="og:image" content="https://moviapass.com/og/og-default.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
<meta name="twitter:image" content="https://moviapass.com/og/og-default.jpg" />
<meta name="twitter:image:alt" content="Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador" />
```

Iconos horneados en el `<head>` de las diez rutas:

```html
<link rel="icon" type="image/png" sizes="557x565" href="favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="manifest.webmanifest" />
```

---

## Fase C — Datos estructurados

### C1 · Los datos confirmados

| Dato                 | Antes                                           | Después                                  | Dónde                                    |
| -------------------- | ----------------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `legalName`          | `MoviaPass SAS`                                 | **`MOVIAPASSS SAS`**                     | `core/constants/site.constants.ts`       |
| Razón social del pie | `MoviaPass SAS`, escrita a mano en la plantilla | Lee `LEGAL_NAME`                         | `layout/footer/footer.html` y `.ts`      |
| `email`              | `soporte@moviapass.com`                         | igual — **ya coincidía**                 | `core/constants/navigation.constants.ts` |
| `telephone`          | `+593995489085`                                 | igual — **ya coincidía**                 | Derivado de `CONTACT_WHATSAPP`           |
| `logo`               | `/imgs/layout/logo-movia.webp` (622 × 84)       | **`/brand/logo-square.png`** (512 × 512) | `core/constants/site.constants.ts`       |

**Unificaciones.** El único valor que aparecía con dos formas distintas era la razón social: `site.constants.ts` decía `MoviaPass SAS` y la plantilla del pie lo escribía otra vez a mano, también como `MoviaPass SAS`. Ahora la plantilla lo lee de la constante, así que hay una sola fuente y el cambio salió en los dos sitios a la vez. Comprobado: no queda ningún `MoviaPass SAS` escrito a mano en `src/`.

El email y el teléfono **no hizo falta unificarlos**: `soporte@moviapass.com` ya era el mismo en el pie, en `/contact` y en el JSON-LD, y el teléfono del marcado sale de `CONTACT_WHATSAPP` quitándole los separadores (`+593 99 548 9085` → `+593995489085`), que es exactamente el valor confirmado. El teléfono no es «ninguno», así que la propiedad `telephone` se queda.

El `logo` cambia porque el horizontal mide 622 × 84 y Google exige un mínimo de **112 × 112** para el `logo` de `Organization`: declarar el horizontal era declarar algo que se iba a descartar.

### C2 · La oferta «Enterprise»

**Se queda.** La comprobación se hizo sobre el texto visible de `dist/web-movia/browser/plans/index.html`, quitando los `<script>` y las etiquetas:

| Término                                  | ¿Visible en `/plans`? |
| ---------------------------------------- | --------------------- |
| `Enterprise`                             | ✅ 1 vez              |
| `$49,99`                                 | ✅ 1 vez              |
| `/mes por colaborador`                   | ✅ 1 vez              |
| `Para empresas` (la pastilla del bloque) | ✅ 1 vez              |
| `Basic` · `$39,99`                       | ✅                    |
| `Standard` · `$59,99`                    | ✅                    |
| `Premium` · `$69,99`                     | ✅                    |

Contexto exacto del fragmento visible:

> …Dos pases de invitado al mes Sesiones con entrenador personal Suscribirme **Para empresas Enterprise $49,99 /mes por colaborador** El plan de empresa: la compañía co-financia la mitad y el colaborador paga el resto. Ver Movia para Empresas…

El plan corporativo tiene su propio bloque en `/plans`, debajo de las tres tarjetas individuales y con la pastilla «Para empresas». Los cuatro precios del marcado corresponden a texto visible de la página, que es lo que Google exige. No hay nada que sacar.

### C3 · JSON-LD final

**`/`** — dos bloques.

```json
{
	"@context": "https://schema.org",
	"@type": "Organization",
	"name": "Movía",
	"legalName": "MOVIAPASSS SAS",
	"url": "https://moviapass.com",
	"logo": "https://moviapass.com/brand/logo-square.png",
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

**`/plans`** — un bloque, con las cuatro ofertas.

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

**Los tres bloques parsean como JSON válido**, comprobado con `JSON.parse` sobre lo extraído del dist (427, 199 y 1.315 bytes).

El pie renderizado, en las diez rutas:

```
© 2026 MOVIAPASSS SAS · Todos los derechos reservados
```

`sameAs` sigue sin escribirse porque las URLs de redes siguen sin existir; la constante está preparada en `core/constants/external-links.constants.ts`.

---

## Dato que conviene reconfirmar

`legalName` quedó como **`MOVIAPASSS SAS`**, con **tres eses**, porque es lo que se pasó como única fuente válida y no se inventan datos. Se aplicó tal cual, sin «corregirlo».

Merece un vistazo por dos motivos: en el repositorio figuraba antes como `MoviaPass SAS` —dos eses, otra capitalización—, y **este dato sale impreso en el pie de las diez páginas**, no solo en el marcado que lee Google. Si la triple S viene del registro mercantil, está bien y no hay nada que hacer. Si fue un desliz al escribirlo, se arregla cambiando una línea en `src/app/core/constants/site.constants.ts` y sale corregido en el pie y en el JSON-LD a la vez.

## Lo que sigue pendiente

Del [informe de ayer](2026-09-20-correcciones-seo.md), sin cambios:

| Qué                                        | Dónde va                                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **URLs de App Store y Google Play**        | `APP_STORE_URL` y `GOOGLE_PLAY_URL` en `src/app/core/constants/external-links.constants.ts`                                  |
| **URLs de Facebook, Instagram y LinkedIn** | En el mismo archivo. Activan solas el `sameAs` de `Organization`                                                             |
| **Texto de los tres documentos legales**   | `src/app/features/legal/{terms,privacy,data-usage}/` — y `indexable: true` en `seo.constants.ts` para sacarlos del `noindex` |
| **Ciudades en el copy**                    | Home y `/plans`                                                                                                              |
| **Logo en SVG**                            | `public/imgs/layout/`                                                                                                        |

Nuevo de hoy:

| Qué                                                 | Nota                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| **Icono de 192 × 192 y uno `maskable`**             | Para instalar en Android con el icono correcto. No se crean imágenes   |
| **Decidir qué es `public/imgs/logos/logo+tag.jpg`** | Sin commitear y sin referencias. Versionarlo o borrarlo, tú decides    |
| **Sacar `.claude/` del `.gitignore`**               | La gobernanza —incluida la regla 25 recién escrita— no está versionada |
| **Mirar la divergencia con `origin/main`**          | El remoto apunta a un commit que no está en la historia local          |

---

## Confirmación

- **No se hizo push.** Siete commits nuevos en local, agrupados por tema.
- **No se borró ningún archivo sin versionar.** Lo único que se retiró fue un `logo+tag.webp` que había generado yo mismo un segundo antes al probar el script; el JPG original sigue intacto y sin commitear.
- **Se preguntó antes de tocar lo que tocaba preguntar**: los workflows de `.github/` y el traslado de las tres imágenes.
- **No se crearon imágenes.** Las tres que usa esta tarea las aportó el usuario; los dos iconos que faltan se reportan sin crearlos.
- **No se inventaron datos.** La razón social, el email y el teléfono son los confirmados, aplicados literalmente.
- `npm run lint`, `npm run test` y `npm run build:prod` pasan.
