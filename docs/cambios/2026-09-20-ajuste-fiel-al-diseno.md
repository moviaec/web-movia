# Ajuste fiel al diseño: barrido de todas las secciones

Encargo: que la web quede **exactamente igual a las capturas del prototipo**, sin restricciones. Esto documenta qué estaba descuadrado, por qué, y cómo se midió cada corrección.

## El error de partida: el prototipo se ve escalado

El prototipo de Figma se abre con `scaling=scale-down-width`. El frame mide 1920 px, pero se ve reducido a la ventana real (~1496 px), o sea **al 78 %**. Todo lo que medí sobre la captura y llevé al código a tamaño completo salía ~25 % más grande que la maqueta.

La corrección es un factor **0,8** aplicado a todo el sistema de escritorio: tipografía, contenedores, espaciado, radios y el padding de los botones. Las clases base (móvil) **no** se tocan, porque el frame móvil del prototipo sí se ve a escala 1:1 (la captura da exactamente 2 px de imagen por px CSS).

**Cómo verificar de aquí en adelante:** abrir la web a **1536 px** de ancho (1920 × 0,8). A ese ancho, cada medida del diseño multiplicada por 0,8 tiene que caer clavada.

## Lo que estaba mal, sección por sección

| Sección           | Qué estaba mal                                                                                     | Medida del diseño (frame 1920)                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Header            | Banda carbón sólida en vez de ir sobre la foto; iconos de tienda en círculo blanco con glifo negro | Transparente; círculo `#333C41` (= `secondary-tint`) con glifo **blanco**, 56 px |
| Hero              | 626 px de alto, sin esquinas curvas, velo al 45 %                                                  | 799 px, esquinas inferiores de 40 px, velo de carbón al 70 %                     |
| Tarjetas del hero | El contenedor pintaba blanco y tapaba la foto                                                      | La foto se ve por los huecos; pisan el hero 85 px; hueco de 101 px entre ellas   |
| Contenedores      | El `max-width` no contaba los gutters: todo salía 80 px más estrecho                               | Contenido 1416 px, header y footer 1580 px                                       |
| Pasos             | El texto ocupaba todo el ancho y la imagen iba dentro del contenedor                               | Bloque de texto de 870 px; móviles pegados al borde de la ventana (1258 → 1910)  |
| Categorías        | Las cinco fotos, iguales                                                                           | Escalonadas: 302 / 344 / **402** / 344 / 302 px de alto, mismo eje central       |
| Estudios          | Tres columnas iguales                                                                              | 443 / 345 / 449 px (31 / 25 / 44 %)                                              |
| Empresas          | Mitad y mitad                                                                                      | 927 / 470 px (65 / 35 %), con la foto sobresaliendo 120 px por arriba            |
| Mapa              | Bloque de texto de 576 px                                                                          | 456 px                                                                           |
| CTA               | Persona pequeña, dentro de la banda                                                                | 854 px de ancho, sale 111 px por encima de la banda                              |
| Botones           | Se estiraban a todo el ancho de su columna                                                         | Pastilla compacta: 213 × 58 en el header, 213 × 80 en las secciones              |
| Lienzo            | `body` en gris `mist`, heredado del portal de partners                                             | **Blanco**                                                                       |

## Cómo se midió

1. **Referencia conocida**: el frame de 1920 ocupa el ancho completo del navegador en la captura, que tiene 2992 px → `1 px de imagen = 0,6417 px de diseño`.
2. **Color**: muestreo con PIL y conversión de Display P3 a sRGB con el perfil ICC incrustado. Sin eso, el lima da `#D3F44E` en vez de `#D3F443`.
3. **Velo del hero**: comparando el mockup con la foto entregada punto a punto, el color sale de `0,7 × carbón + 0,3 × foto`. No es una corrección de contraste inventada.
4. **Comprobación**: `getBoundingClientRect` a 1536 px contra la medida del diseño × 0,8.

Resultado a 1496 px (el ancho de la captura): hero 623 (622), tarjetas arriba en 555 (556), círculos 44 (44), botón 171 × 43 (166 × 45), H1 57,6 px (56).

## Detalles que salieron del barrido

- **Los SVG de diseño no traen `fill`**, así que dentro de un `<img>` son negros y desaparecen sobre el carbón. Se pintan como máscara (`icon-mask` + una utilidad por icono en `styles.css`), y el color lo pone un token del tema.
- **Los PNG de redes ya traen el círculo lima**: el envoltorio de color que había lo duplicaba.
- **El hero tiene dos recortes** (escritorio y móvil), así que va en un `<picture>` y ese `<img>` no usa `NgOptimizedImage`, que no lo soporta.
- **En móvil, la composición de móviles va ANTES del titular** de la sección de pasos; en escritorio va a la derecha, absoluta.

## Lo que sigue pendiente, y no es maquetación

- El copy real de las respuestas de la FAQ (las actuales son provisionales).
- «Ocho categorías» con cinco fotos en el diseño.
- A dónde apuntan «Ver todas», «Encontrar» y «Centro de ayuda».
- Los dos limas: `#D3F442` (token) contra `#B9FD50` (PNG de redes).
- 4 MB de imágenes sin optimizar.
