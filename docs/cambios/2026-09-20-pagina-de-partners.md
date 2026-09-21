# Página de Partners

Encargo: maquetar `/partners` **exactamente igual que las capturas** de `docs/disenos/` (siete de escritorio y seis de móvil), con la misma estructura de carpetas y componentes que el Home, y sin tocar el header ni el footer.

## Lo que hay ahora

Seis secciones, cada una en su componente, igual que el Home:

| Sección                         | Componente                    | Fondo            |
| ------------------------------- | ----------------------------- | ---------------- |
| Hero «Movia para Estudios»      | `partners-hero-section`       | Carbón + foto    |
| «¿Cuánto puedes crecer…?»       | `partners-growth-section`     | Blanco           |
| «La solución: Movia llena…»     | `partners-solution-section`   | `surface-muted`  |
| «Riesgo Cero. Solo Ganas»       | `partners-guarantees-section` | Blanco           |
| «¿Cómo Funciona En Tu Estudio?» | `partners-steps-section`      | Carbón           |
| «Convierte tus spots…»          | `partners-cta-section`        | Sin fondo propio |

Contenido tipado en `core/interfaces/partners.interface.ts` y `core/constants/partners.constants.ts`. Los cuatro pasos del check-in reutilizan `HowToStep` del Home: es el mismo paso numerado en un círculo lima y una segunda interfaz idéntica sería la forma duplicada que prohíbe `CLAUDE.md`.

## Cómo se midió

Mismo método que el barrido del Home (`2026-09-20-ajuste-fiel-al-diseno.md`): la captura tiene 2992 px para un frame de 1920, así que **1 px de imagen = 0,6417 px de diseño**, y el CSS es el diseño **× 0,8**. Las capturas de móvil van a escala 1:1 sobre un frame de **440 px** (2 px de imagen por px CSS), así que esta vez el móvil SÍ se pudo medir, al contrario que en el Home.

Comprobación a 1536 px de ancho, altura de sección medida contra el diseño:

| Sección       | Diseño (× 0,8) | Implementado |
| ------------- | -------------- | ------------ |
| Hero          | 719            | 716          |
| Solución      | 907            | 903          |
| Riesgo Cero   | 500            | 499          |
| Cómo funciona | 802            | 806          |
| Tarjeta CTA   | 320            | 326          |

Y a 440 px: hero 812 contra 809,5 del diseño; tarjeta CTA 457 contra 456,5.

## Los tres montajes entre secciones

El diseño encadena tres solapamientos; los tres se hacen con el mismo patrón que ya usa el Home (margen negativo + `z-10`, porque la sección siguiente pinta su fondo encima de lo que no está posicionado):

1. **Las tarjetas lima** de «¿Cuánto puedes crecer?» cruzan hacia abajo la banda gris: la banda empieza 94 px de diseño por debajo del borde superior de las tarjetas, o sea 206 antes de que acaben.
2. **La foto del corredor** pertenece a «Riesgo Cero» pero sube 127 px de diseño sobre la banda gris. El margen negativo vale el padding de la sección **más** esos 127: si solo vale 127, el padding se lo come y la foto no cruza.
3. ~~**La tarjeta lima del cierre** sube 188 px de diseño sobre la banda carbón y termina sobre el blanco.~~ **Retirado por decisión del encargo:** el cierre ya no es una tarjeta montada, es una **banda lima a sangre** que ocupa la sección entera, sin contenedor centrado, sin radio y sin hueco por arriba ni por abajo. Con ella, la banda carbón de «¿Cómo funciona?» pierde el padding inferior gigante que existía solo para hacerle sitio (de 17,8rem a 8,4rem en escritorio).

## El contenedor: `--container-content` valía 1440 y ahora vale 1196,8

El diseño centra el contenido en **1416 px** sobre el frame de 1920 (medido en las tarjetas lima: de 252,8 a 1667,2). Con el factor 0,8 eso son **(1416 + 2 × 40) × 0,8 = 1196,8 px = 74,8rem**, que es justo la fórmula escrita en el comentario de `--container-content`… pero el token valía **90rem (1440 px)**, el ancho del diseño **sin** el 0,8.

La consecuencia se veía a simple vista: el contenido salía más ancho que el header (1440 contra 1328) cuando en el diseño pasa lo contrario (1416 contra 1580). Se ha corregido el token a **74,8rem**, así que lo usan por igual el Home, Partners y el resto de páginas: un único contenedor de contenido para todo el sitio. `--container-wide` (header y footer) no se toca, ya cumplía su fórmula.

### Lo que eso movió en el Home

El Home se estrechó 243 px y se repasó sección por sección a 1536 px. No hay desbordes (ni un solo elemento se sale del viewport) y dos cosas quedan **más cerca** del diseño que antes: las tarjetas del hero (hueco de 80,8 px, que es el 101 del diseño × 0,8) y el bloque de texto de «Así es como Movia transforma…» (667 px, contra los 696 del diseño; antes eran 910).

El único arreglo necesario fue el **cierre del Home**: la foto de la persona medía `44.5vw` dentro de una rejilla de dos columnas iguales, y al estrecharse el contenedor se salía 106 px del contenedor por la derecha. Ahora la rejilla es `[1fr_60.3%]` y la foto va a `w-full`: 60,3 % de 1416 son los 854 px que mide en el diseño, así que el mismo ancho de antes (683 px a 1536) queda dentro del contenedor y deja de depender del viewport.

Queda una diferencia sin tocar, y es deliberada: la composición de móviles de «Así es como Movia…» ahora termina en el borde del contenedor, mientras que en el diseño sangra casi hasta el borde de la ventana (1910 de 1920). Se deja así porque llevarla al borde es rediseñar esa sección y las capturas del Home ya no están en el repo para comprobarlo.

## Tipografía: dónde manda la medida y dónde manda el salto de línea

La fuente del prototipo es más estrecha que Inter / Plus Jakarta Sans (~8 % en el cuerpo, más en textos largos). Con el mismo tamaño en px, las líneas rompen antes. Para cada texto se calculó el tamaño que **reproduce el ancho renderizado** del diseño, midiendo la cadena real con `canvas.measureText`:

| Texto                         | Por altura de mayúscula | Por ancho renderizado | Usado          |
| ----------------------------- | ----------------------- | --------------------- | -------------- |
| Titulares de sección          | 57,6                    | 54,5 – 59,8           | `text-display` |
| Entradilla de «¿Cuánto…?»     | ~18                     | 19,3                  | 19,2 px        |
| Párrafo de «La solución»      | 25,6                    | 23,8                  | 24 px          |
| Título de la lista de flechas | 32                      | 31,9                  | 32 px          |
| Cuerpo de «Riesgo Cero»       | 18                      | 15,2                  | 16 px          |
| Titular de la tarjeta CTA     | 51,2                    | 45,5                  | 45,6 px        |

Donde las dos medidas coinciden, no hay debate. Donde no, manda el salto de línea: un titular que cae en dos líneas cuando en la captura cae en una se ve muchísimo más que un 10 % de tamaño.

Aun así quedan tres roturas que no se pueden igualar sin cambiar de fuente, y se dejan a propósito: «Sin contrato» y «Tú controlas» van en una línea y el diseño las parte en dos, y la descripción de la primera tarjeta lima parte por otra palabra.

## Otros detalles del barrido

- **El velo del hero es del 80 %**, no del 65 % del Home. Sale de comparar la captura con la foto entregada punto a punto (`0,8 × carbón + 0,2 × foto`), no de una corrección de contraste a ojo.
- **El `<br>` del H1 solo existe en escritorio** (`hidden lg:inline`): en móvil el diseño parte el titular en tres líneas por ancho, no por el salto.
- **La foto pequeña de «¿Cómo funciona?» se sale del contenedor por la derecha**, como en el diseño; va absoluta contra la grande, con porcentajes, para que el gesto se conserve a cualquier ancho.
- **Las fotos se renombraron** de `public/imgs/Partners/` (con mayúsculas, espacios y acentos: `Cómo funciona.jpg`, `La-solución.jpg`) a `public/imgs/partners/` en kebab-case sin acentos, como las del Home. Un acento en una ruta acaba escapado en el HTML y roto en algún sistema de ficheros. Se borró `Flecha dirección.svg`, que es byte a byte el `iconos/flecha-diagonal.svg` que ya existía.

## Lo que queda abierto

- **La sangría de los móviles en el Home** (ver arriba): hoy terminan en el borde del contenedor y el diseño los lleva casi al borde de la ventana.
- **El titular del cierre dice «spots vacios» en el diseño, sin tilde.** Se ha escrito «vacíos», que es lo correcto y lo que usa el otro titular de la misma página. Si el copy tiene que ir literal, es una palabra en `partners-cta-section.html`.
- **Los dos botones abren `partner.moviapass.com`** en otra pestaña, no una ruta de la landing: el alta de partners vive en ese portal.
- **Peso de las imágenes**: las seis fotos de Partners suman ~2,5 MB sin optimizar, igual que las del Home.
