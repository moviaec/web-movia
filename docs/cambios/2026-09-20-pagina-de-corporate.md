# Página de Corporate

Encargo: maquetar `/corporate` **exactamente igual que las capturas** de `docs/disenos/` (ocho de escritorio y diez de móvil), con la misma estructura que Home y Partners, y sin tocar el header ni el footer.

## Lo que hay ahora

Seis secciones, cada una en su componente:

| Sección                         | Componente                     | Fondo                          |
| ------------------------------- | ------------------------------ | ------------------------------ |
| Hero «Movia para Empresas»      | `corporate-hero-section`       | Carbón + foto                  |
| «Cómo funciona el modelo 50/50» | `corporate-model-section`      | Blanco                         |
| «Beneficios que te ofrece…»     | `corporate-benefits-section`   | Carbón con banda blanca arriba |
| «¿Por qué Movia?»               | `corporate-reasons-section`    | `surface-shade`                |
| «¿Cómo Empezar?»                | `corporate-onboarding-section` | Blanco                         |
| «Invierte ~$22K…»               | `corporate-cta-section`        | `surface-shade`                |

Contenido tipado en `core/interfaces/corporate.interface.ts` y `core/constants/corporate.constants.ts`. Las listas con check usan Heroicons vía `@ng-icons` (`heroCheckCircle`), que es lo que manda `CLAUDE.md` para iconos que no son de marca; las flechas diagonales siguen siendo la máscara CSS que ya existía.

## Comprobación a 1536 px

| Sección        | Diseño (× 0,8) | Implementado |
| -------------- | -------------- | ------------ |
| Hero           | 714,6          | 715          |
| Beneficios     | 1215,8         | 1234         |
| ¿Por qué…?     | 627,3          | 627          |
| ¿Cómo Empezar? | 828,6          | 837          |
| Tarjeta CTA    | 318,4          | 314          |

Y las roturas de línea de las cuatro tarjetas lima, de las dos listas de beneficios y de las cuatro columnas de «¿Cómo Empezar?» caen palabra por palabra donde caen en las capturas.

## La banda blanca de «Beneficios»: por qué la pinta la rejilla

El corte entre el blanco y el carbón cae **justo donde acaban las fotos y empiezan las tarjetas**. Se podría poner una altura fija, pero se descuadra en cuanto un texto rompe en otra línea o cambia el ancho de la ventana.

En su lugar la banda es **un elemento más de la rejilla**, colocado en las filas que tiene que cubrir (`row-start-1 row-end-5`, y `lg:row-end-3` en escritorio), sangrado a todo el ancho con `-mx-[calc(50vw-50%)]` y mandado detrás con `z-[-1]`. Son las filas las que mandan, así que el corte sigue a las fotos hagan lo que hagan. Tres cosas hubo que aprender por el camino:

1. **La sección necesita `isolate`.** Sin contexto de apilamiento propio, un hijo con `z-index: -1` se va por detrás del fondo de la sección y desaparece.
2. **Un elemento de rejilla colocado explícitamente BLOQUEA esas celdas.** Con la banda ocupando cuatro filas, la colocación automática empujaba las fotos y las tarjetas a filas —y en móvil a columnas— inventadas. Por eso ahora **todos** los elementos llevan `col-start`/`row-start` explícitos: con colocación explícita sí se permite el solape.
3. **`w-screen` + `left-1/2 -translate-x-1/2` no sirvió**: el `translate` no compensaba el `left` y la banda se iba 196 px a la derecha. El sangrado con margen negativo (`-mx-[calc(50vw-50%)]`) es determinista, y la sección lleva `overflow-x-clip` para que la barra de scroll no cause desplazamiento horizontal.

**El cierre va a sangre.** En el diseño la tarjeta lima deja unos 124 px de margen a cada lado; por decisión del encargo aquí ocupa todo el ancho de la ventana (1536 contra los 1289 del diseño), conservando el radio para que se siga leyendo como tarjeta. El montaje de 147 px sobre «¿Cómo Empezar?» no cambia.

El resto de montajes son el patrón de siempre (margen negativo que vale el padding de la sección **más** el montaje, y `z-10`): la foto del modelo 50/50 sube 69 px sobre el hero, la foto grande de «¿Por qué Movia?» sube 124 px sobre la banda carbón y la tarjeta del cierre sube 147 px sobre «¿Cómo Empezar?» (322 px en móvil).

## Tipografía: la página NO usa una sola escala de titulares

A diferencia de Partners, aquí cada titular mide algo distinto, así que se midió uno por uno con el método del ancho renderizado (`canvas.measureText` sobre la cadena real, comparado con lo que mide en la captura):

| Titular            | CSS                    |
| ------------------ | ---------------------- |
| H1 del hero        | 54,4                   |
| «Cómo funciona…»   | 52,8                   |
| «Beneficios que…»  | 38,4 (`text-headline`) |
| Cita               | 55,2                   |
| «¿Por qué Movia?»  | 38,4 (`text-headline`) |
| «¿Cómo Empezar?»   | 51,2                   |
| Tarjeta del cierre | 44,8                   |

**La cita lleva `leading-[0.9]`**, y no es un error: en la captura las dos líneas miden 60,9 px de diseño de pitch con una letra de 69, o sea interlineado por debajo del tamaño de la fuente. Figma lo permite y el diseño lo usa; con el 1,27 que puse al principio la cita ocupaba 43 px más y se leía como otra cosa.

**Las listas de «Beneficios» van a 19,2 px y no a los 23 que mide el diseño.** Es el mismo caso de Partners —la fuente del prototipo es más estrecha que Inter— pero aquí el precio de no ajustarlo era una tarjeta 45 px más alta con dos líneas de más. A 19,2 px el recuento de líneas es exacto (7 y 8, como el diseño) y el bloque cae en su sitio.

## Un lima nuevo: `--brand-lime-deep`

Los checks de «¿Cómo Empezar?» **no son el lima de marca**. Muestreando la captura y convirtiendo de Display P3 a sRGB salen **#bee70d**, mientras que las tarjetas lima de la misma captura dan #d3f443 —que es exactamente `--brand-lime`, y eso valida la conversión—. No es el lima con opacidad ni mezclado con negro: el azul baja de 66 a 13, y eso no sale de ninguna mezcla con los colores que ya había. Así que es un valor crudo más, mapeado a `--color-primary-shade`, en paralelo a `--color-secondary-shade` que ya existía.

Miden **51,2 px** en escritorio y 39,5 en móvil (64,2 y 39,5 de diseño), bastante más que el resto de iconos de la página.

**Los checks de «Beneficios» NO llevan ese verde**: en la captura son carbón y así se quedan. Lo que sí se corrigió es su alineación —van centrados con la PRIMERA línea de su texto, con un margen superior que vale la mitad de lo que sobra entre el alto de línea y el icono: (36 − 16,8) / 2 en escritorio y (24 − 16,8) / 2 en móvil—, porque sin eso el icono se pega al borde de la caja de línea y queda visiblemente más alto que el texto.

**El color va por `--ng-icon__color`, no por `text-*`.** El host de `<ng-icon>` pinta con esa variable y una utilidad de color de Tailwind no le llega; con `text-primary` el check salía en tinta. Se escribe como propiedad arbitraria (`[--ng-icon__color:var(--color-primary-shade)]`), así que el valor sigue viniendo de un token del tema.

## Lo que queda abierto

- **La foto del modelo 50/50 no está en el diseño de móvil**, así que va `hidden lg:block` y `modelo-movil.jpg` (el recorte apaisado que venía en la entrega) se queda **sin usar**. Si se quiere en móvil, es un `<picture>` de tres líneas.
- **Los dos botones abren `corporate.moviapass.com`** en otra pestaña, igual que los de Partners abren el portal de partners.
- **Dos erratas del diseño que NO se han copiado**: «La desición más rentable» (se escribe «decisión») y el «(no hay pago ndividual al empleado)» del móvil.
- **Peso de las imágenes**: las siete fotos suman ~1,4 MB sin optimizar.
