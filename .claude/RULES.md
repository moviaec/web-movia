# RULES.md — Reglas para el agente y reglas de código

Este archivo complementa a `CLAUDE.md`. Sus reglas son obligatorias y no negociables.

## Reglas para el agente

1. **No tocar configuración sin autorización.** Prohibido modificar `eslint.config.js`, `.prettierrc`, `tsconfig.json`, `angular.json`, `package.json` (scripts/configs) para "hacer pasar" un error. Si una regla de lint o de tipos estorba, se reporta al usuario con el contexto; no se relaja.

2. **Prohibido silenciar herramientas.** Nada de `eslint-disable`, `@ts-ignore` ni `@ts-expect-error`. Si el código no pasa el lint o el tipado, se arregla el código. Excepción solo con comentario en línea justificando el porqué, y debe ser un caso contado.

3. **No instalar dependencias sin aprobación explícita.** Si una tarea parece necesitar un paquete nuevo, proponerlo primero: nombre, para qué, y alternativa sin dependencia si existe. Nunca ejecutar `npm install <paquete>` por iniciativa propia.

4. **Verificación antes de dar por terminada una tarea.** `npm run lint` y `npm run test` deben pasar. Prohibido borrar, comentar o marcar como `skip` tests para que pasen: si un test falla, se arregla el código o se discute el test con el usuario.

5. **No hacer refactors fuera del alcance de la tarea.** Si al tocar un archivo se detecta código mejorable pero ajeno a la tarea, se menciona al final de la respuesta; no se cambia. Los diffs deben ser revisables y acotados a lo pedido.

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

## Reglas de arquitectura

6. **Dirección de dependencias entre capas** (imports permitidos):
    - `core` NO importa de `shared`, `layout` ni `features`.
    - `shared` NO importa de `features` ni `layout`.
    - Una feature NUNCA importa de otra feature. Si dos features necesitan lo mismo, se sube a `shared` (UI) o `core` (modelos/constantes/utilidades).
    - `layout` puede importar de `core` y `shared`.

7. **Extracción de secciones a componente.** Una sección se extrae a su propio componente (`features/<domain>/<page>/components/<page>-<section>-section/`, ver regla 9) cuando cumple AL MENOS UNO de estos criterios:
    1. Tiene estado propio (signals, `computed`) o consume datos que hay que preparar.
    2. Contiene un formulario o lógica interactiva (handlers, validaciones).
    3. Se reutiliza (o hay plan concreto de reutilizarla) en otra página.
    4. Su template supera ~60 líneas o vuelve ilegible la página contenedora.

    Si no cumple ninguno (contenido estático simple: hero de texto, banner, bloque informativo), el HTML vive directamente en el template de la página. Ante la duda, NO extraer: extraer después es barato, des-extraer es ruido en el diff.

8. **Lazy loading obligatorio por página.** Toda ruta de página usa `loadComponent` (o `loadChildren` para grupos de rutas). Prohibido importar componentes de página directamente en `app.routes.ts`.

9. **Agrupación por dominio: la carpeta y la ruta son el mismo árbol.** Las páginas se agrupan por dominio funcional en `features/<domain>/<page>/`, y la ruta cuelga del mismo prefijo: `<domain>/<page>`. Prohibido inventar el dominio en el nombre del archivo (`legal-privacy`, `plans-detail` sueltos en la raíz de `features/`): el dominio es la carpeta.

    - Ejemplo canónico — todo lo legal va en `features/legal/`: `legal/terms` → `/legal/terms`, `legal/privacy` → `/legal/privacy`, `legal/cookies` → `/legal/cookies`.
    - El nombre de la carpeta de página NO se acorta por estar dentro del dominio: `features/legal/legal-notice/` (clase `LegalNotice`, selector `app-legal-notice`), no `features/legal/notice/`. La regla de nomenclatura de `CLAUDE.md` manda: archivo = selector sin `app-`.
    - El paralelismo carpeta/ruta aplica al PREFIJO de dominio, no a cada segmento: una ruta con parámetros o índice sigue viviendo bajo el dominio aunque el path no repita el nombre de la carpeta.
    - **Dominio de una sola página:** si el dominio tiene una única página y no hay plan concreto de hermanas, la página vive plana en `features/<page>/` con ruta `<page>` (`home`, `contact`). Envolver una sola página en una carpeta de dominio es un nivel muerto. En cuanto aparece la segunda página del dominio, se agrupa.
    - **`features/` es SOLO negocio.** Una página entra en `features/` únicamente si representa un dominio funcional del producto (home, planes, contacto, legal). Las páginas utilitarias de la aplicación — estados de error de navegación (`not-found`), mantenimiento y similares — NO son un dominio: no tienen datos ni modelo, y las invoca el router desde cualquier parte de la app. Viven en `shared/pages/<page>/` (regla 11) y `app.routes.ts` las carga desde ahí con `loadComponent` (regla 8).
    - **Rutas del dominio en su propio archivo:** un dominio con 2+ páginas define `features/<domain>/<domain>.routes.ts` exportando `<DOMAIN>_ROUTES: Routes`, y `app.routes.ts` lo registra con `loadChildren` (regla 8). `app.routes.ts` queda como mapa de dominios, no como lista de páginas.

10. **Lo compartido dentro de un dominio vive en el dominio.** Las páginas hermanas de un mismo dominio pueden compartir `features/<domain>/components/` o helpers del dominio: eso NO viola la regla 6, porque el dominio entero es la feature. Lo que sigue prohibido es importar de OTRO dominio: si dos dominios necesitan lo mismo, sube a `shared` (UI) o `core` (modelos/constantes). Lo que solo usa una página se queda en `features/<domain>/<page>/components/`.

11. **`shared/` tiene dos cajones, y el criterio es quién usa la pieza.**
    - `shared/components/<component>/` → piezas de UI que se insertan DENTRO de otra pantalla (badges, tarjetas, botones compuestos): no tienen ruta propia.
    - `shared/pages/<page>/` → páginas completas sin dominio de negocio, que el router resuelve desde cualquier parte de la app (`not-found`). Son la pantalla entera y tienen ruta propia.

    Ambos cajones siguen la regla 6: `shared` no importa de `features` ni de `layout`. Si una página de `shared/pages/` acabase necesitando un modelo propio de un dominio, deja de ser compartida: es de ese dominio y se mueve a `features/<domain>/`.

## Reglas de código

12. **Identificadores en inglés, siempre — y la URL es un identificador.** Nombres de componentes, clases, funciones, variables, signals, modelos y archivos: todo en inglés. Los únicos textos en español son los visibles para el usuario final (templates, mensajes, `title` de rutas).

    - **Los segmentos de ruta van en inglés**, y con ellos la carpeta del dominio, que es el mismo árbol (regla 9): `features/partners/` → `/partners`, `features/corporate/` → `/corporate`, `features/contact/` → `/contact`. Nada de `/estudios`, `/empresas` ni `/contacto`.
    - **La etiqueta del menú NO es la ruta.** El texto que ve el usuario es copy de producto y va en español, así que lo normal es que no coincidan: «Para partners» abre `/partners` y «Para empresas», `/corporate`. Se escriben en `core/constants/navigation.constants.ts`, cada uno en su campo (`label` y `path`).
    - **Por qué la URL no sigue al idioma del copy:** la ruta la leen buscadores, enlaces compartidos y el propio código (`routerLink`, `loadChildren`, los nombres de los chunks). Mezclar idiomas ahí deja rutas que nadie adivina y obliga a traducir el enrutado cada vez que cambia el copy. El copy cambia; la URL, una vez publicada, ya no.
    - **Cambiar una ruta publicada rompe los enlaces de fuera.** Cuando el sitio esté en producción, un cambio así lleva su redirección 301 desde la ruta vieja; mientras no lo esté, se renombra y ya.

13. **JSDoc obligatorio en API pública.** Toda clase, método público, función exportada y propiedad pública lleva JSDoc breve en inglés (qué hace; `@param`/`@returns` solo si el nombre no lo hace obvio). Sin fecha ni autor en los comentarios: esa trazabilidad la da Git (`git blame`), y los metadatos manuales se desactualizan.

14. **`computed` para derivar, `effect()` solo para el mundo exterior.** Estado derivado de otros signals → `computed`. `effect()` únicamente para sincronizar con el exterior (DOM, logging); nunca para actualizar otros signals dentro de un `effect`.

15. **`track` estable en `@for`.** Siempre por `id` (u otra clave única del dato). `$index` solo en listas estáticas sin identidad propia.

16. **Imágenes con `NgOptimizedImage`.** Imágenes de contenido con `ngSrc` + `width`/`height` (o `fill`), y `priority` en la imagen LCP de cada página.

17. **Constantes con nombre.** Prohibidos números y strings mágicos repetidos (límites, regex, rutas de assets). Viven en `core/constants/`.

18. **Sin secretos en el repo.** Nada sensible (tokens, claves, credenciales) en `environment.ts` ni en ningún archivo commiteado. Los environments solo llevan URLs y flags públicos.

19. **Un archivo por responsabilidad: JAMÁS `template` ni `styles` inline.** Todo componente, sin excepción y sin importar lo corto que sea el marcado, se escribe en archivos hermanos con el mismo nombre base:
    - `<name>.ts` → SOLO lógica: decorador, `input`/`output`, signals, `computed`, handlers, `inject()`.
    - `<name>.html` → SOLO lo visual, referenciado con `templateUrl: './<name>.html'`.
    - `<name>.css` → SOLO estilos, referenciado con `styleUrl: './<name>.css'`. Este archivo normalmente NO existe: los estilos son utilidades Tailwind en el HTML y tokens del tema en `styles.css`, y `CLAUDE.md` solo admite CSS por componente como excepción mínima justificada. Cuando esa excepción se da, va en el `.css`; nunca en `styles: []` ni en `style="..."`.

    Prohibidas las propiedades `template:` y `styles:` del decorador `@Component`. No hay umbral de "es una sola línea": un `template: '<app-status-badge />'` también se extrae a su `.html`. Motivo: un `.html` real da al editor y a las herramientas (Prettier con `prettier-plugin-tailwindcss`, resaltado, Angular Language Service) el lenguaje correcto, cosa que un template string no garantiza; y deja el `.ts` legible como lo que es, la lógica del componente. Al generar con `ng g c` NO usar `--inline-template` ni `--inline-style`.

20. **`if` de una sola sentencia, sin llaves.** Si el cuerpo del `if` es UNA sola sentencia, va sin llaves; con dos o más, o si hay `else`, llaves siempre.

    ```ts
    // Bien
    if (!plans.length) return null;

    // Mal
    if (!plans.length) {
    	return null;
    }
    ```

    - **Prettier decide el salto de línea, no tú.** Con `printWidth: 150`, Prettier colapsa el `if` sin llaves a una sola línea cuando cabe, y solo lo parte en dos si se pasa de 150. No escribas la forma de dos líneas a mano esperando que se quede: `npm run format` y el pre-commit la van a juntar. Esto es la regla general de `CLAUDE.md` — el formato lo manda Prettier.
    - **Con `else`, llaves.** `if (a) x; else y;` es legal pero se lee mal y arrastra el problema del `else` colgante; en cuanto hay `else`, el bloque completo lleva llaves.
    - **Un `if` anidado dentro de otro `if` mantiene llaves** aunque sea la única sentencia, por el mismo motivo.
    - Aplica igual a `for` / `while` con una sola sentencia (`if (value === '') continue;`).

21. **Los tipos del dominio se reparten por CONSTRUCTO, no por entidad.** No existe `core/models/` ni ningún archivo `.model.ts`. Cada símbolo vive en la carpeta que corresponde a cómo está escrito:

    | Constructo                            | Carpeta            | Archivo                  | Ejemplo                      |
    | ------------------------------------- | ------------------ | ------------------------ | ---------------------------- |
    | `interface`                           | `core/interfaces/` | `<dominio>.interface.ts` | `Plan`, `FaqItem`            |
    | `type` (unión, alias, tupla, mapeado) | `core/types/`      | `<dominio>.type.ts`      | `PlanPeriod`, `SubmitStatus` |
    | `const` (valor en runtime)            | `core/constants/`  | `<dominio>.constants.ts` | `PLANS`, `NAV_LINKS`         |
    - **Un archivo no mezcla constructos.** Un `.interface.ts` contiene solo `interface`; un `.type.ts` solo `type`. Si `plan` necesita ambos, son dos archivos: `interfaces/plan.interface.ts` + `types/plan.type.ts`. El nombre del archivo promete un constructo y tiene que cumplirlo.
    - **Un dominio sin interfaces no tiene `.interface.ts`.** `SubmitStatus` es una unión y nada más, así que existe `types/form.type.ts` y NO existe `interfaces/form.interface.ts`. No se crean archivos vacíos por simetría.
    - **Qué constructo toca en cada caso** (esto es TypeScript, no una preferencia del proyecto):
        - Forma de un objeto, sobre todo si algo la extiende → `interface`. Admite `extends` y da errores de compilación más legibles.
        - Unión (`'monthly' | 'yearly'`), intersección, tupla, tipo mapeado o condicional, alias de otro tipo → `type`. Una unión NO se puede expresar con `interface`.
        - Un alias que no añade nada (`type PlanList = readonly Plan[]`) se queda como `type`: convertirlo a una `interface` vacía rompe el lint por `no-empty-object-type`, que viene activa en `tseslint.configs.stylistic`.
    - **Imports entre las tres carpetas con alias** (`@core/interfaces/...`, `@core/types/...`, `@core/constants/...`); dentro de la misma carpeta, ruta relativa (`./plan.interface`).
    - **Contexto de la decisión, para que no se re-abra:** `interfaces/` y `types/` nombran el MECANISMO de TypeScript, mientras que otras carpetas de `core/` nombran el ROL de la pieza. Es una inconsistencia deliberada, elegida a sabiendas: el precio es que un dominio se lee en dos archivos y que el reparto lo decide el constructo y no el significado. No "arreglar" esto volviendo a `models/` sin hablarlo con el usuario.

22. **Todo miembro `private` empieza por `_`.** Propiedades, signals y métodos: si llevan el modificador `private`, el nombre empieza por guion bajo. El `_` va detrás del modificador, no delante.

    ```ts
    export class PlansSection {
    	private readonly _period = signal<PlanPeriod>('monthly');

    	/** Plans to show, already filtered by the selected period. */
    	protected readonly plans = computed(() => PLANS.filter((plan) => plan.period === this._period()));

    	/** Switches the period the prices are shown for. */
    	protected selectPeriod(period: PlanPeriod): void {
    		this._period.set(period);
    	}
    }
    ```

    - **Solo `private`.** Un miembro `public` o `protected` NUNCA lleva `_`. La plantilla lee los `protected` (`plans`, `status`), y un `_` ahí se colaría en el HTML, que es lo que el usuario acaba viendo escrito. El `_` es exactamente la marca de "esto no sale de la clase".
    - **Por eso el `_` es útil aquí:** en un componente Angular conviven los tres niveles, y el prefijo dice de un vistazo, en el punto de uso (`this._period` vs `this.plans`), si algo lo consume la plantilla o solo la clase — sin subir a la declaración a mirar el modificador.
    - Las constantes de módulo no llevan `_`: no son miembros de la clase, son del archivo.
    - Con `private` del modificador basta: **no se usan campos `#private` nativos**, y por tanto no se mezclan las dos formas.
    - Si un `private` pasa a `protected` porque la plantilla necesita leerlo, se le quita el `_` en el mismo cambio; quedan prohibidos los `protected _foo`.
    - **La vigila ESLint** (`@typescript-eslint/naming-convention` en `eslint.config.js`): `private` exige `_`, `public` y `protected` lo prohíben. No es solo convención de revisión, el pre-commit la bloquea.

23. **Todo `<form>` lleva `[formRoot]` y escucha `(submit)`. JAMÁS `(ngSubmit)`.**

    ```html
    <!-- Bien -->
    <form [formRoot]="contactForm" (submit)="onSubmit()">
    	<input id="email" [formField]="contactForm.email" />
    	<button type="submit">Enviar</button>
    </form>

    <!-- Mal: onSubmit() no se ejecuta NUNCA y el navegador recarga la página -->
    <form (ngSubmit)="onSubmit()"></form>
    ```

    ```ts
    // Las dos directivas van juntas en el imports del componente.
    imports: [FormField, FormRoot];
    ```

    - **`(ngSubmit)` es un output de `NgForm`, que vive en `FormsModule`**, y este proyecto usa Signal Forms y no lo importa (ni debe: arrastra `ngModel`, prohibido en `CLAUDE.md`). Sin esa directiva sobre el `<form>`, `(ngSubmit)` no lo escucha nadie: Angular lo registra como un evento del DOM llamado `ngSubmit` que no se dispara jamás.
    - **Lo que pasa entonces no es "no hace nada", es peor:** al no ejecutarse el handler, nadie llama a `preventDefault()`, así que el navegador envía el formulario por su cuenta. La página **se recarga entera con los campos en la query string** — y de ahí al historial y a los logs de cualquier proxy. Se lee como "la app me rechaza y me reinicia".
    - **`FormRoot` (`form[formRoot]`, de `@angular/forms/signals`) es la pieza que ata el `<form>` al field tree:** pone `novalidate` (desactiva la validación del navegador, que ya hace el schema), escucha `submit` y hace el `preventDefault()`. Es lo único que impide el envío nativo.
    - **`(submit)` sigue haciendo falta además de `[formRoot]`.** `FormRoot` solo llama al envío por su cuenta si el field tree se creó con opciones de envío (`form(model, schema, { submit })`). Si el envío lo lleva el componente en su `onSubmit()`, `FormRoot` está por el `preventDefault()` y `(submit)` por llamar al handler.
    - **El `submit()` de `@angular/forms/signals` que se usa dentro de `onSubmit()` es otra cosa** y no salva de esto: gobierna el estado del formulario (validación, `submitting`), no el evento del DOM. Tenerlo no evita el envío nativo.
    - **Ninguna herramienta detecta este error.** Un `(ngSubmit)` sobre un `<form>` sin `NgForm` compila, pasa `npm run lint`, pasa `npm run test` y pasa `build:prod` — Angular no puede saber que ese evento no lo emite nadie. Solo se ve abriendo la pantalla y pulsando el botón. Por eso la regla es dura y por eso `SETUP.md` §18 exige probar un formulario de verdad antes de dar por bueno el setup.

## Regla del agente añadida después

> Esta regla es del bloque del agente, igual que la 24, pero va al final del archivo y con el número 25 por el mismo motivo: renumerar rompería todas las referencias cruzadas de `CLAUDE.md` y de los documentos ya escritos.

25. **NUNCA borrar un archivo que no esté versionado en git sin preguntar antes.** Si `git status` lo muestra como `??`, o si `git ls-files --error-unmatch <archivo>` falla, ese archivo **solo existe en este disco**: no hay commit del que recuperarlo, no hay `git checkout` que lo devuelva y `git restore` no sirve de nada. Borrarlo es una pérdida definitiva.

    - **Aplica aunque el borrado sea la tarea encargada.** Una instrucción del tipo «borra los originales después de convertirlos» autoriza el borrado, no autoriza perder el único ejemplar: primero se comprueba qué está versionado, y de lo que no lo esté se avisa ANTES de tocar nada.
    - **Aplica también a mover y renombrar**, porque el resultado es el mismo si el destino se pisa o se equivoca: del origen no queda copia.
    - **Comprobación obligatoria antes de cualquier borrado en lote:**

        ```bash
        # Lista lo que se va a borrar y que NO está en git: si imprime algo, hay que preguntar.
        git ls-files --others --exclude-standard -- <ruta>
        ```

    - **De dónde sale esta regla:** en las correcciones SEO (`docs/cambios/2026-09-20-correcciones-seo.md`) se convirtieron 31 imágenes a WebP y se borraron los JPG originales. Trece de ellos —todo `public/imgs/corporate/` y `public/imgs/partners/`— **no estaban commiteados**, así que se perdieron los únicos másteres a resolución completa que había en el repositorio. La web no se rompió, porque los WebP conservan el contenido al tamaño en que se usa, pero ya no se pueden volver a derivar desde aquí. Una de ellas, `partners/hero-movil`, se quedó a un tamaño equivocado justamente porque no había original al que volver.
    - **Lo prudente cuando llegue material nuevo:** commitear los originales ANTES de procesarlos. Un archivo sin seguimiento no es un archivo guardado.
