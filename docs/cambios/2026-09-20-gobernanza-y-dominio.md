# Gobernanza versionada, dominio confirmado y bump de @ng-icons

Cuatro fases: separar en commits lo que el `--allow-dirty` había mezclado, cerrar la convención de documentación, registrar la decisión de dominio y subir `@ng-icons` mientras todavía es gratis.

> **Una fase quedó a medias a propósito.** La 2.2 (sacar la gobernanza del `.gitignore`) está **parada** porque `.claude/` contiene un cuarto archivo que no son los tres `.md`. El encargo decía explícitamente que me parase y lo reportase antes de seguir. Detalle en §2.

---

## Commits de esta tarea

```
41b2838 build(deps): subir @ng-icons de 34 a 36
2b65d06 docs: registrar el dominio de la landing y lo que exige al hosting
c2a00a0 chore: limpiar residuos del schematic de SSR
352f9c5 build(deps): alinear el árbol de Angular en 22.1.x
650d426 docs: establecer docs/ como destino de la documentación generada
92511e6 build: prerenderizar la landing con outputMode static
ece4cb7 chore: setup inicial de web-movia
```

Los cinco de esta tarea son de `650d426` a `41b2838`; `92511e6` es la migración SSG (commiteada al principio de la tarea anterior) y `ece4cb7`, el setup.

**Working tree tras la Fase 4:** limpio salvo este informe y su fila en `docs/README.md`, que quedan sin commitear para que los revises.

---

## Fase 1 — Los tres commits separados

| Commit                                                                       | Qué entra                                                                                           |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `650d426` `docs: establecer docs/ como destino de la documentación generada` | `docs/` entero: cuatro subcarpetas con su README, el índice y los dos informes movidos con `git mv` |
| `352f9c5` `build(deps): alinear el árbol de Angular en 22.1.x`               | `package.json` + `package-lock.json`                                                                |
| `c2a00a0` `chore: limpiar residuos del schematic de SSR`                     | `tsconfig.app.json` + `src/app/app.config.ts`                                                       |

`git status --short` después de los tres: **vacío**. El `git log --oneline -4` es el de arriba.

Dos ajustes sobre los mensajes que había propuesto, para que no digan nada falso:

- Al de `352f9c5` le añadí el párrafo que pediste sobre el `@types/node` que viaja de rebote.
- En `c2a00a0` cambié la primera frase: el mensaje original anunciaba el `npm uninstall @types/node`, que en realidad se fue en el commit anterior. Ahora lo dice así y remite a él.

El `git mv` funcionó como se esperaba: Git registra los dos informes como renombrados (`R`), con el diagnóstico al 99 % de similitud por el blockquote de superado, y el informe de migración al 100 %.

---

## Fase 2 — Gobernanza (parcial)

### 2.1 · `docs/` documentado en CLAUDE.md ✅

Añadido como una viñeta más de la sección **Arquitectura**, entre la de `features/` y la de los path aliases, con el mismo estilo del resto (destino → qué va dentro → a qué regla remite):

```markdown
- `docs/` (en la RAÍZ, fuera de `src/`) → toda la documentación que se genera: `diagnosticos/` (fotos del estado del proyecto), `cambios/` (migraciones, refactors, updates), `decisiones/` (decisiones técnicas y su porqué) y `guias/` (despliegue, arranque, runbooks). Los archivos se nombran `YYYY-MM-DD-nombre-en-kebab-case.md`, con la fecha de creación, y cada uno se apunta en `docs/README.md`. Ningún `.md` se deja suelto en la raíz ni en `.claude/`: las únicas excepciones son el `README.md` del repositorio y la propia gobernanza (`CLAUDE.md`, `RULES.md`, `SETUP.md`). Detalle en `RULES.md` (regla 24).
```

### 2.2 · Contenido de `.claude/` — PARADA ⛔

```
$ ls -la .claude
total 88
drwxr-xr-x   6 carlossanchez  staff    192 Sep 20 16:54 .
drwxr-xr-x  27 carlossanchez  staff    864 Sep 20 17:20 ..
-rw-r--r--@  1 carlossanchez  staff  10688 Sep 20 16:55 CLAUDE.md
-rw-r--r--@  1 carlossanchez  staff  19070 Sep 20 17:17 RULES.md
-rw-r--r--@  1 carlossanchez  staff   7676 Sep 20 16:56 SETUP.md
-rw-r--r--@  1 carlossanchez  staff    157 Sep 20 16:54 launch.json

$ find .claude -mindepth 1 | sort
.claude/CLAUDE.md
.claude/RULES.md
.claude/SETUP.md
.claude/launch.json
```

No hay subcarpetas, ni archivos ocultos, ni caché, ni logs, ni nada que huela a credenciales. **Hay un cuarto archivo: `.claude/launch.json`**, y su contenido entero es este:

```json
{
	"version": "0.0.1",
	"configurations": [
		{
			"name": "web-movia",
			"runtimeExecutable": "npm",
			"runtimeArgs": ["start"],
			"port": 4200
		}
	]
}
```

Es la configuración del servidor de desarrollo que usa el panel de navegador de Claude Code: nombre del proyecto, `npm start` y puerto 4200. **No contiene nada sensible ni nada específico de tu máquina** (ni rutas absolutas, ni tokens, ni usuario).

**Por qué me paro aunque el patrón propuesto ya lo dejaría fuera.** El `.gitignore` que me pediste es selectivo: `.claude/*` más tres negaciones, así que `launch.json` seguiría ignorado sin que yo haga nada. Aun así, tu instrucción era parar si aparecía algo que no fueran los tres `.md`, y prefiero cumplirla al pie de la letra antes que decidir por mi cuenta que «este no cuenta».

**Qué falta por hacer cuando me respondas:** el reemplazo en `.gitignore`, el `git add` de los tres `.md` y el commit 2.4. El texto exacto que se aplicaría:

```diff
-# Claude
-.claude
+# Claude — la gobernanza se versiona; lo demás no
+.claude/*
+!.claude/CLAUDE.md
+!.claude/RULES.md
+!.claude/SETUP.md
```

Y el mensaje de commit que propongo:

```
chore: versionar la gobernanza del proyecto

Saca CLAUDE.md, RULES.md y SETUP.md del .gitignore. Son la norma que dice
cómo se mantiene este repositorio —arquitectura, convenciones de código,
dónde va la documentación— y hasta ahora solo existían en una máquina:
quien clonaba web-movia recibía docs/ pero no las reglas que lo gobiernan,
y un cambio en ellas no dejaba rastro en el historial.

El patrón es deliberadamente selectivo (.claude/* y tres negaciones) para
que cualquier otra cosa que aparezca en .claude/ —settings locales, caché,
launch.json del panel de navegador— siga fuera del repositorio sin tener
que acordarse de ignorarla.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

> **Efecto secundario de la parada:** el cambio de 2.1 en `CLAUDE.md` está hecho en disco pero **no aparece en `git status`**, porque `.claude/` sigue ignorado. Entrará en el commit 2.4 junto con los otros dos archivos.

---

## Fase 3 — Dominio

### 3.1 · Environments

**No toqué nada.** `src/environments/environment.prod.ts` ya tenía `siteUrl: 'https://moviapass.com'`, que es el valor correcto; `environment.ts` mantiene `http://localhost:4200` para desarrollo. El valor se escribió en su día como suposición y lo marqué como pendiente de confirmar: ahora está confirmado.

### 3.2-3.4 · Decisión registrada

[`docs/decisiones/2026-09-20-dominio-y-hosting.md`](../decisiones/2026-09-20-dominio-y-hosting.md), primer documento de `decisiones/`, commiteado en `2b65d06` junto con su fila en `docs/README.md`.

Marca el tono para los siguientes: estado arriba (**dominio CONFIRMADO · hosting ABIERTO**), la decisión en dos líneas, las consecuencias separadas entre las que ya están aplicadas y las que quedan pendientes, y lo que el prerender le exige al hosting con las dos recetas concretas (CloudFront Function o `try_files`). Sin tutorial y sin implementar nada.

---

## Fase 4 — `@ng-icons` 34 → 36

### Versión disponible

```
Package               Current   Wanted   Latest
@ng-icons/core         34.0.0   34.0.0   36.0.0
@ng-icons/heroicons    34.0.0   34.0.0   36.0.0
```

`latest` es **36.0.0** (entre medias hay 35.0.0, 35.0.1 y 35.1.0). `Wanted` se queda en 34.0.0 porque el rango declarado era `^34.0.0`. Los peers de la 36 son `@angular/core >=22.0.0` y `@angular/common >=22.0.0`: compatibles con el 22.1.7 del proyecto.

### Breaking changes documentados

**v36.0.0 (2026-09-02)** — uno solo, y es de tipos:

> `IconName` ahora contiene **solo los iconos que importas**. Antes era la unión de los 110.111 iconos del catálogo, estuvieran instalados o no.
>
> ```ts
> const a: IconName = 'heroBeaker'; // ok si está importado
> const b: IconName = 'akarAir'; // error en 36.0.0 si no lo está
> ```
>
> No afecta a plantillas, alias, loaders de iconos, sets personalizados ni al comportamiento en runtime.

**v35.1.0 (2026-08-27)** — solo features: nuevos sets Keyline y Reicon, y web de documentación rehecha con AnalogJS.

**v35.0.0 (2026-08-06)** — ajustes de la revisión del salto a Angular 22; sin breaking changes en las notas. La 35.0.1 arregló el empaquetado de `ng-add`.

**Cómo nos afecta hoy: en nada.** Ningún archivo importa `@ng-icons`, así que el cambio de `IconName` no rompe una línea. Y cuando se empiece a usar, juega a favor: el autocompletado dejará de ofrecer iconos de paquetes que no están instalados.

Fuente: [ng-icons/ng-icons — Releases](https://github.com/ng-icons/ng-icons/releases).

### Diff de `package.json`

```diff
diff --git a/package.json b/package.json
index 0b5dd54..bfe8ddc 100644
--- a/package.json
+++ b/package.json
@@ -37,8 +37,8 @@
 		"@angular/platform-server": "^22.1.7",
 		"@angular/router": "^22.1.7",
 		"@angular/ssr": "^22.1.8",
-		"@ng-icons/core": "^34.0.0",
-		"@ng-icons/heroicons": "^34.0.0",
+		"@ng-icons/core": "^36.0.0",
+		"@ng-icons/heroicons": "^36.0.0",
 		"rxjs": "~7.8.0",
 		"tslib": "^2.3.0"
 	},
```

### Verificación (salida literal)

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
Application bundle generation complete. [0.923 seconds] - 2026-09-20T22:27:57.626Z


 RUN  v4.1.10 /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:27:57
   Duration  674ms (transform 27ms, setup 179ms, import 33ms, tests 24ms, environment 337ms)


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
Application bundle generation complete. [2.305 seconds] - 2026-09-20T22:28:01.277Z

Output location: /Users/carlossanchez/Documentos/Proyectos/Movia/Proyecto/web-movia/dist/web-movia
```

### Comprobación del prerender

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

✅ `routes` trae `"/"`, no está vacío. ✅ El `<app-root>` lleva `ng-server-context="ssg"`.

### Tamaño del bundle, antes y después del bump

| Build                    | main (raw) | main (transferencia) | Total inicial (raw) | Total (transferencia) |
| ------------------------ | ---------- | -------------------- | ------------------- | --------------------- |
| Antes (`@ng-icons` 34)   | 236.14 kB  | 65.63 kB             | 245.91 kB           | 67.81 kB              |
| Después (`@ng-icons` 36) | 236.14 kB  | 65.63 kB             | 245.91 kB           | 67.81 kB              |

**Idéntico, byte a byte**: el `main` conserva incluso el mismo hash (`main-4CTNC2L6.js`). Es la prueba de que los dos paquetes no entran en el bundle mientras nadie los importe, y de que subirlos hoy no tiene coste.

---

## Push

**NO se hizo push, y no se hará en esta tarea.** Estado del remoto:

```
$ git status -sb | head -1
## main...origin/main [ahead 6]

$ git log --oneline origin/main..main
41b2838 build(deps): subir @ng-icons de 34 a 36
2b65d06 docs: registrar el dominio de la landing y lo que exige al hosting
c2a00a0 chore: limpiar residuos del schematic de SSR
352f9c5 build(deps): alinear el árbol de Angular en 22.1.x
650d426 docs: establecer docs/ como destino de la documentación generada
92511e6 build: prerenderizar la landing con outputMode static
```

`origin/main` sigue en `ece4cb7`, el commit de setup: es lo único que hay publicado en GitHub. Los seis commits de arriba viven solo en local.

---

## Cosas que me llamaron la atención

1. **La parada de la Fase 2 cuesta más de lo que parece.** Mientras `.claude/` siga ignorado, el cambio de CLAUDE.md de 2.1 y la regla 24 entera son invisibles para Git: no hay diff, no hay historial y no hay forma de revisarlos en un PR. Son ahora mismo los dos únicos cambios del proyecto que no puedes revisar en un commit.
2. **Un `.md` de `docs/` se coló en el commit de documentación.** `git add docs/` (lo que pedía 1.1) arrastró también el informe de la tarea anterior, `2026-09-20-update-angular-y-limpieza.md`, que estaba pendiente de tu revisión. No es un problema —es documentación y su sitio es ese—, pero conviene saber que ya está commiteado en `650d426`.
3. **El `siteUrl` de producción llevaba semanas siendo correcto por casualidad.** Lo puse como suposición al vaciar el proyecto y lo marqué como pendiente en dos informes. Hoy se confirma que acertó, pero lo que lo convierte en dato fiable es el documento de decisión, no que estuviera escrito en el archivo.
4. **Subir `@ng-icons` fue gratis exactamente porque llegamos a tiempo.** Dos majors sin tocar una línea y sin mover un byte del bundle. Ese margen se cierra en cuanto la primera pantalla registre iconos con `provideIcons`.
5. **`npm outdated` sigue listando `angular-eslint` (22.1.0 → 22.5.0) y `jsdom` (28 → 30)**, además de patches de eslint, prettier, postcss y lint-staged. Nada de eso entraba en esta tarea. `angular-eslint` es el que más conviene mirar pronto: gobierna las reglas que bloquean el pre-commit.
6. **Quedan 10 vulnerabilidades en `npm audit`** (3 moderadas, 7 altas) arrastradas por dependencias transitivas del tooling. No las toqué porque no entraban en el alcance, pero merecen una revisión propia antes de publicar el sitio.
