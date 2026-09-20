# Design system derivado del Home

**Estado:** parcial · derivado SOLO de las capturas del Home (desktop y móvil). Faltan Estudios, Empresas y Planes.

## Cómo se obtuvieron estos valores

No hay acceso al Figma: solo capturas de pantalla del prototipo. Todo lo de aquí es una **estimación medida sobre píxeles**, con dos apoyos que la hacen razonable:

1. **El frame de desktop mide 1920 px y ocupa el ancho completo del navegador en la captura.** La captura es de 2992 px de ancho, así que `1 px de imagen = 0,6417 px del diseño`. Las medidas de desktop salen de esa regla de tres, no del ojo.
2. **Los colores se muestrearon con PIL y se convirtieron de Display P3 a sRGB** con el perfil ICC incrustado en el PNG. Sin esa conversión, el lima de la captura daba `#D3F44E` en vez de `#D3F443`.

Los tamaños de letra se calculan midiendo la **altura de mayúscula** y dividiéndola entre 0,72 (ratio de Inter y de Plus Jakarta Sans). Un par de píxeles de error en el recorte mueve el resultado 2-3 px, de ahí que casi nada aquí sea de confianza ALTA.

**Confianza:** ALTA = medido contra una referencia conocida · MEDIA = deducido de proporciones dentro de la imagen · BAJA = estimado a ojo.

## Color

| Token actual en `styles.css`                                       | Valor actual | Valor del diseño (muestreado, sRGB)               | Confianza | ¿Coincide?           | Propuesta                                                                                  |
| ------------------------------------------------------------------ | ------------ | ------------------------------------------------- | --------- | -------------------- | ------------------------------------------------------------------------------------------ |
| `--brand-lime`                                                     | `#d3f442`    | `#D3F443` (banda CTA, botones, círculos sociales) | ALTA      | **Sí**               | Dejar como está                                                                            |
| `--brand-carbon`                                                   | `#1c242c`    | `#1E242B` (fondo del footer)                      | ALTA      | Casi (Δ≈2 por canal) | Dejar como está; la diferencia cabe en el redondeo del perfil                              |
| `--brand-white`                                                    | `#ffffff`    | `#FFFFFF` (fondo de página)                       | ALTA      | Sí                   | Dejar como está                                                                            |
| `--brand-mist`                                                     | `#f4f5f8`    | `#F6F6F6` (cards claras del hero)                 | MEDIA     | **No exacto**        | **Requiere tu visto bueno.** El diseño usa un gris neutro; el token tiene un tinte azulado |
| `--brand-gray`                                                     | `#92949c`    | sin medir                                         | —         | —                    | Falta una muestra fiable de texto secundario                                               |
| `--brand-green` / `--brand-amber` / `--brand-red` / `--brand-blue` | —            | **no aparecen en el Home**                        | —         | —                    | Son colores funcionales del portal; el Home no los usa                                     |

**Hallazgo que hay que decidir antes de maquetar:** el lienzo de la landing es **blanco**, y hoy `styles.css` pinta `body` con `bg-surface-muted` (el gris `mist`), que era el lienzo del portal de partners. En el Home el gris solo aparece dentro de cards y de alguna banda, nunca como fondo de página. **No lo he cambiado**: es un cambio de color y quedó pendiente de tu visto bueno.

## Tipografía

El diseño usa una geométrica que no es ninguna de las dos del proyecto (se ve sobre todo en la `a` de doble piso y en la `y`). Por la decisión ya tomada, **se mapea así y no se añade una tercera familia**: titulares → `--font-display` (Plus Jakarta Sans), cuerpo → `--font-sans` (Inter). El comentario PENDIENTE sobre Gilroy se eliminó de `styles.css`: queda descartada.

| Rol                                                    | Altura de mayúscula medida | Tamaño estimado (desktop)    | Confianza  | Token nuevo             |
| ------------------------------------------------------ | -------------------------- | ---------------------------- | ---------- | ----------------------- |
| H1 del hero («Move Freely.»)                           | 50,1 px                    | **72 px** / interlínea ~1,05 | MEDIA-ALTA | `--text-display`        |
| Entradilla del hero                                    | 24,4 px                    | **32 px** / ~1,4             | MEDIA      | `--text-lead`           |
| Titular de sección («¿Tienes preguntas?»)              | 35,3 px                    | **48 px** / ~1,15            | MEDIA-ALTA | `--text-headline`       |
| Título de card y de paso («Para ti», «Elige el plan.») | 21,2-21,8 px               | **30 px** / ~1,3             | MEDIA      | `--text-title`          |
| Cuerpo destacado, nav y footer                         | 12,8-14,1 px               | **18 px** / ~1,6             | MEDIA      | `--text-body-lg`        |
| Cuerpo de los pasos                                    | 11,6 px                    | **16 px**                    | BAJA       | `text-base` de Tailwind |

**Móvil: NO medido con fiabilidad.** El frame móvil mide ~440 px (la captura lo muestra a exactamente 2× retina, lo que lo confirma), pero los recortes de texto sobre 440 px acumulan demasiado error: el H1 sale entre 44 y 54 px y el título de card entre 30 y 40 px según dónde caiga el recorte. **No se han escrito tokens de móvil**; hacen falta capturas por secciones para cerrarlos.

## Espaciado y layout

| Qué                           | Valor medido                                    | Confianza | Token nuevo                                  |
| ----------------------------- | ----------------------------------------------- | --------- | -------------------------------------------- |
| Ancho del contenido centrado  | **1416 px** (cards del hero: 3 × 405 + 2 × 101) | ALTA      | `--container-content`                        |
| Ancho del header y del footer | **1580 px** (margen de 169-170 px a cada lado)  | ALTA      | `--container-wide`                           |
| Hueco entre cards             | **101 px** (≈ 100)                              | ALTA      | —                                            |
| Alto de la card del hero      | 260 px                                          | ALTA      | —                                            |
| Sección → titular (FAQ)       | **162 px**                                      | MEDIA     | `--spacing-section` = 160 px                 |
| Footer → primer contenido     | **130 px**                                      | MEDIA     | —                                            |
| Margen lateral en móvil       | ~24 px                                          | BAJA      | —                                            |
| Ritmo vertical en móvil       | **sin medir**                                   | —         | `--spacing-section-sm` = 64 px, **estimado** |

**Dos contenedores distintos, no uno.** El header y el footer llegan a 1580 px y el contenido de las secciones se queda en 1416 px. No es un descuido de la captura: se midió en varias secciones y siempre da lo mismo.

## Radios y botones

| Qué                                 | Valor medido      | Confianza | Token           |
| ----------------------------------- | ----------------- | --------- | --------------- |
| Radio de las cards (blancas y lima) | **~8 px**         | MEDIA     | `--radius-card` |
| Botón del header («Suscribirme»)    | 214 × 58 px, pill | ALTA      | `rounded-full`  |
| Botón CTA de sección («Encontrar»)  | alto 80 px, pill  | ALTA      | `rounded-full`  |

Hay **dos tamaños de botón** (58 y 80 px de alto), no uno. Las `.btn-*` que ya existen en `styles.css` vienen del portal de partners (`px-5 py-2.5`, ≈44 px de alto) y **no dan ninguno de los dos**. No las he tocado: se revisan cuando se maquete la primera pantalla.

## NO DERIVABLE DESDE HOME

Falta el diseño de las otras tres páginas para cerrar:

- **Inputs y formularios** (están en Estudios y Empresas): alto, radio, borde, color de foco, estado de error, label y texto de ayuda. Las clases `.field-label` y `.field-input` de `styles.css` son del portal de partners y casi seguro no valen tal cual.
- **Cards de precio** (están en Planes): estructura, jerarquía tipográfica, tratamiento del plan destacado, badges.
- **Estados de los componentes**: hover, focus y disabled de botones y enlaces. El prototipo es estático y no los muestra.
- **Escala tipográfica de móvil completa**, por lo dicho arriba.
- **Color de texto secundario**: no hay en el Home un párrafo gris suficientemente grande para muestrearlo sin contaminación del antialiasing.
