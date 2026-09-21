# Imágenes reales conectadas al Home

Las fotos y los iconos entregados en `public/imgs` sustituyen a las rutas provisionales. **El Home ya no tiene ni una imagen rota.**

## Qué había que resolver antes de enchufarlas

Los archivos venían con **espacios, tildes y mayúsculas** en las rutas (`Header - Footer/Movia logo horizontal + tagline.png`, `Principal/Categorías/Natación.jpg`). En una URL eso obliga a escapar cada carácter (`%20`, `%C3%A9`) y el `+` del nombre del logo se lee distinto según el contexto. Se normalizaron a kebab-case ASCII y se reagruparon por uso.

| Antes                                                                              | Ahora                                                                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Header - Footer/Movia logo horizontal + tagline.png`                              | `layout/logo-movia.png`                                                            |
| `Header - Footer/App Store.png` · `Google Play.png`                                | `layout/app-store.png` · `layout/google-play.png`                                  |
| `Header - Footer/Facebbok.png` · `Instagram.png` · `Linkedin.png`                  | `layout/facebook.png` · `instagram.png` · `linkedin.png`                           |
| `Header - Footer/Logo apple.svg` · `Logo Android.svg`                              | `iconos/apple.svg` · `iconos/android.svg`                                          |
| `Header - Footer/Menú hamburguesa.svg` · `Cerrar menú.svg`                         | `iconos/menu.svg` · `iconos/menu-close.svg`                                        |
| `Principal/Iconos/Flecha arriba.svg` · `Flecha abajo.svg` · `Flecha dirección.svg` | `iconos/flecha-arriba.svg` · `flecha-abajo.svg` · `flecha-diagonal.svg`            |
| `Empresa/Sin título-1.svg`                                                         | `iconos/check.svg`                                                                 |
| `Principal/Iconos/Flexibilidad.svg` · `Descubrimiento.svg` · `Simplicidad.svg`     | `home/iconos/…` (mismos nombres en minúscula)                                      |
| `Principal/Banner principal/Banner-principal-home.jpg` · `-responsive.jpg`         | `home/hero.jpg` · `home/hero-movil.jpg`                                            |
| `Principal/Pantallas-app-Movia.png`                                                | `home/app-movia.png`                                                               |
| `Principal/Categorías/Karate.jpg` · `Gimnasio` · `Yoga` · `Natación` · `Baile`     | `home/categorias/artes-marciales.jpg` · `gimnasio` · `yoga` · `natacion` · `baile` |
| `Principal/Mapa.jpg`                                                               | `home/mapa.jpg`                                                                    |
| `Principal/Movia-para-estudios.jpg` · `-empresas.jpg`                              | `home/estudios.jpg` · `home/empresas.jpg`                                          |
| `Principal/Muévete-con-Movia.png`                                                  | `home/cta-persona.png`                                                             |

**`Empresa/` y `Partners/` se quedan como estaban**: son de las otras dos páginas y no entran en este alcance.

Dos hallazgos por el camino: el icono que faltaba —el **check de las tarjetas lima**— estaba escondido en `Empresa/Sin título-1.svg`, y el archivo de Facebook está escrito **`Facebbok.png`**, con la errata, en el material original.

## Tres cosas que los archivos reales obligaron a cambiar

### 1. Los SVG son siluetas negras: se pintan como máscara

Los SVG de diseño no traen atributo `fill`, así que dentro de un `<img>` se pintan **siempre en negro** y no hay forma de recolorearlos desde CSS. Sobre el carbón de «Variedad sin límites» o del header, desaparecían.

La solución es usarlos como **máscara**: el color lo pone el `background-color` del elemento, o sea un token del tema, y el mismo archivo sirve en fondo claro y en fondo oscuro. Hay una utilidad `icon-mask` en `styles.css` con su explicación, y una por icono:

```html
<span class="icon-mask icon-flexibilidad bg-primary size-12"></span>
<span class="icon-mask icon-flecha-arriba bg-secondary-contrast size-6 rotate-90"></span>
```

La flecha `→` de los botones es la de arriba **girada 90°**: en el set entregado no hay flecha a la derecha.

**Efecto secundario: `@ng-icons` ya no se usa en ninguna parte.** Entró en la tarea anterior para las flechas y el check, y los archivos de marca lo han dejado sin trabajo. Sigue declarado en `package.json`; quitarlo es tocar configuración y no estaba autorizado en esta tarea.

### 2. Los PNG de redes ya traen el círculo lima

`facebook.png`, `instagram.png` y `linkedin.png` vienen con el círculo lima incluido. El envoltorio `bg-primary rounded-full` que había en el footer lo duplicaba, así que fuera.

**Dato para revisar:** el lima de esos PNG es **#B9FD50**, y el token de marca es **#D3F442**. Son dos limas distintos. En el footer se nota poco porque van sobre carbón, pero conviene saber cuál es el bueno antes de que aparezca uno al lado del otro.

### 3. El hero tiene dos recortes y necesita un velo

`hero.jpg` (1731 × 1025) y `hero-movil.jpg` (1080 × 961) no son la misma foto reencuadrada por CSS: son dos recortes distintos. Van en un `<picture>` con `media`, y por eso ese `<img>` **no usa `NgOptimizedImage`** (no soporta `<picture>`); el peso de LCP lo marca `fetchpriority="high"`.

Además lleva un **velo oscuro** (`bg-secondary/45`): el archivo entregado es más luminoso que el mockup y el subtítulo caía sobre la zona clara del corredor por debajo de 4,5:1 de contraste.

## Verificación

```
All files pass linting.
 Test Files  1 passed (1)
      Tests  1 passed (1)
Prerendered 4 static routes.
```

- **Ninguna referencia rota**: comprobado archivo a archivo contra `dist/web-movia/browser/`.
- **Ningún `.DS_Store` viaja al build** (había dos en `public/`; borrados).
- Recorrido completo en el navegador contra el build de producción, en **1440 px** y en **375 px**: hero con su recorte de móvil, tarjetas, pasos, carrusel de categorías con las fotos asomando, iconos lima, mapa con pines, tarjetas de estudios con el check, ventajas de empresas, FAQ y cierre con la persona saliéndose de la banda lima. Consola sin errores.

## Peso: esto sí hay que mirarlo

|                                |                                                                           |
| ------------------------------ | ------------------------------------------------------------------------- |
| Imágenes que carga el Home     | **4.072 KB (≈4 MB)**                                                      |
| Las tres más pesadas           | `app-movia.png` 731 KB · `natacion.jpg` 542 KB · `cta-persona.png` 367 KB |
| Todo `public/imgs` en el build | 6.548 KB (2.476 KB son de Empresa/ y Partners/, que todavía no usa nadie) |
| JS + CSS iniciales             | 84 KB transferidos                                                        |

**Cuatro megas de imágenes en una landing cuyo objetivo es posicionar.** El JS está bien, el problema son las fotos: van a tamaño y formato de origen, sin WebP/AVIF ni versiones por ancho. Antes de publicar conviene un paso de optimización (`sharp`, Squoosh o el pipeline de imágenes de Angular con `ngSrcset`), y ahí se recuperan dos tercios largos del peso. No lo he hecho: son dependencias nuevas o configuración de build.

## Pendiente, sin tocar

- El copy real de las respuestas de la FAQ (las de ahora son provisionales y mías).
- «Ocho categorías» con cinco fotos.
- A dónde apuntan «Ver todas», «Encontrar» y «Centro de ayuda».
- El header transparente sobre el hero.
- Qué lima es el bueno (#D3F442 del token vs #B9FD50 de los PNG de redes).
