# Home completo: las nueve secciones del diseño

La página Home maquetada entera, desktop y móvil, a partir de las 23 capturas del prototipo. **No se ha creado ninguna imagen** y **no se ha hecho push**.

---

## De dónde salió cada sección

Las capturas están en `docs/disenos/` (23 archivos; la ruta `docs/diseno/` del encargo no existe). Reparto real: **las diez primeras son el Home en desktop** (5.50.34 → 5.51.10) y **las trece siguientes, el mismo Home en móvil** (5.51.16 → 5.51.52). Nada de Estudios, Empresas ni Planes.

| #   | Sección                                                                       | Componente                | Fondo                |
| --- | ----------------------------------------------------------------------------- | ------------------------- | -------------------- |
| 1   | Hero «Move Freely. Belong Everywhere.» + las tres tarjetas                    | `home-hero-section`       | Foto oscura → blanco |
| 2   | «Así Es Como Movia Transforma La Manera En Que Te Mueves» (4 pasos + mockups) | `home-steps-section`      | Blanco               |
| 3   | «Categorías de actividades» (tira de fotos + «Ver todas»)                     | `home-categories-section` | Blanco → carbón      |
| 4   | «Variedad sin límites» (3 razones)                                            | `home-benefits-section`   | Carbón               |
| 5   | «Encuentra tu club más cercano» (mapa + «Encontrar»)                          | `home-map-section`        | Mapa oscuro          |
| 6   | «Movia para Estudios» (foto + 4 tarjetas lima)                                | `home-studios-section`    | Blanco               |
| 7   | «Movia para Empresas» (4 ventajas + foto)                                     | `home-companies-section`  | Mist                 |
| 8   | «¿Tienes preguntas?» (acordeón de 6)                                          | `home-faq-section`        | Blanco               |
| 9   | «Muévete con Movia» (cierre)                                                  | `home-cta-section`        | Lima                 |

Cada una cumple los criterios de extracción de la regla 7 (estado propio, o más de 60 líneas de plantilla), así que ninguna se quedó suelta en `home.html`, que es solo la composición de las nueve.

## Decisiones de maquetación que conviene conocer

- **Las tres tarjetas del hero van montadas sobre la foto** con un margen negativo. Necesitaron `relative z-10`: el `<section>` del hero está posicionado y, sin eso, pintaba por encima de las tarjetas y se comían la mitad superior. Se vio en el navegador, no en el build.
- **La tira de categorías es scroll horizontal con `snap` en móvil** (como el diseño, que deja asomar la foto anterior y la siguiente) y **rejilla de cinco columnas escalonada en desktop**, con la del centro más alta.
- **La FAQ se rellena por columnas en desktop** (`grid-flow-col` + `grid-rows-3`), que es como está en el diseño: 1-2-3 a la izquierda y 4-5-6 a la derecha. Con el relleno por filas que trae Tailwind por defecto salían intercaladas.
- **El acordeón abre uno cada vez** y arranca con todos cerrados, que es como aparece en el diseño. Es un `<button>` con `aria-expanded` y `aria-controls` sobre un `<h3>`, no un `<details>`, para poder animar la flecha y controlar el estado con un signal.
- **Los fondos van por sección, no en el `body`.** Así la landing sale con el lienzo blanco del diseño sin tocar `--color-surface-muted`, que sigue pendiente de tu visto bueno desde el informe anterior.
- **Iconos genéricos con `@ng-icons/heroicons`** (flecha ↗ de las tarjetas, → de los botones, ↓ de la FAQ y el check de las tarjetas lima). Estaba declarado en `package.json` sin usar desde el primer día; ahora se usa, y evita ocho imágenes rotas más.

## Contenido

Todos los textos están tipados en `core/constants/home.constants.ts`, con sus interfaces en `core/interfaces/home.interface.ts`. En las plantillas no hay ni una frase suelta, así que cambiar el copy es tocar un archivo.

**Las respuestas de la FAQ son PROVISIONALES y las escribí yo.** El diseño enseña los seis acordeones cerrados, así que ese texto no existe en ninguna parte. Están marcadas con un comentario en el archivo de constantes. Son seis párrafos cortos y coherentes con lo que la propia página cuenta, pero hay que sustituirlos por el copy real:

| Pregunta                              | Respuesta provisional                                                    |
| ------------------------------------- | ------------------------------------------------------------------------ |
| ¿Qué es un check-in?                  | Cada visita a un centro aliado; se escanea el QR y se descuenta del plan |
| ¿Puedo ir a distintos gimnasios?      | Sí, cualquier centro de la red con la misma suscripción                  |
| ¿Qué pasa si uso todos mis check-ins? | Esperar a la renovación o subir de plan desde la app                     |
| ¿Hay permanencia o contratos largos?  | No: mensual y cancelable cuando quieras                                  |
| ¿Los precios incluyen impuestos?      | Sí, el precio de los planes es el final                                  |
| ¿Qué pasa si cancelo una clase?       | Cancelando con antelación no se consume el check-in                      |

Otro texto que falta: **«Con Movia accedes a ocho categorías»**, pero el diseño solo enseña **cinco fotos**. He puesto las cinco que hay; faltan tres por definir.

## Imágenes que faltan

Ninguna existe. El marcado las referencia por su ruta y el build las sirve rotas **a propósito**.

| Ruta en el código                           | Qué es                                                                                      | Formato | Tamaño aprox. | Dónde                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------- | ------------- | -------------------------------------------------- |
| `/imgs/home/hero.jpg`                       | Foto de fondo del hero: tres personas entrenando, tratada en oscuro                         | JPG     | 1920 × 900    | Sección 1. **Es la imagen LCP**: va con `priority` |
| `/imgs/home/app-mockups.png`                | Dos móviles con la app (plan activo y mapa), con transparencia                              | PNG     | ~640 × 700    | Sección 2                                          |
| `/imgs/home/categorias/artes-marciales.jpg` | Foto de artes marciales                                                                     | JPG     | ~320 × 420    | Sección 3                                          |
| `/imgs/home/categorias/gimnasio.jpg`        | Foto de gimnasio                                                                            | JPG     | ~320 × 420    | Sección 3                                          |
| `/imgs/home/categorias/yoga.jpg`            | Foto de yoga                                                                                | JPG     | ~320 × 420    | Sección 3, la del centro (más alta en desktop)     |
| `/imgs/home/categorias/natacion.jpg`        | Foto de natación                                                                            | JPG     | ~320 × 420    | Sección 3                                          |
| `/imgs/home/categorias/danza.jpg`           | Foto de danza                                                                               | JPG     | ~320 × 420    | Sección 3                                          |
| `/imgs/icons/flexibilidad.svg`              | Icono lima de línea: dobles chevrones `»`                                                   | SVG     | 48 × 48       | Sección 4                                          |
| `/imgs/icons/descubrimiento.svg`            | Icono lima de línea: brújula en círculo                                                     | SVG     | 48 × 48       | Sección 4                                          |
| `/imgs/icons/simplicidad.svg`               | Icono lima de línea: pulgar arriba                                                          | SVG     | 48 × 48       | Sección 4                                          |
| `/imgs/home/mapa.png`                       | Mapa oscuro de Quito con los pines lima de Movía                                            | PNG     | 1920 × 900    | Sección 5, de fondo                                |
| `/imgs/home/estudios.jpg`                   | Entrenador con tablilla en un gimnasio                                                      | JPG     | ~460 × 520    | Sección 6                                          |
| `/imgs/home/empresas.jpg`                   | Dos compañeros chocando las manos                                                           | JPG     | ~600 × 740    | Sección 7                                          |
| `/imgs/home/cta-persona.png`                | Persona con los brazos abiertos, **recortada con transparencia** (se sale de la banda lima) | PNG     | ~760 × 700    | Sección 9                                          |

Siguen faltando las ocho del informe anterior (logo, badges de tienda e iconos de redes), que no se repiten aquí.

Dos avisos sobre estas:

- **Los tres iconos de la sección 4 son un set con el mismo trazo**, por eso se referencian como SVG en vez de tirar de Heroicons: la brújula no existe en Heroicons y mezclar rompería la coherencia. Si prefieres Heroicons, `heroChevronDoubleRight` y `heroHandThumbUp` valen para el primero y el tercero, y habría que buscar sustituto para el segundo.
- **`hero.jpg` y `cta-persona.png` piden recorte con transparencia** o un tratamiento concreto (la foto del hero va oscurecida al 50 %, la del CTA se sale por arriba de la banda lima).

## Verificación

```
All files pass linting.
 Test Files  1 passed (1)
      Tests  1 passed (1)
Prerendered 4 static routes.
```

Las cuatro rutas siguen prerenderizándose y las nueve secciones viajan dentro del HTML estático de `/`:

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

```
app-home-hero-section         SÍ      app-home-studios-section    SÍ
app-home-steps-section        SÍ      app-home-companies-section  SÍ
app-home-categories-section   SÍ      app-home-faq-section        SÍ
app-home-benefits-section     SÍ      app-home-cta-section        SÍ
app-home-map-section          SÍ

<app-root ng-version="22.1.7" ngh="10" ng-server-context="ssg">
un <h1>, ocho <h2>, 23 <img> · index.html de 65 KB
```

### Comprobado en el navegador, y no solo en el build

Recorrí la página entera en **desktop (1440 px)** y en **móvil (375 px)**, contra el build de producción servido como estático:

- Hero, tarjetas montadas sobre la foto, pasos numerados, tira de categorías, banda oscura, mapa, las dos secciones de negocio, la FAQ y el cierre lima: todo en su sitio y en el orden del diseño.
- **El acordeón de la FAQ abre y cierra**, y la flecha gira.
- En móvil el menú del header sigue funcionando y las rejillas colapsan a una columna.
- **Consola limpia en producción**: los únicos errores son los 404 de las imágenes que no existen.

### Un error que solo pasa en `ng serve`

En el servidor de desarrollo aparece `ERROR NG0203: The InjectionToken ImageLoader token injection failed`. **En el build de producción no existe**: lo comprobé sirviendo `dist/` como estático y la consola sale sin un solo NG0203.

Es el prebundling de Vite, que al añadir `@ng-icons` se trae su propia copia de `@angular/core` y deja dos universos de inyección; `NgOptimizedImage` pide `IMAGE_LOADER` al que no es y falla. No afecta a lo que se despliega, pero **va a salir en la consola cada vez que trabajes en local**, así que mejor saber de dónde viene. Si molesta, se quita con un `optimizeDeps.exclude` en la configuración de Vite, y eso es tocar configuración: no lo he hecho.

## Peso del bundle

| Build                 | main (raw) | Total inicial (transferencia) | Chunk de home                   |
| --------------------- | ---------- | ----------------------------- | ------------------------------- |
| Antes (solo layout)   | 236.14 kB  | 67.81 kB                      | —                               |
| Ahora (Home completo) | 293.67 kB  | 84.90 kB                      | 24.68 kB (6.60 kB transferidos) |

Sube ~17 kB transferidos: `@ng-icons` entra por primera vez en el bundle y el CSS pasa de 2.18 a 4.17 kB por las utilidades nuevas. Sigue muy por debajo del presupuesto de 500 kB iniciales.

## Cosas que me llamaron la atención

1. **La errata «slubes» sigue ahí** (footer del diseño). En el código está escrito «clubes».
2. **El copy mezcla «Movia» y «Movía»**, con y sin tilde, dentro de la misma página: los titulares dicen «Movia para Estudios» y el cuerpo «empezar con Movia», mientras la marca del logo y el `<title>` llevan tilde. He respetado literalmente lo que pone cada texto del diseño, pero conviene unificarlo.
3. **«Ocho categorías» con cinco fotos** (arriba).
4. **Faltan los destinos reales de varios enlaces**: «Ver todas» lo he apuntado a `/planes`, «Encontrar» a `/estudios` y «Centro de ayuda» se queda en `href="#"`. El diseño no dice a dónde van.
5. **El header sigue con fondo carbón sólido.** En el diseño es transparente sobre el hero. Ahora que el Home existe se puede hacer bien (header `absolute` + hero con padding superior), pero eso obliga a que cada página declare si su primera sección es oscura, y prefiero que lo decidas tú.
6. **Los textos del hero están en inglés** («Move Freely. Belong Everywhere.») en una web en español. Es la línea de marca, así que la he dejado tal cual, pero sin `lang="en"` en ese bloque: si se quiere que un lector de pantalla lo pronuncie en inglés, hay que marcarlo.

## Confirmaciones

- **NO he creado ninguna imagen.** Ni fotos, ni iconos de marca, ni placeholders remotos, ni data-URIs, ni `<img>` comentados. Las 14 rutas de la tabla no existen en disco.
- **NO he hecho push.** ## main...origin/main [ahead 10] — `origin/main` sigue en `ece4cb7`.
