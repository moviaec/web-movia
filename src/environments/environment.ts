/** Development environment. Only public URLs and flags — never secrets. */
export const environment = {
	production: false,
	// Base pública del sitio, con la que se componen enlaces absolutos (canónicas,
	// metadatos sociales). Absolutos y no relativos: una ruta relativa la recoge el
	// router y acaba en su propio 404.
	siteUrl: 'http://localhost:4200',
	// Base de `api-movia`, el único servicio remoto del sitio: lo usa el formulario
	// de contacto y nada más (ver `docs/decisiones/`). En local, la API de
	// desarrollo en su puerto 3000.
	apiUrl: 'http://localhost:3000'
};
