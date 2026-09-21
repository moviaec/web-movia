# Página de Planes

Encargo: maquetar `/plans` **exactamente igual que las capturas** de `docs/disenos/` (tres, todas de escritorio), con la misma estructura que el resto del sitio y sin tocar el header ni el footer.

## Lo que hay ahora

Es la primera página del sitio con **una sola sección**, así que el marcado vive en `plans.html` y no en un componente de sección: extraerlo dejaría la plantilla de la página con una única etiqueta y un nivel muerto de más (`RULES.md` regla 7, «ante la duda, no extraer»).

Contenido tipado en `core/interfaces/plan.interface.ts` y `core/constants/plans.constants.ts` (`PLANS`, `PLANS_FEATURED_BADGE`, `PLANS_LEGAL_NOTE`), que es justo el ejemplo que ya ponía `CLAUDE.md` al explicar el reparto por constructo.

## Comprobación a 1536 px

| Medida                         | Diseño (× 0,8)          | Implementado |
| ------------------------------ | ----------------------- | ------------ |
| Titular, primera línea         | 262,3 desde arriba      | 260          |
| Borde superior de las tarjetas | 453,3                   | 453          |
| Alto de tarjeta                | 420,5                   | 413          |
| Ancho de tarjeta               | 366,6                   | 363          |
| Letra pequeña (primera línea)  | 139,6 bajo las tarjetas | 134          |

Las tres tarjetas miden lo mismo y sus botones quedan a la misma altura: el botón lleva `mt-auto` en TODOS los anchos, no solo en escritorio.

**El hueco mínimo entre la última ventaja y el botón lo pone la lista, no el botón.** `mt-auto` reparte el espacio sobrante, pero cuando no sobra nada —una tarjeta con una ventaja que rompe en dos líneas, a partir de 1024 px— vale cero y el botón se pega al texto. Por eso el margen vive en el `mb` de la lista de ventajas, que se aplica siempre, y `mt-auto` solo añade lo que sobre.

Los checks de las ventajas van centrados con la PRIMERA línea (`items-start` + `mt-0.5`) y no con el alto total del elemento: en las ventajas de dos líneas, centrados quedaban flotando entre renglones.

## Los planes y su orden

Los precios y los check-ins son los reales; el resto del contenido (descripciones y ventajas) está redactado a partir de ellos.

| Plan       | Precio | Check-ins | Grupo                         |
| ---------- | ------ | --------- | ----------------------------- |
| Basic      | $39,99 | 8         | Individual                    |
| Standard   | $59,99 | 16        | Individual — **plan popular** |
| Premium    | $69,99 | 28        | Individual                    |
| Enterprise | $49,99 | 16        | **Corporativo**               |

El orden es **por grupos, y dentro del grupo de menor a mayor precio**: primero los tres individuales (39,99 → 59,99 → 69,99) y después el corporativo, aunque cueste menos que dos de ellos. Mezclarlos por precio pondría el Enterprise entre el Basic y el Standard, y se leería como un plan individual más.

**El corporativo se distingue por tres cosas a la vez**, para que no haya que leer el nombre: la pastilla «Para empresas», el borde lima en vez del gris, y que ocupa el ancho entero en dos columnas en lugar de ser una tarjeta más de la fila. Su botón tampoco lleva al alta de la app: abre el portal de partners en otra pestaña.

## Los dos grises oscuros

El lienzo de la página **no es el mismo negro que las tarjetas**: la página mide #1b1d25 y las tarjetas #1f2130 (muestreadas y convertidas de Display P3 a sRGB). Esa relación —lienzo un punto más oscuro que la tarjeta— se reproduce con tokens que ya existían, sin inventar un gris nuevo: `bg-secondary-shade` (#192027) para la sección y `bg-secondary` (#1c242c) para las tarjetas, con un borde `secondary-tint` que es lo que las separa del fondo.

## El check de las ventajas

Es un **círculo del mismo color a baja opacidad con el tic a color pleno**: en las tarjetas oscuras, lima sobre lima al 20 %; en la lima, carbón sobre carbón. Un solo marcado sirve para los dos casos —el círculo usa `bg-current/20` y el tic hereda `currentColor`—, y lo único que cambia por plan es el color de la lista.

La pastilla «Plan popular» va absoluta y centrada sobre el borde superior de la tarjeta destacada, sobresaliendo 13,6 px, como en la captura.

## Tipografía

Medida una a una con el método del ancho renderizado (`canvas.measureText` contra lo que mide la cadena en la captura):

| Texto                  | Diseño | Usado    |
| ---------------------- | ------ | -------- |
| Titular                | 46,7   | 46,7     |
| Nombre del plan        | 17,2   | 17,1     |
| Precio                 | 51,8   | 51,8     |
| Letra pequeña          | 14,8   | 14,7     |
| Descripción y ventajas | 12,3   | **14,4** |

(Las medidas del diseño se tomaron sobre las tarjetas de la captura, que llevaban otros planes y otros precios; la maqueta conserva esas proporciones con el contenido nuevo.)

**Las ventajas y la descripción van a 14,4 px y no a los 12,3 que mide el diseño**, y es deliberado: a 12 px el texto de la tarjeta queda por debajo de lo que el propio proyecto se puso como suelo (ver el comentario de `--text-body-lg` en `styles.css`, que ya se salta el factor 0,8 por este motivo). A 14,4 px el recuento de líneas es el mismo que en la captura —la descripción rompe en dos líneas y ninguna ventaja rompe—, así que la tarjeta cae donde tiene que caer.

## Lo que queda abierto

- **No hay capturas de móvil.** Los tres planes individuales se pasan de izquierda a derecha en un carrusel con `snap`: cada tarjeta ocupa el 94 % del ancho, así que de la siguiente solo **asoma** una franja de ~30 px: lo justo para que se vea que hay más sin robarle sitio a la que se está leyendo. Los `-mx-6 px-6` sacan el carrusel a los bordes de la pantalla dejando la primera tarjeta alineada con el resto del contenido, y **hace falta `scroll-pl-6`** para que el `snap` respete ese gutter: sin él la tarjeta se pega al borde de la pantalla, el hueco desaparece y de la siguiente asoma el doble. El `pt-5` es el sitio que necesita la pastilla del plan popular, porque con scroll horizontal lo que sobresalga por arriba se recorta. El corporativo va debajo, a ancho completo, porque es otro grupo.
- **Los botones «Suscribirme» abren `app.moviapass.com`**, que es el dominio de la aplicación autenticada según `docs/decisiones/2026-09-20-dominio-y-hosting.md`. Si el alta vive en otra URL, es una línea.
- **El footer de la captura no es el del sitio** (enseña `info@movia.com` y no lleva WhatsApp): se ha ignorado, porque el encargo era no tocar header ni footer.
