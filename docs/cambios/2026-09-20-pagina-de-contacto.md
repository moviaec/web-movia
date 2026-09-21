# Página de contacto: formulario con audiencia y API detrás

Encargo: que `/contact` tenga un formulario que envíe de verdad, con un selector de para qué se escribe (usuarios, empresas o partners), y que detrás haya una API que guarde cada contacto con su propio ID y mande un correo de confirmación desde el `no-reply` con un número de solicitud.

Toca **dos repositorios**: `web-movia` (la pantalla) y `api-movia` (la tabla, el endpoint y el correo). La decisión de arquitectura que lo permite está en [`decisiones/2026-09-20-contacto-contra-api.md`](../decisiones/2026-09-20-contacto-contra-api.md).

## Lo que ve quien entra

1. **Cabecera** oscura, igual que el centro de ayuda.
2. **Formulario** en tarjeta clara, en este orden: quién escribe → sus datos → su mensaje.
3. **Canales directos**: el mismo correo y el mismo WhatsApp del pie, para quien prefiera escribir por su cuenta.

El selector de audiencia va **primero y no al final**, porque decide el resto del formulario: a qué equipo le toca responder y si se pide el nombre de la empresa. Es un **`<select>` nativo**: son opciones excluyentes de una misma pregunta, y en móvil el navegador lo abre con su propia rueda, más cómoda con el pulgar que tres cajas apiladas. `appearance-none` quita la flecha del sistema —que cada navegador pinta a su manera— y pone la del sitio (`icon-flecha-abajo`) con `pointer-events-none`, para que el clic siga llegando al `<select>` de debajo.

Debajo del `<select>` se pinta la **descripción de la opción elegida**. Con las tres tarjetas que hubo primero se leían las tres a la vez; al plegarlas en un desplegable esa información se perdía, y es justo lo que confirma que se eligió bien.

El campo de la empresa **solo existe para empresas y centros**, y se saca del DOM con `@if` en vez de esconderlo con una clase: un input invisible pero presente lo sigue leyendo un lector de pantalla y lo sigue rellenando el autocompletado.

Bajo el botón hay un **aviso de consentimiento**: «Al enviar este formulario aceptas nuestra Política de Uso de Datos», con el enlace a `/legal/data-usage`. Es un aviso y no una casilla obligatoria: el formulario ya pide lo justo para poder responder, y una casilla más es un clic para decir lo mismo. El enlace sale de `DATA_USAGE_LINK` en `navigation.constants.ts`, del que ahora también tira el pie: escribir la ruta dos veces es cómo acaban apuntando a sitios distintos el día que cambie.

## El formulario, por dentro

- **Signal Forms**, con `[formRoot]` en el `<form>` y `(submit)`, nunca `(ngSubmit)` (`RULES.md` regla 23). Se comprobó en el navegador: al enviar con campos inválidos la URL sigue siendo `/contact`, sin query string, que es la prueba de que `FormRoot` hizo el `preventDefault()`.
- **`submit()`** de `@angular/forms/signals` es quien marca todos los campos como tocados y solo corre la acción si el formulario es válido; `onInvalid` devuelve el botón a su sitio para que no se quede en «Enviando…» en un envío que nunca salió.
- **Estado en un `signal<SubmitStatus>`** (`idle` / `sending` / `success` / `error`), como pide `CLAUDE.md`: deshabilita el botón y elige el mensaje.
- **El resultado sale en un toast flotante** (`shared/components/toast/`), abajo a la derecha y por encima de todo (`z-50`, sobre el `z-30` del header), que se va solo a los cinco segundos o cuando se cierra a mano. Verde para el acuse, rojo para el fallo. No es una caja dentro del formulario porque en un móvil el botón de enviar puede quedar fuera de la pantalla, y un aviso que aparece donde no se está mirando no lo lee nadie.
- **Los colores son los tintados del tema** (`success-surface` + `border-success`) con el texto en `ink`, no un relleno sólido con texto blanco: el verde del tema sobre blanco da 4,4:1, justo por debajo del mínimo para texto normal.
- **Cada aviso estrena componente.** Las dos ramas del `@if` son vistas distintas, así que al pasar de un error a un acuse Angular destruye una y crea la otra, y los cinco segundos empiezan de cero. Con un único toast al que solo le cambiara el contenido, el segundo heredaría el tiempo ya corrido del primero.
- **La región `aria-live` vive siempre en el DOM**, aunque esté vacía: un `aria-live` que se inserta a la vez que su contenido no se anuncia. El `<div>` no ocupa sitio, porque lo que se ve va `fixed` dentro del toast.
- **Los topes de cada campo están escritos dos veces**, en `core/constants/contact.constants.ts` y en `common/constants/contact-request.constant.ts` de la API. Es duplicación consciente: no hay paquete compartido entre los dos repositorios, y los dos archivos se avisan mutuamente en un comentario.

## Lo que se montó en `api-movia`

- `POST /contact-requests`, público (`@Public()`) y con límite de **3 por minuto y por IP**: es un formulario abierto que escribe en la base y dispara un correo, así que sin tope se convierte en una máquina de mandar correo desde el dominio de Movía.
- Tabla `contact_requests` con `id` UUID, borrado lógico y una columna `reference` **UNIQUE**: el número de solicitud que se le da a la persona (`MOV-7K3QF2`). Se genera con `randomInt` de `node:crypto` sobre un alfabeto sin caracteres que se confundan al dictarlo (ni `O`/`0`, ni `I`/`1`, ni `S`/`5`), y quien garantiza que no se repita es el UNIQUE: el service inserta y reintenta si choca, en vez de consultar antes, porque entre el `SELECT` y el `INSERT` cabe otra petición.
- Plantilla de correo `contact_received` (HTML + texto plano), con el número de solicitud y el mensaje citado. El mensaje va con el escapado de Handlebars activo (`{{message}}`, nunca `{{{message}}}`): lo escribió alguien desde un formulario público.
- **Primero se guarda, después se manda el correo.** Al revés se estaría dando un número de solicitud que no existe en ninguna tabla.

## Verificado

| Qué                                                     | Cómo                                                                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint` y `npm run test` en `web-movia`          | Pasan                                                                                                                                                                           |
| `npm run build:prod` en `web-movia`                     | 10 rutas prerenderizadas, sin errores nuevos                                                                                                                                    |
| `npm run lint`, `npm run build` y `jest` en `api-movia` | Pasan (225 tests, 7 nuevos del service de contacto)                                                                                                                             |
| Envío real desde el navegador                           | `POST /contact-requests` → 201, número `MOV-YV4LJR` en pantalla y fila en MariaDB                                                                                               |
| Validación                                              | Enviar vacío pinta los tres errores y NO recarga la página                                                                                                                      |
| Audiencia                                               | Al elegir «Soy un centro» en el `<select>` cambia la descripción, aparece el campo «Nombre del centro» y pasa a ser obligatorio                                                 |
| Toast                                                   | Acuse verde abajo a la izquierda con su número y desaparecido a los 5 s; el de error, rojo, forzado agotando el límite de 3 por minuto del endpoint (que de paso quedó probado) |
| Header fijo                                             | Transparente arriba; al hacer scroll toma `#1c242c`, sombra y baja de 145 a 81 px, en escritorio y en móvil. El prerender sale transparente                                     |
| Móvil (400 px)                                          | Envío completo desde el desplegable: `201` y número `MOV-BHEHH8`, con `audience: partner` en la fila; los iconos del pie vuelven a medir 44 × 44                                |

## De paso: el header fijo y los iconos del pie

Dos arreglos del layout que salieron de la misma revisión y no son de la pantalla de contacto.

### El header se queda arriba

Era `absolute` en lo alto de la página: se iba con el scroll y no volvía. Ahora es `fixed`, con el fondo en el `host` del componente y no en `app.html`, porque quien sabe si hace falta es el propio header.

- **Arriba del todo sigue sin banda**, que es lo que pide el diseño: la foto del hero llega al borde. A partir de 16 px de scroll toma el carbón y una sombra. El umbral no es cero porque el rebote elástico del trackpad lo cruzaría sin parar y la barra parpadearía.
- **Al fijarse, la barra se compacta**: los 70 px de aire superior del diseño de escritorio dejaban una banda de 138 px pegada a la pantalla, una sexta parte de un portátil. Las dos alturas van en el mismo binding, ninguna en el `class` estático.
- **El estado inicial se lee con `afterNextRender`**: recargar a media página restaura el scroll SIN disparar el evento, y `afterNextRender` no corre en el prerender, donde no hay `window`. El HTML prerenderizado sale con la barra transparente, que es el estado correcto al abrir.
- **El botón «Suscribirme» del cajón de móvil iba a `#`**, así que en el móvil no hacía nada: se leía como que la aplicación no responde. Ahora lleva a `/plans`, igual que el de escritorio, y cierra el cajón al navegar. El de escritorio pasó de `href="/plans"` a `routerLink`: un `href` a una ruta propia sale de la aplicación y la arranca entera para acabar donde el router ya iba.
- **Cualquier navegación cierra el cajón de móvil**, no solo la que sale de sus enlaces. Es un fallo que ya existía —un enlace del pie con el menú abierto lo dejaba abierto—, pero con la barra fija el menú se quedaba pegado a la pantalla sobre la página nueva. Se cierra escuchando `NavigationEnd`.

### Los iconos de redes del pie, aplastados en móvil

Se veía en la misma captura. En el pie, el bloque de contacto y las tres redes compartían fila también en pantallas estrechas. El correo es una palabra sola y no se encoge, así que el que cedía era el de los iconos: `size-11` mandaba 44 px, pero flex los apretaba hasta **12 × 44** y se veían como tres óvalos.

Se apilan hasta `sm` y desde ahí vuelve la fila, con `shrink-0` en la lista para que no vuelva a deformarse aunque un día comparta sitio con algo que no quepa. En escritorio (`lg`) no cambia nada: siguen debajo del correo y alineados a la derecha.

## Pendiente

- La URL de la API en producción (`environment.prod.ts` apunta a `https://api.moviapass.com`, que aún no existe) y `https://moviapass.com` en `CORS_ORIGINS` de la API.
- Nadie de Movía recibe aviso de que entró una solicitud: hay que mirar la tabla.
- Sin captcha; la única defensa es el límite por IP.
- Sin estado de gestión en la fila (`nueva` / `en curso` / `cerrada`): se dejó fuera porque hoy no hay pantalla desde la que cambiarlo.
