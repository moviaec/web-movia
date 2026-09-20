# ESTADO-PROYECTO.md

> **DOCUMENTO SUPERADO.** Refleja el estado previo a la migración SSG.
> Sus secciones §3 y §4 ya no son ciertas: hoy el proyecto tiene
> `outputMode: "static"` y archivos de servidor. Se conserva como
> registro del punto de partida.

Diagnóstico de solo lectura de `web-movia` (Angular 22 + Tailwind CSS 4).
Generado sin instalar, generar ni modificar nada: solo lectura de archivos y comandos informativos (`node -v`, `npm -v`, `ng version`, `git status`).

---

## 1. Entorno

**`node -v`**

```
v22.23.1
```

**`npm -v`**

```
10.9.8
```

**`ng version` (salida completa, tal cual)**

```

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI       : 22.0.6
Angular           : 22.0.6
Node.js           : 22.23.1
Package Manager   : npm 10.9.8
Operating System  : darwin arm64

┌───────────────────────────┬───────────────────┬───────────────────┐
│ Package                   │ Installed Version │ Requested Version │
├───────────────────────────┼───────────────────┼───────────────────┤
│ @angular/aria             │ 22.0.4            │ ^22.0.4           │
│ @angular/build            │ 22.0.6            │ ^22.0.3           │
│ @angular/cli              │ 22.0.6            │ ^22.0.3           │
│ @angular/common           │ 22.0.6            │ ^22.0.0           │
│ @angular/compiler         │ 22.0.6            │ ^22.0.0           │
│ @angular/compiler-cli     │ 22.0.6            │ ^22.0.0           │
│ @angular/core             │ 22.0.6            │ ^22.0.0           │
│ @angular/forms            │ 22.0.6            │ ^22.0.0           │
│ @angular/platform-browser │ 22.0.6            │ ^22.0.0           │
│ @angular/router           │ 22.0.6            │ ^22.0.0           │
│ rxjs                      │ 7.8.2             │ ~7.8.0            │
│ typescript                │ 6.0.3             │ ~6.0.2            │
│ vitest                    │ 4.1.10            │ ^4.0.8            │
└───────────────────────────┴───────────────────┴───────────────────┘
```

---

## 2. Dependencias

### `dependencies` (package.json, literal)

```json
{
	"@angular/aria": "^22.0.4",
	"@angular/common": "^22.0.0",
	"@angular/compiler": "^22.0.0",
	"@angular/core": "^22.0.0",
	"@angular/forms": "^22.0.0",
	"@angular/platform-browser": "^22.0.0",
	"@angular/router": "^22.0.0",
	"@ng-icons/core": "^34.0.0",
	"@ng-icons/heroicons": "^34.0.0",
	"rxjs": "~7.8.0",
	"tslib": "^2.3.0"
}
```

### `devDependencies` (package.json, literal)

```json
{
	"@angular/build": "^22.0.3",
	"@angular/cli": "^22.0.3",
	"@angular/compiler-cli": "^22.0.0",
	"@commitlint/cli": "^21.2.1",
	"@commitlint/config-conventional": "^21.2.0",
	"@eslint/js": "^10.0.1",
	"@tailwindcss/postcss": "^4.1.12",
	"angular-eslint": "22.1.0",
	"eslint": "^10.6.0",
	"eslint-config-prettier": "^10.1.8",
	"husky": "^9.1.7",
	"jsdom": "^28.0.0",
	"lint-staged": "^17.0.8",
	"postcss": "^8.5.3",
	"prettier": "^3.8.1",
	"prettier-plugin-tailwindcss": "^0.8.1",
	"tailwindcss": "^4.1.12",
	"typescript": "~6.0.2",
	"typescript-eslint": "8.62.1",
	"vitest": "^4.0.8"
}
```

### Presencia explícita de los paquetes preguntados

| Paquete                      | ¿En package.json?                | ¿En node_modules? | Notas                                                                                                                                                                                                                                                 |
| ---------------------------- | -------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular/ssr`               | NO EXISTE                        | NO INSTALADO      | No hay SSR ni prerender en el proyecto                                                                                                                                                                                                                |
| `@angular/platform-server`   | NO EXISTE                        | NO INSTALADO      | —                                                                                                                                                                                                                                                     |
| `express`                    | NO EXISTE                        | INSTALADO (5.2.1) | Solo **transitivo**: `@angular/cli@22.0.6 → @modelcontextprotocol/sdk@1.29.0 → express@5.2.1`. No es una dependencia del proyecto ni hay servidor propio                                                                                              |
| `tailwindcss`                | SÍ, `devDependencies`: `^4.1.12` | INSTALADO (4.3.2) | Tailwind 4, vía PostCSS (`@tailwindcss/postcss`)                                                                                                                                                                                                      |
| `@angular/material`          | NO EXISTE                        | NO INSTALADO      | `@angular/cdk@22.0.4` sí está instalado, pero **transitivo** de `@angular/aria@22.0.4`                                                                                                                                                                |
| Librerías de SEO / meta tags | NO EXISTE                        | NO INSTALADO      | Ni `ngx-seo`, ni `ngx-meta`, ni `@nguniversal/*`, ni `schema-dts`, ni `jsonld`. El único mecanismo disponible hoy es el `title` de las rutas de Angular y `Meta`/`Title` de `@angular/platform-browser` (parte del framework, no una librería aparte) |

Otros paquetes que conviene tener presentes:

- `@angular/aria@^22.0.4` (primitivas accesibles headless) y `@ng-icons/core` + `@ng-icons/heroicons@^34.0.0` (iconos) están en `dependencies`, pero **no se usan en ningún archivo del proyecto todavía** (no hay componentes).
- `zone.js`: **NO EXISTE** en package.json y **NO INSTALADO**. Ver §4 (zoneless).
- `jsdom@^28.0.0` está en `devDependencies` como entorno DOM de Vitest.

### Scripts de package.json

| Script       | Comando                                          |
| ------------ | ------------------------------------------------ |
| `ng`         | `ng`                                             |
| `start`      | `ng serve`                                       |
| `build`      | `ng build`                                       |
| `build:dev`  | `ng build --configuration development`           |
| `build:prod` | `ng build --configuration production`            |
| `watch`      | `ng build --watch --configuration development`   |
| `test`       | `ng test`                                        |
| `lint`       | `ng lint`                                        |
| `format`     | `prettier --write "src/**/*.{ts,html,css,json}"` |
| `prepare`    | `husky`                                          |

---

## 3. Configuración de build

### `architect.build` (angular.json, literal)

```json
"build": {
	"builder": "@angular/build:application",
	"options": {
		"browser": "src/main.ts",
		"tsConfig": "tsconfig.app.json",
		"assets": [
			{
				"glob": "**/*",
				"input": "public"
			}
		],
		"styles": ["src/styles.css"]
	},
	"configurations": {
		"production": {
			"budgets": [
				{
					"type": "initial",
					"maximumWarning": "500kB",
					"maximumError": "1MB"
				},
				{
					"type": "anyComponentStyle",
					"maximumWarning": "4kB",
					"maximumError": "8kB"
				}
			],
			"outputHashing": "all",
			"fileReplacements": [
				{
					"replace": "src/environments/environment.ts",
					"with": "src/environments/environment.prod.ts"
				}
			]
		},
		"development": {
			"optimization": false,
			"extractLicenses": false,
			"sourceMap": true
		}
	},
	"defaultConfiguration": "production"
}
```

### `architect.serve` (angular.json, literal)

```json
"serve": {
	"builder": "@angular/build:dev-server",
	"configurations": {
		"production": {
			"buildTarget": "web-movia:build:production"
		},
		"development": {
			"buildTarget": "web-movia:build:development"
		}
	},
	"defaultConfiguration": "development"
}
```

### Builder

- **build**: `@angular/build:application` (el builder moderno basado en esbuild/Vite; no es `browser` ni `browser-esbuild`).
- **serve**: `@angular/build:dev-server`.
- **test**: `@angular/build:unit-test` (runner Vitest, `setupFiles: ["src/test-setup.ts"]`).
- **lint**: `@angular-eslint/builder:lint`.

### Claves de SSR / prerender

- **`outputMode`**: NO EXISTE
- **`prerender`**: NO EXISTE
- **`ssr`**: NO EXISTE
- **`server`**: NO EXISTE
- **`appShell`**: NO EXISTE

No existe ningún target `server` ni `prerender` en `architect`; los únicos targets son `build`, `serve`, `test` y `lint`. **La aplicación es una SPA 100 % de cliente**: el build produce `index.html` + bundles y nada más.

### `tsconfig.json` (literal)

```jsonc
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
	"compileOnSave": false,
	"compilerOptions": {
		"strict": true,
		"paths": {
			"@core/*": ["./src/app/core/*"],
			"@shared/*": ["./src/app/shared/*"],
			"@layout/*": ["./src/app/layout/*"],
			"@features/*": ["./src/app/features/*"]
		},
		"noImplicitOverride": true,
		"noPropertyAccessFromIndexSignature": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true,
		"skipLibCheck": true,
		"isolatedModules": true,
		"experimentalDecorators": true,
		"importHelpers": true,
		"target": "ES2022",
		"module": "preserve"
	},
	"angularCompilerOptions": {
		"strictTemplates": true,
		"enableI18nLegacyMessageIdFormat": false,
		"strictInjectionParameters": true,
		"strictInputAccessModifiers": true
	},
	"files": [],
	"references": [
		{
			"path": "./tsconfig.app.json"
		},
		{
			"path": "./tsconfig.spec.json"
		}
	]
}
```

### `tsconfig.app.json` (literal)

```jsonc
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"outDir": "./out-tsc/app",
		"types": []
	},
	"include": ["src/**/*.ts"],
	"exclude": ["src/**/*.spec.ts"]
}
```

---

## 4. Estructura y routing

### Árbol de `src/` (hasta 3 niveles)

```
src
src/app
src/app/app.config.ts
src/app/app.html
src/app/app.routes.ts
src/app/app.spec.ts
src/app/app.ts
src/environments
src/environments/environment.prod.ts
src/environments/environment.ts
src/index.html
src/main.ts
src/styles.css
src/test-setup.ts
```

No existen `src/app/core/`, `src/app/shared/`, `src/app/layout/` ni `src/app/features/`: el proyecto está vacío a la espera de la landing.

### `src/app/app.routes.ts` (completo)

```ts
import { Routes } from '@angular/router';

/**
 * Map of domains. Each domain owns its pages in `features/<domain>/<domain>.routes.ts`
 * and is registered here with `loadChildren`; a page without sibling domain hangs
 * straight from `loadComponent`.
 */
export const routes: Routes = [];
```

Es el único archivo de rutas del proyecto. **El array está vacío**: la aplicación no declara ninguna ruta.

### Archivos de servidor

- `src/app/app.routes.server.ts`: **NO EXISTE**
- `src/app/app.config.server.ts`: **NO EXISTE**
- `server.ts` (raíz) y `src/server.ts`: **NO EXISTE**
- `src/main.server.ts`: **NO EXISTE**

### Standalone vs NgModules

**Standalone components.** No existe ni un solo `@NgModule` en el proyecto. El arranque es `bootstrapApplication(App, appConfig)` en `src/main.ts`, y el único componente (`App`) declara `imports: [RouterOutlet]` en su decorador. En Angular 22 `standalone: true` es el valor por defecto y por convención del proyecto no se escribe.

`src/main.ts` (literal):

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

`src/app/app.ts` (literal):

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Application root: nothing but the routed tree. */
@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html'
})
export class App {}
```

### Signals, zoneless o zone.js

- **zone.js: NO EXISTE** como dependencia ni está instalado, y `angular.json` **no declara la clave `polyfills`**, así que no se carga ningún polyfill de Zone.
- `provideZonelessChangeDetection()`: **NO aparece** en `app.config.ts`. Tampoco aparece `provideZoneChangeDetection()`.
- Consecuencia: la aplicación corre **zoneless**, que es el comportamiento por defecto de Angular 22 cuando no hay zone.js cargado. Funciona (lint, tests y `build:prod` pasan, y la app arranca en el navegador), pero conviene saber que es un default implícito y no una elección escrita en el código.
- **Signals**: el proyecto no usa signals todavía porque no hay componentes con estado — solo existe `App`, que está vacío. Las convenciones de `.claude/CLAUDE.md` sí exigen signals (`signal`, `computed`) para todo estado que pinte la vista.

`src/app/app.config.ts` (literal):

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
		provideBrowserGlobalErrorListeners()
	]
};
```

---

## 5. HTML base y SEO actual

### `src/index.html` (completo)

```html
<!doctype html>
<html lang="es">
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
		<link
			href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			rel="stylesheet"
		/>
	</head>
	<body>
		<app-root></app-root>
	</body>
</html>
```

### Meta tags presentes hoy

| Meta / link                                                             | ¿Existe?                                    | Valor                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `<title>`                                                               | SÍ                                          | `Movía` (estático; ninguna ruta define `title` porque no hay rutas) |
| `charset`                                                               | SÍ                                          | `utf-8`                                                             |
| `viewport`                                                              | SÍ                                          | `width=device-width, initial-scale=1`                               |
| `color-scheme`                                                          | SÍ                                          | `light`                                                             |
| `theme-color`                                                           | SÍ                                          | `#1C242C`                                                           |
| `description`                                                           | **NO EXISTE**                               | —                                                                   |
| `og:title`, `og:description`, `og:image`, `og:url`, `og:type`           | **NO EXISTE** (ninguna etiqueta `og:`)      | —                                                                   |
| `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` | **NO EXISTE** (ninguna etiqueta `twitter:`) | —                                                                   |
| `<link rel="canonical">`                                                | **NO EXISTE**                               | —                                                                   |
| `<link rel="alternate" hreflang>`                                       | **NO EXISTE**                               | —                                                                   |
| `<link rel="icon">`                                                     | SÍ                                          | `favicon.png` (image/png)                                           |
| `<link rel="manifest">`                                                 | SÍ                                          | `manifest.webmanifest`                                              |
| `<link rel="apple-touch-icon">`                                         | **NO EXISTE**                               | —                                                                   |
| JSON-LD (`<script type="application/ld+json">`)                         | **NO EXISTE**                               | —                                                                   |

Además hay dos `preconnect` a Google Fonts y una hoja de estilos de Google Fonts (Inter + Plus Jakarta Sans).

### Archivos estáticos

- `public/robots.txt`: **NO EXISTE**
- `public/sitemap.xml`: **NO EXISTE**
- `src/assets/`: **NO EXISTE** (los estáticos van en `public/`, servido por el `assets` glob de `angular.json`)
- Contenido completo de `public/`:

```
public/favicon.png
public/imgs/logos/isotipo-green.svg
public/manifest.webmanifest
```

- `public/manifest.webmanifest` (literal):

```json
{
	"name": "Movía",
	"short_name": "Movía",
	"description": "Movía: una sola suscripción para entrenar donde quieras.",
	"start_url": "/",
	"display": "standalone",
	"background_color": "#ffffff",
	"theme_color": "#1C242C",
	"lang": "es",
	"icons": [
		{
			"src": "favicon.png",
			"sizes": "64x64",
			"type": "image/png"
		}
	]
}
```

---

## 6. Estilos

- **Preprocesador: ninguno. CSS plano.** No hay `.scss` ni `.sass` en el repo, y `angular.json` no declara `schematics.@schematics/angular:component.style`. Tailwind 4 es CSS-first y no soporta Sass, de ahí la elección.
- **Framework CSS: Tailwind CSS 4**, configurado vía PostCSS. `.postcssrc.json` (literal):

```json
{
	"plugins": {
		"@tailwindcss/postcss": {}
	}
}
```

No existe `tailwind.config.js` ni `tailwind.config.ts`: en Tailwind 4 la configuración es CSS-first y vive en `src/styles.css` (bloque `@theme`). Complementa `prettier-plugin-tailwindcss`, que ordena las clases automáticamente.

- **Estilos globales**: un único archivo, `src/styles.css`, declarado en `architect.build.options.styles`. No hay ningún `.css` por componente (`styleUrl`) en el proyecto.
- Estructura de `src/styles.css`:
    - `@import 'tailwindcss';`
    - `:root` con los valores crudos de marca: `--brand-lime: #d3f442`, `--brand-carbon: #1c242c`, `--brand-white`, `--brand-mist: #f4f5f8`, `--brand-gray`, `--brand-green`, `--brand-amber`, `--brand-red`, `--brand-blue`.
    - `@theme` que mapea esos valores a tokens de Tailwind: `--color-primary` (lima), `--color-secondary` (carbón) con sus `-contrast`/`-shade`/`-tint`, `--color-surface`, `--color-surface-muted`, `--color-ink`, `--color-muted`, `--color-border`, estados `success`/`warning`/`danger`/`info` con sus `-surface`, y las fuentes `--font-sans` (Inter) y `--font-display` (Plus Jakarta Sans).
    - `@layer base` con `body { @apply bg-surface-muted text-ink; }`.
    - `@layer components` con cinco clases propias: `.field-label`, `.field-input`, `.btn-primary`, `.btn-secondary`, `.btn-danger` y `.card`.
    - Dos PENDIENTES anotados en comentarios: la fuente de marca Gilroy (no se puede declarar su `@font-face` porque el `.woff2` no existe) y el azul informativo, que no sale de la identidad.

---

## 7. Gobernanza y repo

| Archivo     | ¿Existe? | Ubicación                               |
| ----------- | -------- | --------------------------------------- |
| `CLAUDE.md` | SÍ       | `.claude/CLAUDE.md` (**no** en la raíz) |
| `RULES.md`  | SÍ       | `.claude/RULES.md` (**no** en la raíz)  |
| `SETUP.md`  | SÍ       | `.claude/SETUP.md` (**no** en la raíz)  |
| `README.md` | SÍ       | raíz                                    |

> Ojo: `.claude/` está en `.gitignore`, así que los tres primeros **no están en el repositorio**: viven solo en esta máquina.

**`.claude/CLAUDE.md`** — Convenciones del proyecto: SPA estática Angular 22 + Tailwind 4 sin backend; arquitectura por capas (`core`/`shared`/`layout`/`features`) con agrupación por dominio y path aliases. Prohíbe `any`, `template`/`styles` inline, `*ngIf`/`*ngFor`, `ngModel`, `HttpClient` y `localStorage`; exige signals, `inject()`, `_` en miembros privados, Signal Forms con `[formRoot]`, tokens del tema para todo color y mobile-first. Cierra con nomenclatura, testing (Vitest), Conventional Commits y una lista explícita de prohibiciones.

**`.claude/RULES.md`** — Las 23 reglas obligatorias que complementan a CLAUDE.md, en tres bloques: agente (1-5: no tocar config, no silenciar ESLint/TS, no instalar sin permiso, verificar con lint+test, no refactorizar fuera de alcance), arquitectura (6-11: dirección de dependencias, criterios de extracción de secciones, lazy loading, dominio = carpeta = ruta, los dos cajones de `shared/`) y código (12-23: inglés, JSDoc, `computed` vs `effect`, `track` estable, `NgOptimizedImage`, constantes con nombre, sin secretos, un archivo por responsabilidad, `if` sin llaves, tipos por constructo, `_` en privados, `[formRoot]` + `(submit)`). Cada regla lleva el porqué y ejemplos de bien/mal.

**`.claude/SETUP.md`** — Receta de 18 pasos para montar este stack sobre un Angular 22 recién creado: Tailwind 4 por PostCSS, ng-icons, Angular Aria, fuentes e idioma, `.nvmrc`, Prettier, ESLint plano, TS estricto, path aliases, Husky + lint-staged + commitlint, environments, `app.config.ts`, budgets, coverage, CI mínimo, scripts npm y archivos del agente. Termina exigiendo `lint && test && build:prod` en verde **y** abrir la app en el navegador para enviar un formulario de verdad.

**`README.md`** — Presenta `web-movia` como la landing pública estática (Angular 22 + Tailwind 4, sin backend), remite a `.claude/` para convenciones y reglas, y documenta requisitos (Node >=22.12.0), arranque (`npm start` en :4200) y la tabla de comandos. Cierra recordando generar componentes sin `--inline-template`/`--inline-style`.

### `.gitignore` (contenido completo)

```gitignore
# See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Claude
.claude

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/mcp.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
__screenshots__/

# System files
.DS_Store
Thumbs.db
```

### Git

- **Rama actual**: `main`
- **Remoto**: `https://github.com/moviaec/web-movia.git` (rama `main` con upstream `origin/main`)
- **Últimos commits**:

```
ece4cb7 chore: setup inicial de web-movia
e568078 initial commit
```

- **`git status --short`**:

```
(sin salida: no hay cambios sin commitear en el momento del diagnóstico)
```

> Nota: este archivo (`ESTADO-PROYECTO.md`) es nuevo y aparecerá como `?? ESTADO-PROYECTO.md` en cuanto se vuelva a consultar el estado.

### Variables de entorno

`.env`, `.env.local` y cualquier otro archivo `.env*`: **NO EXISTE**. No hay ninguna variable de entorno que listar.

Lo más parecido son los environments de Angular, que solo llevan valores públicos:

- `src/environments/environment.ts` → claves: `production`, `siteUrl`
- `src/environments/environment.prod.ts` → claves: `production`, `siteUrl`

---

## 8. Observaciones

### Lo que está vacío o sin implementar

1. **No hay ninguna ruta.** `app.routes.ts` exporta `[]`, así que la app arranca, monta `<router-outlet />` y no pinta nada. Tampoco hay página 404: cualquier URL cae en el mismo vacío.
2. **No hay componentes de negocio.** No existen `core/`, `shared/`, `layout/` ni `features/`. El único componente es `App`, que solo contiene el outlet.
3. **No hay layout (`header`/`footer`)**, que es lo primero que va a necesitar una landing.
4. **Un solo test** (`app.spec.ts`, «should create the app»). El umbral de cobertura configurado no se aplica (ver punto 8 de abajo).
5. **Sin contenido**: no hay constantes, interfaces ni JSON con los textos de la landing.

### Inconsistencias y cosas a vigilar

6. **Los alias de TypeScript apuntan a carpetas que no existen.** `tsconfig.json` declara `@core/*`, `@shared/*`, `@layout/*` y `@features/*` hacia `./src/app/{core,shared,layout,features}/*`, y ninguna de esas carpetas existe hoy. No rompe el build (TS no valida que el destino exista hasta que se importa), pero un import antes de crear la carpeta fallará.
7. **`tsconfig.json` usa `paths` sin `baseUrl`**, mientras que `.claude/SETUP.md` §9 documenta la forma con `baseUrl: "."` y rutas `src/app/...`. Las dos funcionan (aquí las rutas son relativas al tsconfig, con `./src/...`), pero la receta y el proyecto no dicen lo mismo.
8. **El umbral de cobertura está configurado pero desactivado.** En `angular.json`, el target `test` declara `"coverage": false` y a la vez `"coverageThresholds": { "lines": 80, "branches": 80 }`. Sin cobertura activada, esos umbrales no se comprueban nunca: hoy `npm run test` pasa con 1 test y 0 % de cobertura real.
9. **`src/test-setup.ts` está vacío** (solo un comentario y `export {}`) pero sigue referenciado en `setupFiles`. Es correcto —el archivo debe existir— pero conviene recordar que ya no hace nada desde que se quitó `fake-indexeddb`.
10. **`.claude/` está en `.gitignore`.** CLAUDE.md, RULES.md y SETUP.md son la gobernanza del proyecto y **no viajan en el repositorio**: quien clone `web-movia` no los recibe, y se pierden si se borra la copia local.
11. **`.editorconfig` y `.prettierrc` se contradicen.** El `.editorconfig` (del scaffold original) dice `indent_style = space` con `indent_size = 2`; `.prettierrc` dice `useTabs: true` con `tabWidth: 4`, y Prettier es quien manda según CLAUDE.md. Además, `format` solo cubre `src/**`, así que `angular.json`, `tsconfig*.json` y `package.json` conviven con estilos de indentación distintos (de hecho `tsconfig.json` y `tsconfig.app.json` están con 2 espacios y el resto con tabs).
12. **Dependencias declaradas y sin usar todavía**: `@angular/aria`, `@ng-icons/core` y `@ng-icons/heroicons` están en `dependencies` pero ningún archivo las importa. No estorban, pero hoy no aportan nada al bundle porque nadie las referencia.
13. **`express` y `@angular/cdk` aparecen en `node_modules` sin estar en `package.json`**: son transitivos (`express` del CLI vía `@modelcontextprotocol/sdk`; `cdk` de `@angular/aria`). No indican SSR ni Material.
14. **`siteUrl` de producción sin confirmar**: `environment.prod.ts` apunta a `https://moviapass.com`. Es una suposición del setup, no un dato verificado.

### SEO: el hueco más grande para una landing

15. **La app es una SPA sin SSR ni prerender.** No hay `@angular/ssr`, ni `outputMode`, ni `prerender`, ni `server`, ni `appShell`. El HTML que recibe un crawler es el `index.html` de arriba con un `<app-root></app-root>` vacío: todo el contenido lo pinta JavaScript. Para una landing —cuyo objetivo es justamente posicionar— esto es lo que más pesa, y la decisión (SSG/prerender con `outputMode: 'static'`, SSR, o quedarse en SPA) conviene tomarla **antes** de maquetar, porque condiciona cómo se escriben los componentes.
16. **No hay metadatos sociales ni canónicos**: sin `description`, sin `og:*`, sin `twitter:*`, sin `canonical` y sin JSON-LD. Al compartir la URL no habrá título ni imagen de previsualización.
17. **No hay `robots.txt` ni `sitemap.xml`** en `public/`.
18. **Los iconos son mínimos**: solo `favicon.png` de 64×64, que es también el único icono del manifest. Faltan los 192×192 y 512×512 que piden los navegadores para instalar una PWA, y no hay `apple-touch-icon`. El manifest declara `display: standalone` pero no hay service worker (`@angular/pwa` no está instalado), así que hoy es un manifest informativo.
19. **El `title` es estático en `index.html`.** En cuanto haya rutas, cada una debe declarar su `title` (lo exige CLAUDE.md) y probablemente haga falta un servicio que además actualice `description` y `og:*` por página con `Meta`/`Title`.
