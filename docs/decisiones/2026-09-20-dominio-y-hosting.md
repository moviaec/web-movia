# Dominio de la landing y qué exige al hosting

**Estado:** dominio CONFIRMADO · hosting ABIERTO

## Decisión

La landing estática se aloja en **`moviapass.com`** (el apex, sin subdirectorio). La aplicación autenticada vive aparte, en **`app.moviapass.com`**: son dos despliegues distintos y ninguno cuelga del otro.

## Consecuencias, ya aplicadas

- **`base href="/"` en `src/index.html` es correcto** y no hay que tocarlo. Colgar el sitio de un subdirectorio (`/landing/`, una preview por rama, GitHub Pages en `usuario.github.io/web-movia/`) obligaría a cambiarlo y a rehacer el build: no es un ajuste de hosting, es otro artefacto.
- **`siteUrl` de producción es `https://moviapass.com`**, ya escrito en `src/environments/environment.prod.ts`. En desarrollo es `http://localhost:4200`.

## Consecuencias pendientes

De `siteUrl` cuelgan tres cosas que **todavía no existen** y que no deben inventarse la URL por su cuenta: `<link rel="canonical">`, `og:url` y el `sitemap.xml`. Cuando se escriban, salen de `environment.siteUrl` y de ningún otro sitio.

## Qué le exige esto al hosting

El build emite `dist/web-movia/browser/` con **un `index.html` prerenderizado por ruta**, cada uno en la carpeta de su ruta (`/legal/privacy/index.html`). El navegador pide `/legal/privacy`, sin extensión y sin barra final, así que **el hosting tiene que resolver esa URL a su `index.html`**. Sin eso, todas las rutas menos la raíz devuelven 404.

Las dos formas que aplican según dónde acabe:

- **S3 + CloudFront** → una CloudFront Function en `viewer-request` que reescriba el URI: si no tiene extensión, añadirle `/index.html`. El `DefaultRootObject` del distribution **no sirve**: solo cubre la raíz, no las subrutas.
- **Nginx** → `try_files $uri $uri/index.html $uri/ =404;` en el `location /`.

Lo que **no** se debe hacer es el fallback típico de SPA (todo a un único `index.html` raíz): serviría el HTML de la home en cada ruta, y con ello se pierde justo lo que el prerender aporta al SEO.

## Abierto

**El hosting concreto no está decidido.** Netlify, Vercel, S3+CloudFront, Nginx propio o Firebase Hosting siguen todos sobre la mesa; algunos resuelven las rutas sin extensión de fábrica y otros piden la configuración de arriba. Cuando se decida, se escribe la guía de despliegue en `docs/guias/` y se cierra este punto.
