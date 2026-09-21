# Esqueleto de rutas, design system y layout

Tres fases sobre un proyecto que estaba literalmente vacío: las cuatro rutas de la landing, los tokens que se pudieron medir en el diseño del Home, y el header y el footer montados alrededor del router-outlet. **No se ha creado ni una imagen** y **no se ha hecho push**.

---

## Paso 0 — Punto de partida

### 0.1 · La carpeta del diseño no se llama como decía el encargo

`docs/diseno/` **no existe**. Lo que hay es `docs/disenos/` (en plural), sin versionar todavía, con **23 capturas** en vez de dos:

```
$ ls -la docs/disenos/
total 99168
-rw-r--r--@ 1 carlossanchez staff 3416473 Sep 20 17:50 Screenshot 2026-09-20 at 5.50.34 PM.png
-rw-r--r--@ 1 carlossanchez staff 2340241 Sep 20 17:50 Screenshot 2026-09-20 at 5.50.39 PM.png
... (23 archivos, todos de 2992 × 1934 px, entre 1,3 MB y 4,5 MB)
-rw-r--r--@ 1 carlossanchez staff 1483227 Sep 20 17:51 Screenshot 2026-09-20 at 5.51.52 PM.png
```

Dos detalles que conviene saber: los nombres llevan un **espacio fino no separable (U+202F)** antes de «PM», que rompe cualquier ruta escrita a mano, y la carpeta **no está en Git**, así que estas capturas viven solo en tu máquina.

### 0.3 · Legibilidad: se leen perfectamente

No hay que parar: **no es la página entera en un archivo**, son capturas de pantalla completa del prototipo de Figma abierto en Chrome, tomadas sección a sección mientras se hacía scroll. Por eso se leen tan bien.

|                                   |                                                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Dimensiones**                   | 2992 × 1934 px las 23 (captura retina 2× de una pantalla de 1496 × 967)                                              |
| **Texto de cuerpo**               | **Sí**, se lee entero, incluida la letra pequeña del footer y los textos de las tarjetas de la app                   |
| **Bordes, radios y separaciones** | **Sí**, se distinguen; los radios pequeños (~8 px) se aprecian pero se miden mejor con muestreo de píxeles que a ojo |
| **Cobertura**                     | Home completo en desktop (hero → footer) y Home completo en móvil. Ninguna captura de Estudios, Empresas ni Planes   |

Además, el desktop trae una **referencia conocida**: el frame de 1920 px ocupa el ancho completo del navegador, así que `1 px de imagen = 0,6417 px del diseño`. Las medidas de la Fase 2 salen de ahí, no del ojo.

### 0.2 · Gobernanza

`.claude/RULES.md` tiene la regla 24 (línea 21) y `docs/` está versionado. Este informe y los documentos nuevos van a `docs/` siguiendo esa regla.

---

## Fase 1 — Esqueleto de rutas

### Árbol resultante

```
src/app/app.config.server.ts
src/app/app.config.ts
src/app/app.html
src/app/app.routes.server.ts
src/app/app.routes.ts
src/app/app.spec.ts
src/app/app.ts
src/app/core/constants/navigation.constants.ts
src/app/core/interfaces/navigation.interface.ts
src/app/features/empresas/empresas.html
src/app/features/empresas/empresas.routes.ts
src/app/features/empresas/empresas.ts
src/app/features/estudios/estudios.html
src/app/features/estudios/estudios.routes.ts
src/app/features/estudios/estudios.ts
src/app/features/home/home.html
src/app/features/home/home.routes.ts
src/app/features/home/home.ts
src/app/features/planes/planes.html
src/app/features/planes/planes.routes.ts
src/app/features/planes/planes.ts
src/app/layout/footer/footer.html
src/app/layout/footer/footer.ts
src/app/layout/header/header.html
src/app/layout/header/header.ts
```

`src/app/shared/` se creó pero sigue vacía, así que **Git no la registra**: aparecerá en el repositorio cuando tenga su primer archivo (la página 404, en otra tarea).

### Alias

`app.routes.ts` importa los cuatro dominios con `@features/*` y `app.ts` importa el layout con `@layout/*`; el header y el footer importan sus constantes con `@core/*`. Los tres resuelven y compilan. `@shared/*` sigue sin uso porque la carpeta está vacía.

### Verificación del prerender

```json
{
	"routes": {
		"/": {},
		"/empresas": {},
		"/estudios": {},
		"/planes": {}
	}
}
```

De una ruta a cuatro, cada una con su `index.html` en su carpeta:

```
dist/web-movia/browser/empresas/index.html
dist/web-movia/browser/estudios/index.html
dist/web-movia/browser/index.csr.html
dist/web-movia/browser/index.html
dist/web-movia/browser/planes/index.html
dist/web-movia/prerendered-routes.json
```

### Salida de la fase

```
All files pass linting.
 Test Files  1 passed (1)
      Tests  1 passed (1)
Prerendered 4 static routes.
```

**Commit:** `feat(routing): esqueleto de las cuatro páginas de la landing`

### Una desviación que conviene revisar

`RULES.md` regla 9 dice que **un dominio de una sola página vive plano**, con `loadComponent` directo. Hoy los cuatro dominios tienen exactamente una página, así que la regla pediría cuatro `loadComponent` en `app.routes.ts` y ningún `<dominio>.routes.ts`. He seguido tu instrucción (carpeta de dominio + `loadChildren`), que es lo que va a hacer falta en cuanto Planes o Estudios crezcan, pero es una desviación consciente de la regla, no un descuido.

---

## Fase 2 — Design system

El documento completo, con la tabla token a token y el nivel de confianza de cada valor, está en [`docs/decisiones/2026-09-20-design-system.md`](../decisiones/2026-09-20-design-system.md). Resumen de lo que importa:

**Lo que se añadió a `@theme`** (tipografía y espaciado, que no existían): `--text-display` 72, `--text-headline` 48, `--text-lead` 32, `--text-title` 30, `--text-body-lg` 18, los dos contenedores del diseño (`--container-content` 1416 y `--container-wide` 1580), `--spacing-section` 160, `--spacing-section-sm` 64 (estimado) y `--radius-card` 8.

**Lo que NO se tocó, y necesita tu visto bueno:**

1. **El lima y el carbón coinciden.** Muestreado y convertido de Display P3 a sRGB, el lima del diseño da `#D3F443` contra el `#d3f442` del token: es el mismo color. El carbón del footer da `#1E242B` contra `#1c242c`.
2. **El gris de las cards no coincide.** El diseño usa `#F6F6F6`, un gris neutro; `--brand-mist` es `#f4f5f8`, con tinte azulado.
3. **El lienzo de la landing es blanco.** Hoy `styles.css` pinta `body` con `bg-surface-muted` (el gris mist), que era el fondo del portal de partners. En el Home el gris solo aparece dentro de cards.
4. **Hay dos tamaños de botón** (58 px y 80 px de alto, ambos pill) y las `.btn-*` actuales no dan ninguno: salen ~44 px.

**Gilroy queda descartada:** se eliminó el comentario PENDIENTE de `styles.css`. El diseño usa una geométrica que no es ninguna de las dos familias del proyecto, y se mapea a las que ya hay: titulares a Plus Jakarta Sans, cuerpo a Inter.

**Commit:** `feat(styles): escala tipográfica, contenedores y espaciado del diseño`

---

## Fase 3 — Layout

Header y footer en `src/app/layout/`, montados en `app.html` alrededor del `<router-outlet />`. Mobile-first: en móvil el header es logo + hamburguesa, y el menú se despliega con un signal y `aria-expanded`/`aria-controls`. La ruta activa se marca con `routerLinkActive` en lima.

Los textos y los enlaces salen a constantes en `@core/constants/navigation.constants.ts` (regla 17: nada de strings mágicos repetidos), con sus interfaces en `@core/interfaces/navigation.interface.ts` (regla 21).

### 3.3 · TABLA DE ASSETS QUE FALTAN

Ninguno de estos archivos existe. El marcado los referencia por su ruta y el build los sirve rotos **a propósito**.

| Ruta en el código              | Qué es                                                                                 | Formato | Tamaño aprox. | Dónde está en el diseño                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `/imgs/logos/logo-movia.svg`   | Isotipo + «MOVIA» + tagline «belong everywhere» en dos líneas (tagline en lima y gris) | SVG     | ~220 × 40     | Header (todas las páginas) y footer. **Es el mismo archivo en los dos sitios**, a distinto alto |
| `/imgs/icons/apple.svg`        | Manzana blanca dentro de círculo oscuro, enlace a la App Store                         | SVG     | 40 × 40       | Header desktop, a la izquierda del botón «Suscribirme»                                          |
| `/imgs/icons/google-play.svg`  | Triángulo de Google Play blanco dentro de círculo oscuro                               | SVG     | 40 × 40       | Header desktop, junto al anterior                                                               |
| `/imgs/badges/app-store.svg`   | Badge oficial «Available on the App Store», pill blanco con texto e icono negros       | SVG     | ~180 × 56     | Footer, bloque derecho                                                                          |
| `/imgs/badges/google-play.svg` | Badge oficial «GET IT ON Google Play», pill blanco                                     | SVG     | ~180 × 56     | Footer, junto al anterior                                                                       |
| `/imgs/icons/facebook.svg`     | Glifo «f» de Facebook, en carbón para ir sobre el círculo lima                         | SVG     | 20 × 20       | Footer, primera red social                                                                      |
| `/imgs/icons/instagram.svg`    | Glifo de Instagram (cámara), en carbón                                                 | SVG     | 20 × 20       | Footer, segunda red                                                                             |
| `/imgs/icons/linkedin.svg`     | Glifo «in» de LinkedIn, en carbón                                                      | SVG     | 20 × 20       | Footer, tercera red                                                                             |

Notas para cuando los pongas:

- **Los círculos lima de las redes los pinta el CSS** (`bg-primary` + `rounded-full`), así que los tres iconos deben venir **sin fondo**, solo el glifo, y en un color oscuro.
- **Los badges de tienda son los oficiales de Apple y Google** y tienen sus propias guías de marca; no son un icono cualquiera que se pueda redibujar.
- El logo aparece **dos veces con el mismo archivo**; si el tagline necesita otro tratamiento en el footer, harían falta dos SVG y lo cambio.
- Ya existe `public/imgs/logos/isotipo-green.svg` de la copia del portal: **no lo he usado**, porque es solo el isotipo y el diseño lleva isotipo + wordmark + tagline.

### 3.1 · Las dos incoherencias, señaladas y sin resolver

**(a) Los labels no coinciden con las rutas, y el header no coincide con el footer.**

| Label en el diseño | Dónde           | `routerLink` que le he puesto |
| ------------------ | --------------- | ----------------------------- |
| «Partners»         | Header y footer | `/estudios`                   |
| «Empresa»          | **Header**      | `/empresas`                   |
| «Empresas»         | **Footer**      | `/empresas`                   |
| «Para ti»          | Header y footer | `/planes`                     |

O sea: el mismo destino se llama **«Empresa» en el header y «Empresas» en el footer**. He respetado el diseño al pie de la letra en los dos sitios, así que la web hoy reproduce la contradicción. **No he elegido por ti**: decide cuál es el bueno y lo unifico en `navigation.constants.ts`, que es un solo archivo.

Aparte, «Partners» apuntando a `/estudios` y «Para ti» a `/planes` es una decisión tuya ya tomada; lo dejo escrito porque al leer el código sorprende.

**(b) Tres páginas legales que no existen.** «Términos & Condiciones», «Políticas de Privacidad» y «Preguntas» no están ni en el diseño ni en el routing. Sus enlaces se quedan con `href="#"` y sus labels viven en `FOOTER_LEGAL_NAV`, separados de los que sí tienen ruta, para que se vea de un vistazo lo que falta. **Faltan por decidir**: si son páginas propias (`/terminos`, `/privacidad`, `/preguntas`), si «Preguntas» es en realidad un ancla a la FAQ del Home, y quién escribe los textos legales.

### 3.4 · Verificación

```
All files pass linting.
 Test Files  1 passed (1)
      Tests  1 passed (1)
Prerendered 4 static routes.
```

Las cuatro rutas siguen prerenderizándose:

```json
{
	"routes": {
		"/": {},
		"/empresas": {},
		"/estudios": {},
		"/planes": {}
	}
}
```

Y el `index.html` de `/planes` ya trae el header y el footer dentro del `<app-root>`, no un hueco vacío (recortado el CSS crítico en línea):

```html
<body>
	<!--nghm-->
	<script type="text/javascript" id="ng-event-dispatch-contract">
		(() => {
			function p(t, n, r, o, e, i, f, m) {
				return { eventType: t, event: n, targetElement: r, eic: o, timeStamp: e, eia: i, eirp: f, eiack: m };
			}
			function u(t) {
				let n = [],
					r = (e) => {
						n.push(e);
					};
				return {
					c: t,
					q: n,
					et: [],
					etc: [],
					d: r,
					h: (e) => {
						r(p(e.type, e, e.target, t, Date.now()));
					}
				};
			}
			function s(t, n, r) {
				for (let o = 0; o < n.length; o++) {
					let e = n[o];
					((r ? t.etc : t.et).push(e), t.c.addEventListener(e, t.h, r));
				}
			}
			function c(t, n, r, o, e = window) {
				let i = u(t);
				(e._ejsas || (e._ejsas = {}), (e._ejsas[n] = i), s(i, r), s(i, o, !0));
			}
			window.__jsaction_bootstrap = c;
		})();
	</script>
	<script>
		window.__jsaction_bootstrap(document.body, 'ng', ['click'], []);
	</script>
	<app-root ng-version="22.1.7" ngh="3" ng-server-context="ssg"
		><app-header ngh="0"
			><header class="bg-secondary text-secondary-contrast">
				<div class="max-w-wide mx-auto flex items-center justify-between gap-6 px-6 py-5 lg:px-10">
					<a routerlink="/" aria-label="Movía, ir al inicio" href="/" jsaction="click:;"
						><img src="/imgs/logos/logo-movia.svg" alt="Movía · belong everywhere" width="220" height="40" class="h-8 w-auto lg:h-10"
					/></a>
					<nav aria-label="Navegación principal" class="hidden lg:block">
						<ul class="flex items-center gap-10">
							<li>
								<a
									routerlinkactive="text-primary"
									class="text-body-lg hover:text-primary transition-colors"
									href="/estudios"
									jsaction="click:;"
									>Partners</a
								>
							</li>
							<li>
								<a
									routerlinkactive="text-primary"
									class="text-body-lg hover:text-primary transition-colors"
									href="/empresas"
									jsaction="click:;"
									>Empresa</a
								>
							</li>
							<li>
								<a
									routerlinkactive="text-primary"
									class="text-body-lg hover:text-primary text-primary transition-colors"
									href="/planes"
									jsaction="click:;"
									>Para ti</a
								>
							</li>
							<!---->
						</ul>
					</nav>
					<div class="hidden items-center gap-4 lg:flex">
						<a href="#" aria-label="Descargar Movía en el App Store"
							><img src="/imgs/icons/apple.svg" alt width="40" height="40" class="h-10 w-10" /></a
						><a href="#" aria-label="Descargar Movía en Google Play"
							><img src="/imgs/icons/google-play.svg" alt width="40" height="40" class="h-10 w-10" /></a
						><a
							href="#"
							class="bg-primary text-primary-contrast text-body-lg rounded-full px-7 py-3 font-medium transition-opacity hover:opacity-90"
						>
							Suscribirme
						</a>
					</div>
					<button
						type="button"
						aria-controls="header-mobile-menu"
						aria-label="Abrir el menú"
						class="focus-visible:ring-primary rounded-lg p-2 focus-visible:ring-2 focus-visible:outline-none lg:hidden"
						aria-expanded="false"
						jsaction="click:;"
					>
						<span class="bg-secondary-contrast block h-0.5 w-7"></span><span class="bg-secondary-contrast mt-1.5 block h-0.5 w-7"></span
						><span class="bg-secondary-contrast mt-1.5 block h-0.5 w-7"></span>
					</button>
				</div>
				<!---->
			</header></app-header
		>
		<main>
			<router-outlet></router-outlet><app-planes ngh="1"><h1>Planes</h1></app-planes><!---->
		</main>
		<app-footer ngh="2"
			><footer class="bg-secondary text-secondary-contrast">
				<div class="max-w-wide mx-auto px-6 py-16 lg:px-10 lg:py-32">
					<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
						<div class="lg:max-w-xl">
							<img
								src="/imgs/logos/logo-movia.svg"
								alt="Movía · belong everywhere"
								width="220"
								height="40"
								class="h-9 w-auto lg:h-11"
							/>
							<p class="text-body-lg mt-8 lg:mt-10">
								Disponible en todo el Ecuador. Conectando personas, clubes y experiencias deportivas desde una sola aplicación.
							</p>
						</div>
						<div class="flex flex-col gap-8 lg:items-end">
							<div class="flex items-center gap-5">
								<a href="#" aria-label="Descargar Movía en el App Store"
									><img src="/imgs/badges/app-store.svg" alt width="180" height="56" class="h-12 w-auto lg:h-14" /></a
								><a href="#" aria-label="Descargar Movía en Google Play"
									><img src="/imgs/badges/google-play.svg" alt width="180" height="56" class="h-12 w-auto lg:h-14"
								/></a>
							</div>
							<div class="flex items-center justify-between gap-8 lg:flex-col lg:items-end">
								<a class="text-body-lg hover:text-primary transition-colors" href="mailto:soporte@moviapass.com"
									>soporte@moviapass.com</a
								>
								<ul class="flex items-center gap-4">
									<li>
										<a
											href="#"
											aria-label="Movía en Facebook"
											class="bg-primary flex size-11 items-center justify-center rounded-full"
											><img src="/imgs/icons/facebook.svg" alt width="20" height="20" class="size-5"
										/></a>
									</li>
									<li>
										<a
											href="#"
											aria-label="Movía en Instagram"
											class="bg-primary flex size-11 items-center justify-center rounded-full"
											><img src="/imgs/icons/instagram.svg" alt width="20" height="20" class="size-5"
										/></a>
									</li>
									<li>
										<a
											href="#"
											aria-label="Movía en LinkedIn"
											class="bg-primary flex size-11 items-center justify-center rounded-full"
											><img src="/imgs/icons/linkedin.svg" alt width="20" height="20" class="size-5"
										/></a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<hr class="border-secondary-tint mt-12 lg:mt-24" />
					<div class="mt-10 flex justify-between gap-8 lg:mt-16">
						<ul class="flex flex-col gap-6 lg:flex-row lg:gap-12">
							<li><a class="text-body-lg hover:text-primary transition-colors" href="/planes" jsaction="click:;">Para ti</a></li>
							<li><a class="text-body-lg hover:text-primary transition-colors" href="/estudios" jsaction="click:;">Partners</a></li>
							<li><a class="text-body-lg hover:text-primary transition-colors" href="/empresas" jsaction="click:;">Empresas</a></li>
							<!---->
						</ul>
						<ul class="flex flex-col gap-6 text-right lg:flex-row lg:gap-12">
							<li><a href="#" class="text-body-lg hover:text-primary transition-colors">Términos &amp; Condiciones</a></li>
							<li><a href="#" class="text-body-lg hover:text-primary transition-colors">Políticas de Privacidad</a></li>
							<li><a href="#" class="text-body-lg hover:text-primary transition-colors">Preguntas</a></li>
							<!---->
						</ul>
					</div>
					<p class="text-muted mt-12 text-center lg:mt-16">© 2026 movia · Todos los derechos reservados</p>
				</div>
			</footer></app-footer
		></app-root
	>
	<script src="main-KSEF45DR.js" type="module"></script>
	<link rel="modulepreload" href="chunk-C3NfHnsM.js" />
	<link rel="modulepreload" href="chunk-3j0G_O4o.js" />
</body>
```

Fíjate en dos cosas de ese HTML: el enlace «Para ti» sale con la clase `text-primary` ya aplicada —`routerLinkActive` se resuelve **en el prerender**, no en el cliente—, y arriba aparece el `ng-event-dispatch-contract`, que es el `withEventReplay()` de la tarea anterior haciendo su trabajo.

**Las rutas de imagen rotas son lo esperado.** El navegador pinta el icono de imagen rota en los ocho `<img>` de la tabla de arriba.

**Commit:** `feat(layout): header y footer de la landing`

---

## Comprobación en el navegador

Además del build, abrí la app en el navegador (`npm start`) y la recorrí:

- **Desktop 1440 px**: header con la nav a la izquierda del bloque de acciones, «Para ti» en lima al estar en `/planes`, footer con las dos filas de enlaces y el copyright.
- **Móvil 375 px**: el header se reduce a logo + hamburguesa, y al pulsarla se despliegan los tres enlaces y el botón «Suscribirme» a ancho completo. Al navegar, el menú se cierra solo.
- La consola solo muestra el `InvalidStateError: Transition was aborted` de `withViewTransitions()`, que ya está documentado: lo provoca el panel del navegador cuando está oculto (`document.visibilityState === 'hidden'`), no el código.

---

## Qué quedó sin derivar por faltar las otras tres páginas

- **Inputs y formularios** (viven en Estudios y Empresas): alto, radio, borde, foco, error, label y texto de ayuda. Las clases `.field-label` y `.field-input` que hay en `styles.css` vienen del portal de partners y casi seguro no valen.
- **Cards de precio** (viven en Planes): estructura, jerarquía y tratamiento del plan destacado.
- **Estados** hover/focus/disabled de botones y enlaces: el prototipo es estático y no los enseña.
- **Escala tipográfica de móvil**: el frame mide ~440 px (confirmado porque la captura es 2× exacto), pero medir texto sobre 440 px acumula demasiado error — el H1 sale entre 44 y 54 px según el recorte. Con capturas por secciones del móvil se cierra en cinco minutos.
- **Color de texto secundario**: no hay en el Home un párrafo gris lo bastante grande para muestrearlo sin antialiasing.

---

## Cosas que me llamaron la atención

1. **El diseño tiene una errata.** El footer dice «Conectando personas, **slubes** y experiencias deportivas». En el código he escrito «clubes», que es lo que pone tu encargo y lo que tiene sentido. Convendría corregirlo también en Figma antes de que se copie a otro sitio.
2. **El email no es del dominio de la web.** El footer dice `soporte@moviapass.com` y la landing va en `moviapass.com`. Puede estar bien (dominio corporativo distinto del comercial), pero como el dominio se acaba de confirmar, lo señalo: si el correo bueno es `info@moviapass.com`, se cambia en una constante.
3. **El header del diseño va SOBRE el hero, no encima de él.** En las capturas el header es transparente y deja ver la foto del hero por debajo. Como todavía no hay páginas, lo he montado con fondo carbón sólido, que es lo que se ve hoy. Cuando se maquete el Home habrá que decidir si pasa a `absolute` + transparente, y entonces cada página tendrá que saber si su primera sección es oscura.
4. **Hay dos contenedores distintos**, 1416 px para el contenido y 1580 px para header y footer. Lo comprobé en varias secciones y siempre da lo mismo, así que no es ruido de la captura.
5. **Las capturas no están versionadas.** `docs/disenos/` son 23 archivos y ~97 MB; meterlos en Git tal cual engorda el repositorio para siempre. Si quieres conservarlos, mejor exportaciones más pequeñas o un enlace al Figma; dime qué prefieres y lo dejo montado.
6. **El logo del portal viejo sigue en `public/imgs/logos/isotipo-green.svg`.** No lo usa nadie desde que se vació el proyecto. Si el logo nuevo va a ocupar su sitio, ese archivo sobra.

---

## Confirmaciones

- **NO he creado ninguna imagen.** Ni SVG del logo, ni iconos, ni badges, ni placeholders remotos, ni data-URIs, ni `<img>` comentados. Los ocho assets de la tabla se referencian por ruta y no existen en disco.
- **NO he hecho push.** ## main...origin/main [ahead 9] — `origin/main` sigue en `ece4cb7`, y los commits de esta tarea (y de las anteriores) viven solo en local.
