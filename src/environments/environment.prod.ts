/** Production environment. Only public URLs and flags — never secrets. */
export const environment = {
	production: true,
	// Base pública del sitio, con la que se componen enlaces absolutos (canónicas,
	// metadatos sociales). Absolutos y no relativos: una ruta relativa la recoge el
	// router y acaba en su propio 404.
	siteUrl: 'https://moviapass.com',
	// Base de `api-movia`, el único servicio remoto del sitio: lo usa el formulario
	// de contacto y nada más (ver `docs/decisiones/`).
	//
	// PENDIENTE: el subdominio real de la API en producción. `api.moviapass.com` es
	// la forma que sigue a `app.moviapass.com`, pero todavía no está desplegada ahí:
	// mientras no lo esté, el formulario de una build de producción no envía nada.
	// Al fijarlo hay que añadir `https://moviapass.com` a `CORS_ORIGINS` de la API,
	// o el navegador bloquea la petición antes de salir.
	apiUrl: 'https://api.moviapass.com',
	// Base de `web-partner-movia`, el portal de los estudios. Es a donde lleva
	// «Iniciar sesión» y los dos CTA de /partners.
	//
	// En PLURAL: es como ese proyecto se declara a sí mismo en su
	// `environment.prod.ts`. Estuvo escrito en singular en dos plantillas de esta
	// página y por eso ahora es una constante y no un literal suelto.
	partnerPortalUrl: 'https://partners.moviapass.com'
};
