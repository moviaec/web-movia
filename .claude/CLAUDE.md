# CLAUDE.md — <Movia>

SPA **estática** en Angular 22 + Tailwind CSS 4 que aloja la landing de Movía. **No hay backend**: todo el contenido es estático (constantes tipadas del propio repo o JSON servido desde `public/`). No existe capa de API, ni sesión, ni storage del navegador.

Reglas obligatorias del agente, de arquitectura y de código:
@RULES.md

## Arquitectura

- `src/app/core/` → singletons y piezas transversales: `interfaces/` (formas de objeto), `types/` (uniones y alias), `constants/` (valores en runtime: el contenido de la landing vive aquí), `utils/` (funciones puras sin estado). Qué va en cada una: `RULES.md` regla 21.
- `src/app/shared/components/` → componentes de UI reutilizables en toda la app (badges, tarjetas, botones compuestos…).
- `src/app/shared/pages/` → páginas utilitarias sin dominio de negocio, que resuelve el router (`not-found`). Ver `RULES.md` (regla 11): `features/` es SOLO negocio; una pantalla de error de navegación NO es un dominio y no vive ahí.
- `src/app/layout/` → estructura global: `header/` y `footer/`.
- `src/app/features/<domain>/<page>/` → las páginas de NEGOCIO se agrupan por dominio funcional y la ruta cuelga del mismo prefijo (`features/legal/privacy` → `/legal/privacy`). Ver `RULES.md` (regla 9): un dominio de 2+ páginas lleva su `<domain>.routes.ts`; una página de negocio sin dominio hermano vive plana en `features/<page>/`.
- La página compone secciones; una sección se extrae a componente propio (`features/<domain>/<page>/components/<page>-<section>-section/`) SOLO si cumple los criterios de extracción de `RULES.md` (regla 7). Contenido estático simple vive en el template de la página.
- Dirección de dependencias entre capas: ver `RULES.md` (regla 6). Un dominio nunca importa de otro dominio; lo compartido DENTRO de un dominio vive en `features/<domain>/` (regla 10).
- `docs/` (en la RAÍZ, fuera de `src/`) → toda la documentación que se genera: `diagnosticos/` (fotos del estado del proyecto), `cambios/` (migraciones, refactors, updates), `decisiones/` (decisiones técnicas y su porqué) y `guias/` (despliegue, arranque, runbooks). Los archivos se nombran `YYYY-MM-DD-nombre-en-kebab-case.md`, con la fecha de creación, y cada uno se apunta en `docs/README.md`. Ningún `.md` se deja suelto en la raíz ni en `.claude/`: las únicas excepciones son el `README.md` del repositorio y la propia gobernanza (`CLAUDE.md`, `RULES.md`, `SETUP.md`). Detalle en `RULES.md` (regla 24).
- Path aliases en `tsconfig.json`: `@core/*`, `@shared/*`, `@layout/*`, `@features/*`. Usarlos siempre en imports entre carpetas.

## Reglas de código

- Prohibido `any`. Sin excepciones (regla ESLint activa).
- Un archivo por responsabilidad: el `.ts` lleva SOLO lógica, el `.html` SOLO lo visual (`templateUrl`), el `.css` SOLO estilos (`styleUrl`, y solo en la excepción justificada). JAMÁS `template:` ni `styles:` inline en `@Component`, por corto que sea el marcado (ver `RULES.md` regla 19).
- Toda función y método con tipo de retorno explícito (`@typescript-eslint/explicit-function-return-type` en error).
- `if` cuyo cuerpo es UNA sola sentencia va sin llaves (`if (!items.length) return null;`); con dos o más sentencias, o con `else`, siempre llaves (ver `RULES.md` regla 20).
- NO declarar `standalone` ni `changeDetection` en componentes: en Angular 22 `standalone` y `OnPush` ya son el default.
- Estado local con **signals** (`signal`, `computed`); nada de propiedades mutables sueltas para estado que pinta la vista. Uso de `computed` vs `effect()`: ver `RULES.md` (regla 14).
- Inyección con `inject()` en propiedades (`private readonly _router = inject(Router)`), no por constructor.
- Todo miembro `private` empieza por `_` (`private readonly _router = inject(Router)`); los `public` y `protected` NO lo llevan, porque la plantilla los lee (ver `RULES.md` regla 22).
- Control flow moderno en templates: `@if` / `@for` (con `track` estable, ver `RULES.md` regla 15) / `@switch`. Prohibido `*ngIf` / `*ngFor`.
- Formularios con **Signal Forms** (estables en v22, vía recomendada); nada de `ngModel`. Todo `<form>` lleva `[formRoot]="<fieldTree>"` y escucha `(submit)`, con `FormRoot` en los `imports`; `(ngSubmit)` NO existe sin `FormsModule` y deja que el navegador recargue la página con los campos en la URL (ver `RULES.md` regla 23).
- Identificadores en inglés SIEMPRE (componentes, funciones, variables, modelos, archivos) **y también las rutas** (`/partners`, `/corporate`, `/contact`, con la carpeta del dominio igual); textos visibles para el usuario en español, incluidas las etiquetas del menú, que por eso no coinciden con su ruta (ver `RULES.md` regla 12). JSDoc obligatorio en API pública, en inglés, sin fecha ni autor (ver `RULES.md` regla 13).
- Indentación con tabs (tabWidth 4), comillas simples, printWidth 150, sin trailing comma (Prettier manda, incluido el orden de clases de Tailwind vía `prettier-plugin-tailwindcss`; no discutir el formato a mano).

## Nomenclatura

- Archivos kebab-case; el nombre del archivo = selector sin `app-`. Cada componente son archivos hermanos con el mismo nombre base: `hero-section.ts` + `hero-section.html` (+ `hero-section.css` solo si hay excepción justificada).
- Prefijo de selectores: `app-`. Sufijo según el TIPO: página sin sufijo (`app-home`), sección `-section` (`app-home-hero-section`), modal `-modal`, etc.
- Clases CSS propias (si existen) en kebab-case inglés; tokens del tema como variables CSS en `@theme`.
- Tipos del dominio repartidos por CONSTRUCTO (ver `RULES.md` regla 21): formas de objeto en `core/interfaces/<dominio>.interface.ts`, uniones y alias en `core/types/<dominio>.type.ts`, valores en runtime en `core/constants/<dominio>.constants.ts`. Nunca repetir formas de objeto en componentes.

## Estilos (Tailwind 4)

- Mobile-first SIEMPRE: estilos base = móvil, breakpoints ascendentes (`p-3 lg:p-8`, `grid-cols-1 md:grid-cols-2`). Prohibido desktop-first.
- Prohibido `style="..."` inline y CSS por componente (salvo excepción mínima justificada, que va en el `.css` del componente vía `styleUrl`, nunca en `styles: []`).
- Orden de prioridad al estilar: 1) utilidades Tailwind → 2) tokens del tema (`@theme` en `styles.css`) → 3) solo si un patrón se repite mucho, crear clase en `@layer components` o utilidad con `@utility`, documentando qué aporta.
- Colores SIEMPRE desde los tokens del tema (`bg-primary`, `text-secondary`...); prohibido hex suelto en templates.
- Componentes interactivos accesibles (menú, dialog, tabs...) con **Angular Aria** + estilos Tailwind; no reimplementar comportamiento a mano.
- Iconos: Heroicons vía `@ng-icons/core` + `@ng-icons/heroicons`, registrando solo los usados con `provideIcons`, con `aria-hidden="true"` cuando son decorativos.
- Imágenes de contenido con `NgOptimizedImage` (ver `RULES.md` regla 16).
- El diseño de cada pantalla llega completo desde Claude Design: implementarlo fiel, adaptándolo a los tokens del tema y a estas convenciones.

## Contenido (sin backend)

- **No hay API.** El contenido de la landing (secciones, planes, FAQs, textos legales) vive como constantes tipadas en `core/constants/`, o como JSON en `public/` si el volumen lo pide; en ambos casos con su `interface` en `core/interfaces/`.
- Prohibido `HttpClient` para inventarse un backend: si una pantalla necesitase datos remotos (un formulario de contacto contra un servicio externo, por ejemplo), se habla ANTES de escribir el código, porque cambia la arquitectura del proyecto.
- Prohibido `localStorage` / `sessionStorage`: este proyecto no persiste nada en el navegador. Si aparece un caso real (consentimiento de cookies), se decide con el usuario antes de tocar nada.
- Formularios que envían datos usan un signal `status: 'idle' | 'sending' | 'success' | 'error'` para deshabilitar el botón y mostrar feedback inline con `aria-live="polite"`.
- `environment.siteUrl` es la base pública del sitio (dev en `environment.ts`; `environment.prod.ts` por fileReplacements en el build de producción). Nunca hardcodear URLs absolutas.

## Rutas, SEO y accesibilidad

- Rutas agrupadas por dominio (`RULES.md` regla 9): `app.routes.ts` mapea dominios con `loadChildren`, y cada `features/<domain>/<domain>.routes.ts` declara sus páginas con `loadComponent` (regla 8) y `title` por ruta (`'Contáctanos · Movía'`). El path va en inglés y el `title` en español (regla 12).
- HTML semántico: `<section>` con `aria-labelledby` por sección, una sola `<h1>` por página, `button` para acciones / `a` para navegación, `alt` en imágenes, `lang="es"`.
- Feedback dinámico con `aria-live="polite"`; errores de formulario asociados con `aria-describedby`.

## Testing

- Vitest (runner por defecto de Angular 22): `npm run test`. Los `.spec.ts` están excluidos del lint.
- Prohibido borrar, comentar o `skip`ear tests para que pasen (ver `RULES.md` regla 4).

## Commits

- Conventional Commits obligatorio (commitlint + husky commit-msg).
- Pre-commit con lint-staged: ESLint --fix + Prettier en `.ts/.html`; Prettier en `.json/.css/.md`. El lint bloquea `console.log`, `any` y demás reglas automáticamente.
- Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `build`, `ci`. Scope = página o dominio: `feat(home): maquetar la sección de planes`.

## Comandos

- Dev: `npm start` (ng serve)
- Build prod: `npm run build:prod`
- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm run test`
- Generar componente de sección: `ng g c features/<domain>/<page>/components/<page>-<section>-section`

## Prohibido

- `any` en cualquier parte del código.
- `template:` y `styles:` inline en `@Component`: SIEMPRE `templateUrl` a un `.html` hermano (ver `RULES.md` regla 19).
- `eslint-disable`, `@ts-ignore`, `@ts-expect-error` (ver `RULES.md` regla 2).
- Modificar archivos de configuración o instalar dependencias sin autorización (ver `RULES.md` reglas 1 y 3).
- Estilos inline y CSS por componente (salvo excepción mínima justificada).
- `*ngIf` / `*ngFor` (usar control flow `@if` / `@for`).
- `ngModel`.
- `(ngSubmit)` en un `<form>`, y un `<form>` sin `[formRoot]`: el handler no se ejecuta y el navegador recarga la página con los campos en la query string. Compila y pasa el lint, así que solo se ve probando la pantalla (ver `RULES.md` regla 23).
- `HttpClient`, `httpResource` y cualquier capa de API: este proyecto no tiene backend.
- `localStorage` / `sessionStorage`.
- Llaves en un `if` de una sola sentencia (ver `RULES.md` regla 20).
- Miembros `private` sin `_` delante, y `_` en miembros `public` o `protected` (ver `RULES.md` regla 22).
- Carpeta `core/models/` o archivos `.model.ts`: no existen, el reparto es por constructo (ver `RULES.md` regla 21).
- Mezclar constructos en un archivo: una `interface` en un `.type.ts`, un `type` en un `.interface.ts` o una `const` en cualquiera de los dos.
- Imports entre dominios de `features/` o que violen la dirección de capas (ver `RULES.md` reglas 6 y 10).
- Páginas sueltas en la raíz de `features/` cuando pertenecen a un dominio con hermanas, o rutas sin el prefijo del dominio (ver `RULES.md` regla 9).
- Páginas utilitarias (`not-found`...) dentro de `features/`: no son un dominio, van en `shared/pages/` (ver `RULES.md` regla 11).
- Colores en hex en plantillas o componentes: usar tokens del tema.
- Números y strings mágicos repetidos (ver `RULES.md` regla 17).
- Crear una clase CSS propia sin verificar antes que no exista la utilidad en Tailwind ni en el tema.
