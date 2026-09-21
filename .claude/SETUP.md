# SETUP.md — Setup de proyecto web (Angular 22 + Tailwind 4)

Pasos de instalación y configuración sobre un proyecto Angular 22 ya creado (`--style=css`, standalone + OnPush por defecto, Vitest como runner). Las convenciones de código viven en `CLAUDE.md` y las reglas del agente en `RULES.md`.

## 1. Tailwind CSS 4

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

`.postcssrc.json` en la raíz:

```json
{
	"plugins": {
		"@tailwindcss/postcss": {}
	}
}
```

Reemplazar el contenido de `src/styles.css`:

```css
@import 'tailwindcss';

@theme {
	/* Tokens del proyecto — completar con los colores/fuentes de cada proyecto */
	--color-primary: #000000;
	--color-secondary: #000000;

	--font-sans: 'Inter', sans-serif;
	--font-display: 'Plus Jakarta Sans', sans-serif;
}

/* Utilidades propias (solo si Tailwind no las trae) */
/* @utility ... {} */

/* Componentes CSS propios (solo patrones muy repetidos) */
/* @layer components {} */
```

> Nota: Tailwind 4 es CSS-first y NO soporta Sass. El proyecto debe estar en CSS plano.

## 2. Iconos: Heroicons vía ng-icons

```bash
npm install @ng-icons/core @ng-icons/heroicons
```

Uso: importar `NgIcon` en el componente y registrar solo los iconos usados con `provideIcons({...})` (tree-shakeable). No instalar webfonts de iconos.

## 3. Componentes accesibles: Angular Aria

```bash
npm install @angular/aria
```

Primitivas headless accesibles (menú, dialog, tabs, listbox…) que se estilizan con Tailwind.

## 4. Fuentes e idioma

En `index.html`: `lang="es"` en `<html>` y las fuentes Inter y Plus Jakarta Sans por `<link>` de Google Fonts (ajustar según el proyecto).

## 5. Versión de Node fijada

```bash
node -v > .nvmrc
```

Y en `package.json`:

```json
"engines": {
	"node": ">=22.12.0"
}
```

## 6. Prettier

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

`.prettierrc` en la raíz:

```json
{
	"useTabs": true,
	"tabWidth": 4,
	"printWidth": 150,
	"singleQuote": true,
	"trailingComma": "none",
	"plugins": ["prettier-plugin-tailwindcss"],
	"overrides": [{ "files": "*.html", "options": { "parser": "angular" } }]
}
```

`prettier-plugin-tailwindcss` ordena las clases de Tailwind automáticamente.

## 7. ESLint

```bash
ng add @angular-eslint/schematics
npm install -D eslint-config-prettier
```

`eslint.config.js` (formato plano): `@eslint/js` + `typescript-eslint` (recommended + stylistic) + `angular-eslint` (tsRecommended + templateRecommended + `...templateAccessibility`) + `eslint-config-prettier` AL FINAL (sin `eslint-plugin-prettier`: Prettier corre aparte). Reglas clave:

- `@typescript-eslint/explicit-function-return-type: 'error'`
- `@typescript-eslint/no-explicit-any: 'error'`
- `no-console: ['error', { allow: ['error', 'warn'] }]`
- Selectores: componente `app-` kebab-case, directiva `app` camelCase.
- `ignores`: `dist`, `.angular`, `coverage`, `**/*.spec.ts`.

## 8. TypeScript estricto

En `tsconfig.json` (el CLI lo trae; fijarlo para que nadie lo relaje):

```json
"compilerOptions": { "strict": true },
"angularCompilerOptions": { "strictTemplates": true }
```

## 9. Path aliases

En `tsconfig.json`, dentro de `compilerOptions`:

```json
"baseUrl": ".",
"paths": {
	"@core/*": ["src/app/core/*"],
	"@shared/*": ["src/app/shared/*"],
	"@layout/*": ["src/app/layout/*"],
	"@features/*": ["src/app/features/*"]
}
```

## 10. Husky + lint-staged + commitlint

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

- `.husky/pre-commit`: `npx lint-staged`
- `.husky/commit-msg`: `npx --no-install commitlint --edit "$1"`
- `commitlint.config.js`: `module.exports = { extends: ['@commitlint/config-conventional'] };`
- `lint-staged` en `package.json`:

```json
"lint-staged": {
	"*.{ts,html}": ["eslint --fix", "prettier --write"],
	"*.{json,css,md}": ["prettier --write"]
}
```

## 11. Environments

```bash
ng generate environments
```

- `src/environments/environment.ts` (dev) y `src/environments/environment.prod.ts` (producción, aplicado por `fileReplacements` en la configuración `production` de `angular.json`; el schematic lo configura).
- Solo URLs públicas y flags: `production`, `siteUrl` y lo que el proyecto necesite. Si el proyecto consume una API, ahí va su `apiUrl`; en un sitio estático no existe esa clave.
- Nunca hardcodear URLs absolutas ni meter secretos (regla 18 de `RULES.md`).

## 12. `app.config.ts`

```ts
export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
		provideBrowserGlobalErrorListeners()
	]
};
```

- Un proyecto que consuma una API añade aquí `provideHttpClient(withFetch(), withInterceptors([...]))` y crea `core/interceptors/` y `core/guards/`. Un sitio estático NO lo lleva: sin backend no hay cliente HTTP que registrar.
- Rutas con `title` por página y carga lazy (`loadComponent` / `loadChildren`).

## 13. Budgets de bundle

En `angular.json`, configuración `production`:

```json
"budgets": [
	{ "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" },
	{ "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
]
```

## 14. Coverage en Vitest

Umbral mínimo en la config de test para que `npm test` falle bajo el porcentaje acordado (p. ej. 80% en líneas y ramas).

## 15. CI mínimo

Workflow (GitHub Actions o equivalente) que en cada push/PR ejecute en orden: `npm ci` → `npm run lint` → `npm run test` → `npm run build:prod`. Husky protege el commit local; el CI valida lo que llega al repo.

## 16. Scripts npm

En `package.json`:

```json
"scripts": {
	"start": "ng serve",
	"build": "ng build",
	"build:dev": "ng build --configuration development",
	"build:prod": "ng build --configuration production",
	"watch": "ng build --watch --configuration development",
	"test": "ng test",
	"lint": "ng lint",
	"format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
	"prepare": "husky"
}
```

## 17. Archivos del agente

Copiar a `.claude/` las plantillas `CLAUDE.md` y `RULES.md` (deben quedar al mismo nivel para que el import `@RULES.md` resuelva). Completar en `CLAUDE.md`: nombre del proyecto, de dónde salen sus datos (API, contenido estático) y las validaciones que haya que replicar.

## 18. Verificación final

```bash
npm run lint && npm run test && npm run build:prod
```

Todo debe pasar en verde antes del primer commit de setup (`chore: project setup`).

### Y además: abrir la app y enviar un formulario

El verde de arriba **no prueba que la app funcione**. Antes de dar por bueno el setup (y antes de cerrar cualquier pantalla con formulario), hay que arrancarla y hacer el recorrido a mano: `npm start`, navegar y enviar un formulario de verdad.

Esto no es celo: en este proyecto los 14 formularios estuvieron enviándose de forma nativa —recargando la página con la contraseña en la query string— **con el lint, los 52 tests y el build:prod en verde**, porque llevaban `(ngSubmit)` sin `FormsModule` y ningún tipo puede detectar que ese evento no lo emite nadie (`RULES.md` regla 23). Lo que hay que mirar al probar:

- El formulario envía y la URL **no cambia** (si aparecen `?campo=valor`, hubo submit nativo: falta `[formRoot]`).
- La pantalla muestra su feedback (y, si el formulario sale a algún servicio, la petición aparece en la pestaña Network).
- La consola queda limpia.

Regla general que deja este caso: **una pantalla no está terminada hasta que se ha ejercitado en el navegador**. Los tests cubren la lógica; el submit de un `<form>` solo lo cubre el navegador.
