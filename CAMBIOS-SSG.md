# CAMBIOS-SSG.md

Paso de `web-movia` de SPA client-side a **prerender / SSG puro** (`outputMode: "static"`), sin servidor Node.

> **Lee primero «Desviaciones»**: dos pasos del encargo, tal y como estaban escritos, dejaban el proyecto SIN prerender. Están documentados con la prueba que lo demuestra.

---

## 1. Desviaciones respecto al encargo

### 1.1 `src/main.server.ts` y la clave `server` NO se pueden borrar (pasos 2 y 3)

El encargo decía que con `outputMode: "static"` las claves `server` y `ssr` son no-ops y que había que borrar `server.ts` **y** `src/main.server.ts`. La primera mitad es cierta; la segunda no:

- **`ssr.entry` (`src/server.ts`) sí sobra**: es el servidor Express en runtime. Borrado.
- **`server` (`src/main.server.ts`) hace falta**: es el bootstrap que el CLI usa **en tiempo de build** para renderizar cada ruta a HTML. Sin esa clave no hay nada con lo que prerenderizar, y el build **no falla**: genera en silencio un `index.html` de SPA normal.

Prueba, con el mismo código y solo esa diferencia:

| Configuración                                                | Salida del build                                    | `prerendered-routes.json`   | `index.html`                                                      |
| ------------------------------------------------------------ | --------------------------------------------------- | --------------------------- | ----------------------------------------------------------------- |
| `outputMode: static`, **sin** `server`                       | «Application bundle generation complete» y nada más | `{ "routes": {} }`          | `<app-root></app-root>` pelado                                    |
| `outputMode: static`, **con** `server: "src/main.server.ts"` | **«Prerendered 1 static route.»**                   | `{ "routes": { "/": {} } }` | `<app-root ng-version="22.0.6" ngh="0" ng-server-context="ssg">…` |

Como el objetivo declarado es «`npm run build:prod` generando HTML pre-renderizado por ruta» y «sin servidor Node», me he quedado con la combinación que cumple las dos cosas: **`server` sí, `ssr` no**. El resultado no despliega Node: el `dist` no tiene ni carpeta `server/` ni un solo `.mjs`.

### 1.2 `ng add @angular/ssr` no se pudo ejecutar con los defaults (paso 1)

`npx ng add @angular/ssr` falla con `ERESOLVE`: instala `@angular/ssr@22.1.8`, que arrastra `@angular/router@22.1.7`, y ese router fija por peer `@angular/core@22.1.7` exacto, mientras el proyecto tiene todo el árbol en **22.0.6**. Mezclar minors de Angular es imposible: se peer-fijan entre ellos.

Probé cuatro caminos antes de elegir (todos con `--dry-run`):

| Intento                            | Resultado                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `ng add @angular/ssr` (defaults)   | ERESOLVE: core 22.0.6 vs 22.1.7                                                                               |
| `ng add @angular/ssr@22.0.6`       | Mismo ERESOLVE: npm re-resuelve `router` a 22.1.7                                                             |
| `--legacy-peer-deps`               | **Descartado**: además de instalar, _eliminaba_ `@angular/cdk` (que necesita `@angular/aria`) y `@types/node` |
| Re-resolver runtime + dev a la vez | ERESOLVE en cascada (`compiler` 22.0.6 vs `compiler-cli` 22.1.7)                                              |

**Lo que hice**: instalar `@angular/ssr` y `@angular/platform-server` **fijados a 22.0.6**, la versión exacta del resto del árbol, junto con los paquetes de runtime de Angular:

```bash
npm install @angular/core@22.0.6 @angular/common@22.0.6 @angular/router@22.0.6 \
            @angular/forms@22.0.6 @angular/platform-browser@22.0.6 @angular/compiler@22.0.6 \
            @angular/ssr@22.0.6 @angular/platform-server@22.0.6
```

Resolvió limpio (137 paquetes añadidos, **ninguno eliminado**, ninguna versión de Angular movida). Después, `npx ng add @angular/ssr@22.0.6 --skip-confirmation` detectó el paquete ya instalado (`Skipping installation: Package already installed`) y ejecutó el schematic con los defaults, que es lo que pedía el paso 1.

**Efecto colateral en `package.json`**: npm reescribió los rangos de los seis paquetes de runtime de `^22.0.0` a `^22.0.6`. Es un cambio real y está en el diff. Lo dejé así a propósito: refleja lo que hay instalado y evita que un `npm install` futuro vuelva a intentar saltar a 22.1.x y a romper por el mismo motivo. **Si prefieres los rangos anchos (`^22.0.0`), se revierten a mano y el lock sigue siendo válido** — pero entonces el conflicto vuelve en cuanto alguien instale algo nuevo.

### 1.3 Otras dos decisiones pequeñas

- **Borré el script `serve:ssr:web-movia`** que añadió el schematic (`node dist/web-movia/server/server.mjs`). No estaba en tu lista, pero apunta a un archivo que ya no se genera: dejarlo es un comando roto en `package.json`.
- **NO borré `security.allowedHosts`**, que el schematic también inyectó en `architect.build.options`. No estaba en tu lista de claves a quitar (`server`, `ssr`, `prerender`, `appShell`) y no molesta, así que lo dejé. Si quieres el `angular.json` al mínimo, es una línea más a quitar.

---

## 2. Qué hizo `ng add @angular/ssr` (paso 1, literal)

```
Skipping installation: Package already installed
CREATE src/main.server.ts (292 bytes)
CREATE src/app/app.config.server.ts (426 bytes)
CREATE src/app/app.routes.server.ts (166 bytes)
CREATE src/server.ts (1609 bytes)
UPDATE angular.json (2408 bytes)
UPDATE tsconfig.app.json (447 bytes)
UPDATE package.json (1982 bytes)
UPDATE src/app/app.config.ts (585 bytes)
- Installing packages (npm)...
✔ Packages installed successfully.
```

En `angular.json` inyectó, dentro de `architect.build.options`:

```json
"server": "src/main.server.ts",
"outputMode": "server",
"security": { "allowedHosts": [] },
"ssr": { "entry": "src/server.ts" }
```

En `package.json` añadió `express@^5.1.0` a `dependencies`, `@types/express@^5.0.1` y `@types/node@^20.17.19` a `devDependencies`, y el script `serve:ssr:web-movia`. En `tsconfig.app.json` cambió `"types": []` por `"types": ["node"]` (y reformateó el archivo a tabs). En `app.config.ts` añadió `provideClientHydration()`.

---

## 3. Diff de `angular.json` (antes → después)

```diff
--- angular.json (antes)
+++ angular.json (después)
@@ -26,7 +26,12 @@
 								"input": "public"
 							}
 						],
-						"styles": ["src/styles.css"]
+						"styles": ["src/styles.css"],
+						"outputMode": "static",
+						"security": {
+							"allowedHosts": []
+						},
+						"server": "src/main.server.ts"
 					},
 					"configurations": {
 						"production": {
```

Neto: `outputMode: "static"`, se conserva `server`, **no** hay `ssr`, **no** hay `prerender`, **no** hay `appShell` y **no** hay target `server` en `architect` (los targets siguen siendo `build`, `serve`, `test`, `lint`).

## 4. Diff de `package.json` (antes → después)

```diff
--- package.json (antes)
+++ package.json (después)
@@ -29,12 +29,14 @@
 	},
 	"dependencies": {
 		"@angular/aria": "^22.0.4",
-		"@angular/common": "^22.0.0",
-		"@angular/compiler": "^22.0.0",
-		"@angular/core": "^22.0.0",
-		"@angular/forms": "^22.0.0",
-		"@angular/platform-browser": "^22.0.0",
-		"@angular/router": "^22.0.0",
+		"@angular/common": "^22.0.6",
+		"@angular/compiler": "^22.0.6",
+		"@angular/core": "^22.0.6",
+		"@angular/forms": "^22.0.6",
+		"@angular/platform-browser": "^22.0.6",
+		"@angular/platform-server": "^22.0.6",
+		"@angular/router": "^22.0.6",
+		"@angular/ssr": "^22.0.6",
 		"@ng-icons/core": "^34.0.0",
 		"@ng-icons/heroicons": "^34.0.0",
 		"rxjs": "~7.8.0",
@@ -48,6 +50,7 @@
 		"@commitlint/config-conventional": "^21.2.0",
 		"@eslint/js": "^10.0.1",
 		"@tailwindcss/postcss": "^4.1.12",
+		"@types/node": "^20.17.19",
 		"angular-eslint": "22.1.0",
 		"eslint": "^10.6.0",
 		"eslint-config-prettier": "^10.1.8",
```

`express` y `@types/express` se instalaron con el schematic y se desinstalaron después (`npm uninstall express @types/express`), por eso no aparecen en el diff final. `@types/node` sí se queda: `tsconfig.app.json` declara ahora `"types": ["node"]`.

## 5. Diff de `src/app/app.config.ts`

```diff
--- src/app/app.config.ts (antes)
+++ src/app/app.config.ts (después)
@@ -1,4 +1,5 @@
 import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
+import { provideClientHydration } from '@angular/platform-browser';
 import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

 import { routes } from './app.routes';
@@ -6,6 +7,7 @@
 export const appConfig: ApplicationConfig = {
 	providers: [
 		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
-		provideBrowserGlobalErrorListeners()
+		provideBrowserGlobalErrorListeners(),
+		provideClientHydration()
 	]
 };
```

## 6. Diff de `tsconfig.app.json`

```diff
--- tsconfig.app.json (antes)
+++ tsconfig.app.json (después)
@@ -1,15 +1,11 @@
 /* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
 /* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
 {
-  "extends": "./tsconfig.json",
-  "compilerOptions": {
-    "outDir": "./out-tsc/app",
-    "types": []
-  },
-  "include": [
-    "src/**/*.ts"
-  ],
-  "exclude": [
-    "src/**/*.spec.ts"
-  ]
+	"extends": "./tsconfig.json",
+	"compilerOptions": {
+		"outDir": "./out-tsc/app",
+		"types": ["node"]
+	},
+	"include": ["src/**/*.ts"],
+	"exclude": ["src/**/*.spec.ts"]
 }
```

El reformateo a tabs lo hizo el schematic, no yo; coincide con `.prettierrc`.

---

## 7. Archivos creados, borrados y modificados

### Creados (y conservados)

| Archivo                        | Qué es                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.server.ts`           | Bootstrap de build para el prerender. **Modificado por mí**: tipo de retorno explícito (lo exige ESLint) y JSDoc                |
| `src/app/app.config.server.ts` | Config de servidor: `provideServerRendering(withRoutes(serverRoutes))`, mergeada con `appConfig`. Tal cual lo dejó el schematic |
| `src/app/app.routes.server.ts` | Modos de render. **Modificado por mí**: JSDoc (paso 4)                                                                          |
| `CAMBIOS-SSG.md`               | Este informe                                                                                                                    |

### Creados y borrados

| Archivo         | Motivo                                                 |
| --------------- | ------------------------------------------------------ |
| `src/server.ts` | Servidor Express en runtime. No hay Node en producción |

### Modificados

| Archivo                 | Cambio                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `angular.json`          | `outputMode: "static"`, `server` conservado, `ssr` eliminado                                                               |
| `package.json`          | +`@angular/ssr`, +`@angular/platform-server`, +`@types/node`; rangos de Angular a `^22.0.6`; −script `serve:ssr:web-movia` |
| `package-lock.json`     | Regenerado por las instalaciones                                                                                           |
| `src/app/app.config.ts` | +`provideClientHydration()` (schematic) y el import agrupado con los de `@angular/*`                                       |
| `tsconfig.app.json`     | `"types": ["node"]` (schematic)                                                                                            |

### No tocados (como pedías)

`src/environments/*`, `.gitignore`, `.editorconfig`, `.prettierrc`, los umbrales de coverage, `src/app/app.routes.ts` (sigue vacío), `src/index.html`, `src/styles.css`, `.claude/*`. No se creó ninguna ruta, componente, página, `robots.txt`, `sitemap.xml`, meta tag ni `SeoService`. No se ha hecho `git push` ni commit.

---

## 8. `src/app/app.routes.server.ts` final (paso 4)

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Render mode of every route. The whole landing is SSG: `outputMode: 'static'` in
 * `angular.json` means the build prerenders each route to its own HTML file and no
 * Node server is deployed.
 *
 * The catch-all keeps that true for routes added later: a new page inherits
 * `Prerender` unless it declares its own entry above this one. A route whose
 * content cannot be known at build time (one that depends on the request) has no
 * place here while there is no server to render it.
 */
export const serverRoutes: ServerRoute[] = [
	{
		path: '**',
		renderMode: RenderMode.Prerender
	}
];
```

## 9. Hidratación (paso 6)

**El schematic la añadió él solo**, y lo hizo **sin `withEventReplay()`**: la línea que escribió es `provideClientHydration()` a secas. Siguiendo tu instrucción («si lo añadió, déjalo»), la he dejado exactamente así.

Nota para revisar: `withEventReplay()` reproduce los clics que ocurren antes de que hidrate el JS. En una landing con botones y formularios suele merecer la pena, pero añadirlo no entraba en el alcance de esta tarea.

## 10. Zoneless (paso 5)

Intacto, nada que revertir:

- `zone.js` **no** aparece en `package.json` y **no** está en `node_modules`.
- `angular.json` **no** tiene la clave `polyfills`.
- En `src/` no aparece ni `provideZonelessChangeDetection()` ni `provideZoneChangeDetection()`: sigue siendo el zoneless por defecto de Angular 22.

## 11. Providers browser-only (paso 7)

**No rompió ninguno.** `provideBrowserGlobalErrorListeners()` y `withViewTransitions()` conviven con el prerender sin tocar nada: el build prerenderiza sin errores ni warnings, y `npm run lint` y `npm run test` siguen en verde. **No he modificado `app.config.ts` por este motivo** (el único cambio ahí es el `provideClientHydration()` del schematic).

El motivo por el que no rompen: Angular no ejecuta esas APIs durante el render en Node — `withViewTransitions()` comprueba que `document.startViewTransition` exista antes de usarlo, y los listeners globales se registran sobre el documento del servidor, que es sintético. Aun así, esto **hay que volver a mirarlo cuando haya pantallas de verdad**: el riesgo de las APIs de navegador no está en los providers, sino en el código de los componentes (`window`, `document`, `localStorage` en un `constructor` o un `ngOnInit`), que hoy no existe.

---

## 12. Verificación (paso 8, salida literal)

```
$ npm run lint

> web-movia@0.0.0 lint
> ng lint


Linting "web-movia"...

All files pass linting.


$ npm run test

> web-movia@0.0.0 test
> ng test

❯ Building...
✔ Building...
Application bundle generation complete. [0.911 seconds] - 2026-09-20T22:10:14.244Z


 RUN  v4.1.10 /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:10:14
   Duration  693ms (transform 42ms, setup 192ms, import 32ms, tests 24ms, environment 343ms)


$ npm run build:prod

> web-movia@0.0.0 build:prod
> ng build --configuration production

❯ Building...
✔ Building...
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-IPEVJD3M.js    | main          | 232.84 kB |                64.71 kB
styles-F3C4QETT.css | styles        |   9.77 kB |                 2.18 kB

                    | Initial total | 242.61 kB |                66.89 kB

Prerendered 1 static route.
Application bundle generation complete. [2.497 seconds] - 2026-09-20T22:10:18.147Z

Output location: /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia/dist/web-movia
```

> En la primera pasada el lint **falló**: `src/main.server.ts:5:47 error Missing return type on function @typescript-eslint/explicit-function-return-type`. Es el archivo tal y como lo genera el schematic, que escribe `const bootstrap = (context: BootstrapContext) => bootstrapApplication(...)` sin anotar el retorno. Lo arreglé en el código (`: Promise<ApplicationRef>` + el import de `ApplicationRef`), no con un `eslint-disable` (RULES #2), y volví a ejecutar los tres comandos desde el principio. La salida de arriba es la de la pasada final.

## 13. Salida del build (paso 9)

### Estructura de `dist/`

```
dist/web-movia/3rdpartylicenses.txt
dist/web-movia/browser/favicon.png
dist/web-movia/browser/imgs/logos/isotipo-green.svg
dist/web-movia/browser/index.csr.html
dist/web-movia/browser/index.html
dist/web-movia/browser/main-IPEVJD3M.js
dist/web-movia/browser/manifest.webmanifest
dist/web-movia/browser/styles-F3C4QETT.css
dist/web-movia/prerendered-routes.json
```

- ✅ **Existe `dist/web-movia/browser/index.html`.**
- ✅ **NO existe `dist/web-movia/server/`**: confirmado, no existe.
- ✅ **Cero archivos `.mjs`** en todo `dist/` (contados: 0).
- `index.csr.html` es el shell de client-side rendering que el builder emite siempre como fallback; no es un artefacto de servidor.
- `prerendered-routes.json`:

```json
{
	"routes": {
		"/": {}
	}
}
```

### `dist/web-movia/browser/index.html` (prerenderizado)

Pegado íntegro salvo los dos bloques `<style>` que el builder inserta en línea (CSS crítico y `@font-face` de Google Fonts, ~30 KB), recortados para que el informe se pueda leer:

```html
<!DOCTYPE html>
<html lang="es" data-beasties-container>
	<head>
		<meta charset="utf-8" />
		<title>Movía</title>
		<base href="/" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!--
			Solo claro, igual que en app-movia y por lo mismo: es lo único que hay diseñado. Con
			"light dark" el navegador en modo oscuro pinta el fondo negro y los neutros del tema
			quedan ilegibles encima.
		-->
		<meta name="color-scheme" content="light" />
		<meta name="theme-color" content="#1C242C" />

		<link rel="icon" type="image/png" href="favicon.png" />
		<link rel="manifest" href="manifest.webmanifest" />

		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<style>
			[… 14700 caracteres de Google Fonts en línea (beasties), recortados en este informe …]
		</style>
		<style>
			[… 3807 caracteres de CSS crítico de Tailwind en línea (beasties), recortados en este informe …]
		</style>
		<link rel="stylesheet" href="styles-F3C4QETT.css" media="print" onload="this.media='all'" />
		<noscript><link rel="stylesheet" href="styles-F3C4QETT.css" /></noscript>
	</head>
	<body>
		<!--nghm-->
		<app-root ng-version="22.0.6" ngh="0" ng-server-context="ssg"><router-outlet></router-outlet><!----></app-root>
		<script src="main-IPEVJD3M.js" type="module"></script>

		<script id="ng-state" type="application/json">
			{ "__nghData__": [{ "c": { "0": [] } }] }
		</script>
	</body>
</html>
```

**Lo que demuestra que está prerenderizado** (y que antes de este cambio no estaba): `<!--nghm-->`, los atributos `ng-version="22.0.6"`, `ngh="0"` y **`ng-server-context="ssg"`** en `<app-root>`, y el `<script id="ng-state">` con los datos de hidratación. Un build de SPA normal emite `<app-root></app-root>` a secas, sin nada de esto.

### Aviso importante: el `<app-root>` está prerenderizado pero VACÍO

El `<app-root>` ya no es el placeholder inerte de antes, pero **tampoco contiene contenido visible**: solo `<router-outlet></router-outlet>`. El motivo no es la configuración, es que **`app.routes.ts` sigue vacío y la app no tiene ni una página**. No hay nada que renderizar.

Crear una ruta o un componente estaba explícitamente fuera de alcance, así que para demostrar que el prerender **sí escribe el HTML real** monté una comprobación temporal: una ruta `''` con un componente de una línea, build, y después borrado y rebuild. Este fue el `<body>` de aquel build:

```html
<body><!--nghm-->
		<app-root ng-version="22.0.6" ngh="1" ng-server-context="ssg"><router-outlet></router-outlet><app-tmp-prerender-check ngh="0"><h1>Prerender de prueba</h1></app-tmp-prerender-check><!----></app-root>
	<link rel="modulepreload" href="chunk-IOWNUNUA.js"><script src="main-XBY3S3HS.js" type="module"></script>
<link rel="modulepreload" href="chunk-6TR5DTUF.js">


<script id="ng-state" type="application/json">{"__nghData__":[{},{"c":{"0":[{"i":"c3341684149","r":1}]}}]}</script></body></html>
```

Ahí se ve el `<h1>Prerender de prueba</h1>` dentro del `<app-root>`: el mecanismo funciona. **Los archivos de esa prueba ya no existen** (`src/app/tmp-prerender-check/` borrado, `app.routes.ts` restaurado a su estado vacío, `dist/` regenerado); el `git status` final no los incluye.

---

## 14. Qué rompió y cómo se resolvió

| #   | Qué rompió                                                   | Error literal                                                                                                       | Solución                                                                                                                                 |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `ng add @angular/ssr` con defaults                           | `npm error code ERESOLVE` … `Conflicting peer dependency: @angular/core@22.1.7`                                     | Instalar `@angular/ssr` y `@angular/platform-server` fijados a `22.0.6` y luego correr el schematic sobre el paquete ya instalado (§1.2) |
| 2   | El prerender, tras quitar `server` y borrar `main.server.ts` | Ningún error: el build pasaba en verde y emitía `{"routes": {}}` y un `index.html` de SPA                           | Restaurar `src/main.server.ts` y la clave `server` en `angular.json`, dejando fuera `ssr` (§1.1)                                         |
| 3   | `npm run lint` sobre el archivo generado                     | `src/main.server.ts:5:47  error  Missing return type on function  @typescript-eslint/explicit-function-return-type` | Anotar `: Promise<ApplicationRef>` e importar el tipo (§12)                                                                              |

## 15. Decisiones que conviene revisar

1. **Rangos de `package.json` en `^22.0.6`** en vez de `^22.0.0` para los seis paquetes de runtime de Angular (§1.2). Es la consecuencia de fijar la versión al instalar; revertible a mano.
2. **`security.allowedHosts: []` sigue en `angular.json`** (§1.3). Lo metió el schematic, no estaba en tu lista de claves a quitar.
3. **`@types/node` + `"types": ["node"]` en `tsconfig.app.json`**. Los dejó el schematic y ya no hay ningún archivo de `src/` que use APIs de Node (`server.ts` está borrado). Se pueden quitar los dos a la vez, pero no lo he hecho porque no estaba en el alcance.
4. **`provideClientHydration()` sin `withEventReplay()`** (§9).
5. **`ESTADO-PROYECTO.md` ha quedado desactualizado** con este cambio: su §3 dice que `outputMode`, `ssr`, `server` y `prerender` no existen, y su §4 que no hay archivos de servidor. Ambas cosas eran ciertas cuando se escribió y ya no lo son.
6. **El `dist/` de verdad no se puede juzgar hasta que haya páginas.** Hoy el prerender produce una ruta (`/`) sin contenido. Lo que confirmará que la migración cumple su objetivo real —SEO— es ver el HTML de la primera pantalla maquetada.
7. **Falta decidir el hosting**: el `dist/web-movia/browser/` es estático puro y vale para Netlify, Vercel estático, S3+CloudFront, GitHub Pages o Firebase Hosting. Con rutas hijas habrá que configurar el fallback a `index.html` de cada `index.html` prerenderizado (cada ruta genera el suyo), y `base href="/"` asume dominio raíz: si el sitio colgase de un subdirectorio, hay que cambiarlo.
