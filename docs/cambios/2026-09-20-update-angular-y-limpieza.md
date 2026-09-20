# Update de Angular 22.0.6 → 22.1.x y limpieza de residuos del schematic

Tres cosas en una tarea: establecer dónde vive la documentación (Fase 0), alinear el árbol de Angular (Fase A) y quitar lo que sobraba del schematic de SSR (Fase B). Sin commits: el árbol queda listo para que los revises.

> **Aviso previo.** El árbol NO estaba limpio al empezar: la migración SSG estaba hecha pero **sin commitear**. Me paré, lo reporté y, con tu autorización, la commiteé antes de tocar nada (`92511e6 build: prerenderizar la landing con outputMode static`). Todo lo que hay en el working tree ahora es de esta tarea.

---

## Fase 0 — Convención de documentación

### Estructura creada

```
docs/
├── README.md          ← índice con tabla de documentos y su estado
├── diagnosticos/      ← auditorías y fotos del estado del proyecto
│   ├── README.md
│   └── 2026-09-20-estado-inicial.md
├── cambios/           ← informes de migraciones, refactors y updates
│   ├── README.md
│   ├── 2026-09-20-migracion-ssg.md
│   └── 2026-09-20-update-angular-y-limpieza.md   ← este documento
├── decisiones/        ← decisiones técnicas y su porqué (ADR ligeros)
│   └── README.md
└── guias/             ← cómo desplegar, cómo arrancar, runbooks
    └── README.md
```

Los dos informes que vivían en la raíz se movieron **con `git mv`**, así que Git los sigue como renombrados (`R` en el status) y conserva su historial:

```
R  CAMBIOS-SSG.md    -> docs/cambios/2026-09-20-migracion-ssg.md
RM ESTADO-PROYECTO.md -> docs/diagnosticos/2026-09-20-estado-inicial.md
```

La `M` del segundo es el blockquote de **DOCUMENTO SUPERADO** añadido bajo el título. El resto del diagnóstico no se tocó: es una foto con fecha.

`docs/` **no está en `.gitignore`** (comprobado con `git check-ignore -v docs`, que no devuelve nada), así que no hizo falta avisar de nada ni editar el archivo.

### Regla añadida a `.claude/RULES.md` (texto literal)

### Documentación que genera el agente

> Esta regla es del bloque del agente, pero lleva el número 24 porque va detrás de la última existente: renumerarla como 6 obligaría a mover las 18 reglas siguientes y dejaría sin sentido todas las referencias cruzadas de `CLAUDE.md` y de los documentos ya escritos.

24. **Todo `.md` que escriba el agente vive en `docs/`, nunca en la raíz ni en `.claude/`.** Sin excepciones por «es un informe de una sola tarea»: un archivo suelto en la raíz también es documentación, y es justo el que nadie vuelve a encontrar.

    - **Dos únicas excepciones**, y no se amplían: `README.md` de la raíz, que es la portada del repositorio, y los archivos de `.claude/` (`CLAUDE.md`, `RULES.md`, `SETUP.md`), que son gobernanza del agente y no documentación del producto.
    - **Subcarpeta por tipo**, según lo que el documento ES, no según la tarea que lo generó:
        - `docs/diagnosticos/` → auditorías y fotos del estado del proyecto.
        - `docs/cambios/` → informes de migraciones, refactors y actualizaciones.
        - `docs/decisiones/` → decisiones técnicas y su porqué (ADR ligeros).
        - `docs/guias/` → cómo desplegar, cómo arrancar, runbooks.
    - **Nombre obligatorio: `YYYY-MM-DD-nombre-en-kebab-case.md`.** La fecha es la de CREACIÓN y no se actualiza nunca: ordena la carpeta cronológicamente y dice de un vistazo a qué momento del proyecto se refiere el contenido. Todo en minúsculas, sin acentos ni `ñ` en el nombre del archivo (un acento en una ruta acaba escapado en los enlaces y roto en algún sistema de ficheros).
    - **Al crear un documento se añade su fila a `docs/README.md`** (documento, fecha, qué contiene, vigente o superado). Un índice que no se actualiza es peor que no tenerlo.
    - **Un documento con fecha no se reescribe cuando el proyecto cambia**: se marca como superado en un blockquote al principio y se escribe uno nuevo. Corregir un diagnóstico viejo destruye la única prueba de cómo estaba el proyecto ese día.

    ```
    # Bien
    docs/diagnosticos/2026-09-20-estado-inicial.md
    docs/cambios/2026-09-20-migracion-ssg.md

    # Mal
    ESTADO-PROYECTO.md              (en la raíz)
    .claude/INFORME.md              (.claude es gobernanza, no informes)
    docs/cambios/migracion-ssg.md   (sin fecha)
    docs/cambios/2026-09-20-Migración-SSG.md  (mayúsculas y acento)
    ```

**Sobre la numeración:** el encargo pedía «numerada a continuación de la última que exista» **y** «en el bloque de agente», y las dos cosas juntas no encajan en un documento cuyas secciones van por número (1-5 agente, 6-11 arquitectura, 12-23 código). Resolví poniéndola en el bloque del agente con el número 24 y un blockquote que explica por qué no es la 6: renumerar habría invalidado todas las referencias cruzadas de `CLAUDE.md` (que cita las reglas 19, 20, 21, 22 y 23) y de los documentos ya escritos. Va bajo su propio `###` para que Markdown la renderice como «24.» y no como «6.».

> **Ojo:** `.claude/` está en `.gitignore`, así que esta regla **no viaja en el repositorio**. Vive solo en tu máquina, igual que `CLAUDE.md` y `SETUP.md`. No es nuevo, pero con una regla de convención duele más: quien clone el repo no la recibe.

---

## Fase A — Alinear el árbol de Angular

### A1 · `npx ng update` (sin argumentos)

```
Using package manager: npm
Collecting installed dependencies...
Found 34 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!
```

**No devolvió ninguna tabla**, y no es un error: `ng update` sin argumentos solo lista paquetes con un **major** nuevo disponible. Las actualizaciones dentro del mismo major (22.0.6 → 22.1.7) no las enseña, así que «everything seems to be in order» convivía con once paquetes de Angular desactualizados.

Lo que sí las ve es `npm outdated` (solo las filas de Angular, que son las de esta fase):

```
Package                    Current   Wanted   Latest
@angular/aria               22.0.4   22.1.7   22.1.7
@angular/build              22.0.6   22.1.8   22.1.8
@angular/cli                22.0.6   22.1.8   22.1.8
@angular/common             22.0.6   22.1.7   22.1.7
@angular/compiler           22.0.6   22.1.7   22.1.7
@angular/compiler-cli       22.0.6   22.1.7   22.1.7
@angular/core               22.0.6   22.1.7   22.1.7
@angular/forms              22.0.6   22.1.7   22.1.7
@angular/platform-browser   22.0.6   22.1.7   22.1.7
@angular/platform-server    22.0.6   22.1.7   22.1.7
@angular/router             22.0.6   22.1.7   22.1.7
@angular/ssr                22.0.6   22.1.8   22.1.8
```

El `latest` de `@angular/core` en el registro es **22.1.7** (hay un `22.2.0-rc.0` bajo el tag `next`, que no entra). Angular 23 no existe todavía, así que no hubo ninguna propuesta de salto de major que rechazar.

### A2 · `npx ng update @angular/core@22 @angular/cli@22 --allow-dirty`

```
Repository is not clean. Update changes will be mixed with pre-existing changes.
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 22 to perform the update.
Repository is not clean. Update changes will be mixed with pre-existing changes.
Using package manager: npm
Collecting installed dependencies...
Found 34 dependencies.
Fetching dependency metadata from registry...
Updating package.json with dependency @angular/common to version 22.1.7...
Updating package.json with dependency @angular/compiler to version 22.1.7...
Updating package.json with dependency @angular/core to version 22.1.7...
Updating package.json with dependency @angular/forms to version 22.1.7...
Updating package.json with dependency @angular/platform-browser to version 22.1.7...
Updating package.json with dependency @angular/platform-server to version 22.1.7...
Updating package.json with dependency @angular/router to version 22.1.7...
Updating package.json with dependency @angular/ssr to version 22.1.8...
Updating package.json with dependency @angular/build to version 22.1.8...
Updating package.json with dependency @angular/cli to version 22.1.8...
Updating package.json with dependency @angular/compiler-cli to version 22.1.7...
❯ Cleaning node modules directory
✔ Cleaning node modules directory
❯ Installing packages
✔ Installing packages
```

Dos cosas de esta salida:

- **`--allow-dirty` fue necesario.** `ng update` se niega a trabajar sobre un árbol sucio, y la Fase 0 lo deja sucio a propósito (no puedo commitear). El aviso «Repository is not clean» es consecuencia de eso, no un problema.
- **No se ejecutó ninguna migración.** Entre 22.0 y 22.1 no hay schematics de migración; por eso el comando solo reescribe versiones e instala.

`ng update` arrastró por su cuenta `@angular/ssr`, `@angular/platform-server`, `@angular/build` y `@angular/compiler-cli` sin que hubiera que pedírselo. **`@angular/aria` no**: se quedó en 22.0.4. Como la tabla de A1 venía vacía, la condición del paso A2 («si A1 los lista, inclúyelos») nunca se disparó, así que lo alineé después con su propio comando, que es lo que pedía A3:

```
Repository is not clean. Update changes will be mixed with pre-existing changes.
Using package manager: npm
Collecting installed dependencies...
Found 39 dependencies.
Fetching dependency metadata from registry...
Updating package.json with dependency @angular/aria to version 22.1.7...
❯ Cleaning node modules directory
✔ Cleaning node modules directory
❯ Installing packages
✔ Installing packages
```

### A3 · `npx ng version` final

```

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI       : 22.1.8
Angular           : 22.1.7
Node.js           : 22.23.1
Package Manager   : npm 10.9.8
Operating System  : darwin arm64

┌───────────────────────────┬───────────────────┬───────────────────┐
│ Package                   │ Installed Version │ Requested Version │
├───────────────────────────┼───────────────────┼───────────────────┤
│ @angular/aria             │ 22.1.7            │ ^22.1.7           │
│ @angular/build            │ 22.1.8            │ ^22.1.8           │
│ @angular/cli              │ 22.1.8            │ ^22.1.8           │
│ @angular/common           │ 22.1.7            │ ^22.1.7           │
│ @angular/compiler         │ 22.1.7            │ ^22.1.7           │
│ @angular/compiler-cli     │ 22.1.7            │ ^22.1.7           │
│ @angular/core             │ 22.1.7            │ ^22.1.7           │
│ @angular/forms            │ 22.1.7            │ ^22.1.7           │
│ @angular/platform-browser │ 22.1.7            │ ^22.1.7           │
│ @angular/platform-server  │ 22.1.7            │ ^22.1.7           │
│ @angular/router           │ 22.1.7            │ ^22.1.7           │
│ @angular/ssr              │ 22.1.8            │ ^22.1.8           │
│ rxjs                      │ 7.8.2             │ ~7.8.0            │
│ typescript                │ 6.0.3             │ ~6.0.2            │
│ vitest                    │ 4.1.10            │ ^4.0.8            │
└───────────────────────────┴───────────────────┴───────────────────┘
```

**Ningún paquete quedó descolgado.** Todos los `@angular/*` están en la misma minor, **22.1**:

- Framework (core, common, compiler, compiler-cli, forms, platform-browser, platform-server, router, aria): **22.1.7**
- Herramientas (cli, build, ssr): **22.1.8**

Que las herramientas vayan un patch por delante es lo normal en Angular: el CLI y el builder tienen su propia línea de parches dentro de la misma minor. No es una incoherencia, y de hecho es lo que desactiva el `ERESOLVE` de la tarea anterior: el conflicto era mezclar 22.0.x con 22.1.x, y ya no hay mezcla.

### A4 · Zoneless, intacto

Nada que revertir:

- `zone.js` **no** aparece en `package.json` y **no** está en `node_modules`.
- `angular.json` **no** tiene la clave `polyfills`.

### A5 · Claves del build, intactas

```
outputMode: static
server    : src/main.server.ts
ssr       : AUSENTE
prerender : AUSENTE
appShell  : AUSENTE
targets   : ['build', 'serve', 'test', 'lint']
```

`ng update` no tocó `angular.json`: su diff contra el commit anterior está **vacío**. No hubo nada que restaurar.

### A6 · Rangos de `package.json`

Tienes razón en la corrección: `^22.0.6` significa `>=22.0.6 <23.0.0`, así que **22.1.x ya lo satisfacía** — lo que sujetaba las versiones era el lockfile, no el rango. La justificación que escribí en el informe anterior era incorrecta.

Tras el update dejo los rangos exactamente como los puso `ng update`, sin tocarlos a mano:

| Paquete                     | Antes     | Ahora     |
| --------------------------- | --------- | --------- |
| `@angular/aria`             | `^22.0.4` | `^22.1.7` |
| `@angular/common`           | `^22.0.6` | `^22.1.7` |
| `@angular/compiler`         | `^22.0.6` | `^22.1.7` |
| `@angular/core`             | `^22.0.6` | `^22.1.7` |
| `@angular/forms`            | `^22.0.6` | `^22.1.7` |
| `@angular/platform-browser` | `^22.0.6` | `^22.1.7` |
| `@angular/platform-server`  | `^22.0.6` | `^22.1.7` |
| `@angular/router`           | `^22.0.6` | `^22.1.7` |
| `@angular/ssr`              | `^22.0.6` | `^22.1.8` |
| `@angular/build`            | `^22.0.3` | `^22.1.8` |
| `@angular/cli`              | `^22.0.3` | `^22.1.8` |
| `@angular/compiler-cli`     | `^22.0.0` | `^22.1.7` |

### A7 · Verificación de la Fase A (salida literal)

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
Application bundle generation complete. [1.573 seconds] - 2026-09-20T22:19:38.912Z


 RUN  v4.1.10 /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:19:39
   Duration  682ms (transform 30ms, setup 183ms, import 33ms, tests 23ms, environment 338ms)


$ npm run build:prod

> web-movia@0.0.0 build:prod
> ng build --configuration production

❯ Building...
✔ Building...
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-KG2Q6Z5U.js    | main          | 236.03 kB |                65.66 kB
styles-F3C4QETT.css | styles        |   9.77 kB |                 2.18 kB

                    | Initial total | 245.80 kB |                67.84 kB

Prerendered 1 static route.
Application bundle generation complete. [3.828 seconds] - 2026-09-20T22:19:44.973Z

Output location: /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia/dist/web-movia
```

### A8 · Verificación crítica del prerender (Fase A)

```
$ cat dist/web-movia/prerendered-routes.json
{
  "routes": {
    "/": {}
  }
}

$ grep -o '<app-root[^>]*>' dist/web-movia/browser/index.html
<app-root ng-version="22.1.7" ngh="0" ng-server-context="ssg">

$ [ -d dist/web-movia/server ] && echo EXISTE || echo "server/ NO existe"
server/ NO existe

$ find dist -name '*.mjs' | wc -l
0
```

✅ `routes` contiene `"/"`, **no** está vacío. ✅ El `<app-root>` lleva `ng-server-context="ssg"`. Y el `ng-version="22.1.7"` confirma de paso que el HTML se prerenderizó con el Angular nuevo.

### A9 · Mensaje de commit propuesto para la Fase A

```
build(deps): alinear el árbol de Angular en 22.1.x

Sube el framework de 22.0.6 a 22.1.7 y las herramientas (cli, build, ssr)
a 22.1.8, todo dentro del major 22. Deshace el apaño de la migración SSG,
donde hubo que fijar @angular/ssr hacia abajo para esquivar un ERESOLVE:
con todo el árbol en la misma minor, el conflicto desaparece.

- ng update @angular/core@22 @angular/cli@22, que arrastra ssr,
  platform-server, build y compiler-cli
- @angular/aria alineado aparte, porque ese comando no lo toca
- sin migraciones que ejecutar entre 22.0 y 22.1
- zoneless intacto: sigue sin zone.js y sin clave polyfills
- prerender verificado: prerendered-routes.json trae "/" y el index.html
  sale con ng-server-context="ssg"

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

## Fase B — Limpieza de residuos del schematic

### B1 · Fuera los tipos de Node

`"types": ["node"]` volvió a `[]` en `tsconfig.app.json` y `npm uninstall @types/node`. **Ni el lint ni el build ni los tests se quejaron**, que era la duda: `main.server.ts` solo usa APIs de Angular, y el único archivo que necesitaba Node era `src/server.ts`, borrado en la tarea anterior.

`@types/node` **sigue en `node_modules`** como dependencia transitiva de otros paquetes (vitest y la cadena del CLI lo traen). Eso es normal y no lo reintroduce como dependencia del proyecto: ya no está en `package.json` y `tsconfig.app.json` no lo carga en el contexto de tipos de la app.

### B2 · Event replay activado

```diff
diff --git a/src/app/app.config.ts b/src/app/app.config.ts
index df158cc..5b86ad2 100644
--- a/src/app/app.config.ts
+++ b/src/app/app.config.ts
@@ -1,5 +1,5 @@
 import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
-import { provideClientHydration } from '@angular/platform-browser';
+import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
 import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

 import { routes } from './app.routes';
@@ -8,6 +8,7 @@ export const appConfig: ApplicationConfig = {
 	providers: [
 		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
 		provideBrowserGlobalErrorListeners(),
-		provideClientHydration()
+		/** Replays the clicks that land before the JS hydrates; without it, a CTA pressed early does nothing. */
+		provideClientHydration(withEventReplay())
 	]
 };
```

### B3 · Verificación de la Fase B (salida literal)

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
Application bundle generation complete. [0.921 seconds] - 2026-09-20T22:20:05.629Z


 RUN  v4.1.10 /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:20:05
   Duration  677ms (transform 28ms, setup 181ms, import 34ms, tests 24ms, environment 338ms)


$ npm run build:prod

> web-movia@0.0.0 build:prod
> ng build --configuration production

❯ Building...
✔ Building...
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-4CTNC2L6.js    | main          | 236.14 kB |                65.63 kB
styles-F3C4QETT.css | styles        |   9.77 kB |                 2.18 kB

                    | Initial total | 245.91 kB |                67.81 kB

Prerendered 1 static route.
Application bundle generation complete. [2.424 seconds] - 2026-09-20T22:20:09.392Z

Output location: /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia/dist/web-movia
```

### Verificación crítica del prerender (Fase B)

```
$ cat dist/web-movia/prerendered-routes.json
{
  "routes": {
    "/": {}
  }
}

$ grep -o '<app-root[^>]*>' dist/web-movia/browser/index.html
<app-root ng-version="22.1.7" ngh="0" ng-server-context="ssg">

$ [ -d dist/web-movia/server ] && echo EXISTE || echo "server/ NO existe"
server/ NO existe

$ find dist -name '*.mjs' | wc -l
0
```

✅ Las dos comprobaciones siguen pasando después de la limpieza.

### B4 · Mensaje de commit propuesto para la Fase B

```
chore: limpiar residuos del schematic de SSR

Quita @types/node y "types": ["node"] de tsconfig.app.json: los metió el
schematic para src/server.ts, que ya no existe, y main.server.ts no usa
ninguna API de Node. Lint, tests y build siguen en verde sin ellos.

Activa además el event replay de la hidratación
(provideClientHydration(withEventReplay())): hasta ahora los clics que
ocurren antes de que hidrate el JS se perdían, y en una landing con CTAs
eso es un botón que no responde.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

## Diffs

### `package.json`

```diff
diff --git a/package.json b/package.json
index 9a1372c..0b5dd54 100644
--- a/package.json
+++ b/package.json
@@ -28,29 +28,28 @@
 		]
 	},
 	"dependencies": {
-		"@angular/aria": "^22.0.4",
-		"@angular/common": "^22.0.6",
-		"@angular/compiler": "^22.0.6",
-		"@angular/core": "^22.0.6",
-		"@angular/forms": "^22.0.6",
-		"@angular/platform-browser": "^22.0.6",
-		"@angular/platform-server": "^22.0.6",
-		"@angular/router": "^22.0.6",
-		"@angular/ssr": "^22.0.6",
+		"@angular/aria": "^22.1.7",
+		"@angular/common": "^22.1.7",
+		"@angular/compiler": "^22.1.7",
+		"@angular/core": "^22.1.7",
+		"@angular/forms": "^22.1.7",
+		"@angular/platform-browser": "^22.1.7",
+		"@angular/platform-server": "^22.1.7",
+		"@angular/router": "^22.1.7",
+		"@angular/ssr": "^22.1.8",
 		"@ng-icons/core": "^34.0.0",
 		"@ng-icons/heroicons": "^34.0.0",
 		"rxjs": "~7.8.0",
 		"tslib": "^2.3.0"
 	},
 	"devDependencies": {
-		"@angular/build": "^22.0.3",
-		"@angular/cli": "^22.0.3",
-		"@angular/compiler-cli": "^22.0.0",
+		"@angular/build": "^22.1.8",
+		"@angular/cli": "^22.1.8",
+		"@angular/compiler-cli": "^22.1.7",
 		"@commitlint/cli": "^21.2.1",
 		"@commitlint/config-conventional": "^21.2.0",
 		"@eslint/js": "^10.0.1",
 		"@tailwindcss/postcss": "^4.1.12",
-		"@types/node": "^20.17.19",
 		"angular-eslint": "22.1.0",
 		"eslint": "^10.6.0",
 		"eslint-config-prettier": "^10.1.8",
```

### `tsconfig.app.json`

```diff
diff --git a/tsconfig.app.json b/tsconfig.app.json
index 9efeab9..f1f9d80 100644
--- a/tsconfig.app.json
+++ b/tsconfig.app.json
@@ -4,7 +4,7 @@
 	"extends": "./tsconfig.json",
 	"compilerOptions": {
 		"outDir": "./out-tsc/app",
-		"types": ["node"]
+		"types": []
 	},
 	"include": ["src/**/*.ts"],
 	"exclude": ["src/**/*.spec.ts"]
```

### `src/app/app.config.ts`

```diff
diff --git a/src/app/app.config.ts b/src/app/app.config.ts
index df158cc..5b86ad2 100644
--- a/src/app/app.config.ts
+++ b/src/app/app.config.ts
@@ -1,5 +1,5 @@
 import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
-import { provideClientHydration } from '@angular/platform-browser';
+import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
 import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

 import { routes } from './app.routes';
@@ -8,6 +8,7 @@ export const appConfig: ApplicationConfig = {
 	providers: [
 		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
 		provideBrowserGlobalErrorListeners(),
-		provideClientHydration()
+		/** Replays the clicks that land before the JS hydrates; without it, a CTA pressed early does nothing. */
+		provideClientHydration(withEventReplay())
 	]
 };
```

### `angular.json`

**Sin cambios.** `git diff angular.json` no devuelve nada: ni `ng update` ni la Fase B lo tocaron.

### `package-lock.json`

No se pega por tamaño: `2321 insertions(+), 2337 deletions(-)`. Es la reescritura del árbol por `ng update` (que además hace `Cleaning node modules directory` y reinstala de cero).

---

## Tamaño del bundle, antes y después

| Build                                    | main (raw) | main (transferencia) | Total inicial (raw) | Total (transferencia) |
| ---------------------------------------- | ---------- | -------------------- | ------------------- | --------------------- |
| Antes (Angular 22.0.6, commit `92511e6`) | 232.84 kB  | 64.71 kB             | 242.61 kB           | 66.89 kB              |
| Fase A (Angular 22.1.7)                  | 236.03 kB  | 65.66 kB             | 245.80 kB           | 67.84 kB              |
| Fase B (+ `withEventReplay()`)           | 236.14 kB  | 65.63 kB             | 245.91 kB           | 67.81 kB              |

- **El update cuesta ~3.2 kB en crudo (+1.4 %) y ~0.95 kB transferidos.** Es el precio del framework nuevo, no de nada que hayamos escrito.
- **`withEventReplay()` sale casi gratis: +0.11 kB en crudo**, y en transferencia incluso baja 0.03 kB (ruido de compresión). El motivo es que la app no tiene todavía ni un listener: el grueso del event replay se activa cuando hay eventos que capturar. **Esta cifra volverá a medirse cuando haya pantallas de verdad.**
- `styles-F3C4QETT.css` no se movió (9.77 kB / 2.18 kB) y conserva el mismo hash en los tres builds: el CSS no lo toca nada de esto.

---

## Cosas que me llamaron la atención

1. **`ng update` sin argumentos no ve las minors.** Dice «everything seems to be in order» teniendo doce paquetes de Angular por detrás. Si el criterio para actualizar es ese comando, el proyecto se queda atrás sin enterarse; `npm outdated` es el que lo canta.
2. **`ng update` reescribe `package.json` con 2 espacios**, cargándose los tabs que manda `.prettierrc`. Lo devolví a su formato con `npx prettier --write package.json` (el pre-commit lo haría igual). Conviene saberlo para futuros updates: el diff aparece gigante hasta que reformateas.
3. **`@angular/aria` no entra en `ng update @angular/core @angular/cli`.** Necesita su propio comando, y es fácil que se quede descolgado sin que nada avise.
4. **El `ERESOLVE` de la tarea anterior ya no puede pasar**: era mezclar 22.0.x con 22.1.x, y ahora todo está en 22.1.
5. **El prerender sigue produciendo una sola ruta vacía.** Las dos comprobaciones de A8 pasan, pero `"/"` renderiza un `<app-root>` con solo el `router-outlet` dentro, porque `app.routes.ts` sigue vacío. La migración no se puede dar por validada de verdad hasta que haya una pantalla maquetada.
6. **La regla 24 vive en un archivo que no se commitea** (`.claude/` está en `.gitignore`). Una convención que solo existe en tu máquina no la puede seguir nadie más.
7. **`@ng-icons` (34 → 36), `angular-eslint` (22.1.0 → 22.5.0) y `jsdom` (28 → 30) tienen majors/minors nuevos** que `npm outdated` lista y que esta tarea no toca. `@ng-icons` está declarado pero sin usar todavía; si se va a usar, mejor subirlo antes de escribir código contra la versión vieja.
