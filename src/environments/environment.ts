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
	apiUrl: 'http://localhost:3000',
	// Base de `web-partner-movia`, el portal de los estudios. Es a donde lleva
	// «Iniciar sesión» y los dos CTA de /partners.
	//
	// En local va al 4200, que es donde ese proyecto se declara a sí mismo
	// (`siteUrl` de su environment de desarrollo). Los dos proyectos sirven en 4200
	// por defecto, así que para probar el salto hay que levantar ESTE en otro
	// puerto: `ng serve --port 4300`.
	partnerPortalUrl: 'http://localhost:4200'
};
