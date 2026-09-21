# Rutas en inglés y página de contacto

Las cuatro rutas de la landing pasan a inglés (`/partners`, `/corporate`, `/plans`, `/contact`), entra una página nueva de contacto y el menú cambia de etiquetas. La regla que lo obliga queda escrita en `RULES.md`, que hasta ahora no decía nada del idioma de las URL.

---

## Qué se renombró

| Antes       | Ahora        | Carpeta                     | Clase       | Título de la pestaña  |
| ----------- | ------------ | --------------------------- | ----------- | --------------------- |
| `/estudios` | `/partners`  | `features/partners/`        | `Partners`  | `Partners · Movía`    |
| `/empresas` | `/corporate` | `features/corporate/`       | `Corporate` | `Empresas · Movía`    |
| `/planes`   | `/plans`     | `features/plans/`           | `Plans`     | `Planes · Movía`      |
| —           | `/contact`   | `features/contact/` (nueva) | `Contact`   | `Contáctanos · Movía` |

La carpeta del dominio va siempre igual que la ruta (regla 9), así que el renombrado arrastra el archivo, la clase, el selector (`app-partners`…) y la constante de rutas (`PARTNERS_ROUTES`…).

Se actualizaron todos los puntos de entrada: `app.routes.ts`, los `routerLink` de las secciones del Home (tarjetas del hero, «Saber más» de Estudios y de Empresas, el CTA de cierre, «Centro de ayuda» de la FAQ) y los `path` de `navigation.constants.ts` y `home.constants.ts`.

## La regla nueva

`RULES.md` regla 12 decía «identificadores en inglés» sin mencionar las rutas, y por ese hueco la landing nació con URLs en español. Ahora dice explícitamente que **la URL es un identificador** y va en inglés, con tres matices:

- La carpeta del dominio va en inglés con ella, porque son el mismo árbol.
- **La etiqueta del menú NO es la ruta**: el texto que ve el usuario es copy y sigue en español, así que lo normal es que no coincidan.
- Cambiar una ruta ya publicada rompe enlaces de fuera y pide un 301. Mientras el sitio no esté en producción, se renombra y ya está — que es el caso hoy.

`CLAUDE.md` recoge lo mismo en su línea de identificadores y en la de rutas.

## Etiquetas del menú

| Antes                  | Ahora           |
| ---------------------- | --------------- |
| `Partners`             | `Para partners` |
| `Empresa` / `Empresas` | `Para empresas` |
| `Para ti`              | `Para ti`       |
| —                      | `Contáctanos`   |

Las tres primeras forman ahora una familia («Para ti», «Para partners», «Para empresas») y el header y el footer dicen lo mismo, cosa que antes no pasaba: el header ponía «Empresa» en singular y el footer «Empresas».

## Lo que el cambio rompió en el header, y cómo quedó

Las etiquetas largas no caben entre 1024 y 1280 px: solo el logo mide 311 px. Con las cuatro entradas y las dos insignias de tienda, la barra se pasaba ~215 px y el menú se metía debajo del botón.

- El logo lleva `shrink-0`: el flex lo estaba aplastando hasta dejarlo en una raya.
- Los huecos del menú bajan a `gap-6` hasta `xl`, y ahí vuelven a los del diseño.
- Las **insignias de App Store y Google Play se esconden por debajo de `xl`**. Siguen estando en el footer y en el cajón de móvil, así que no se pierde el acceso.
- El botón «Suscribirme» va con `px-6` hasta `xl`.

De `xl` en adelante el header es exactamente el del diseño.

## Verificación

- `npm run lint` y `npm run test`, en verde.
- Build de desarrollo: prerenderiza **5 rutas** (`/`, `/partners`, `/corporate`, `/plans`, `/contact`).
- Las cuatro URL sirven un 200 con su `<title>` correcto, y no queda ningún directorio `estudios/`, `empresas/`, `planes/` ni `contacto/` en `dist/`.
- Header revisado a 1024, 1280 y 1440 px, y el cajón de móvil con sus cuatro entradas.

## Lo que queda abierto

- El nombre de las imágenes sigue en español (`/imgs/home/estudios.jpg`, `empresas.jpg`). Son archivos de diseño, no URLs de página, y renombrarlos es churn sin beneficio; si se quiere unificar, es un cambio aparte.
- Las tres entradas legales del footer (`Términos & Condiciones`, `Políticas de Privacidad`, `Preguntas`) siguen sin ruta. Cuando la tengan, irán bajo `features/legal/` en inglés: `/legal/terms`, `/legal/privacy`, `/legal/cookies`.
