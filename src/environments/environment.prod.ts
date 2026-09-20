/** Production environment. Only public URLs and flags — never secrets. */
export const environment = {
	production: true,
	// Base pública del sitio, con la que se componen enlaces absolutos (canónicas,
	// metadatos sociales). Absolutos y no relativos: una ruta relativa la recoge el
	// router y acaba en su propio 404.
	siteUrl: 'https://moviapass.com'
};
