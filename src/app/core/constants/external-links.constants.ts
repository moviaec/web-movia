/**
 * URLs of everything that lives OUTSIDE this site: the app stores and the social
 * profiles of the brand.
 *
 * Están todas aquí y no en las plantillas porque cada una aparece en tres sitios
 * distintos —la cabecera, el cajón de móvil y el pie— y porque los perfiles sociales
 * son, además, lo que alimenta el `sameAs` de los datos estructurados: es lo que le
 * dice a Google que este dominio y esas cuentas son la misma marca.
 *
 * PENDIENTE: ninguna existe todavía. Las aporta el usuario y hasta entonces los
 * enlaces se quedan como están, apuntando a `#`. Una URL inventada es peor que un
 * enlace muerto: manda a la gente a la cuenta de otro.
 */

/** App Store. TODO: URL real de la ficha de Movía. */
export const APP_STORE_URL = '';

/** Google Play. TODO: URL real de la ficha de Movía. */
export const GOOGLE_PLAY_URL = '';

/** Facebook. TODO: URL real del perfil de Movía. */
export const FACEBOOK_URL = '';

/** Instagram. TODO: URL real del perfil de Movía. */
export const INSTAGRAM_URL = '';

/** LinkedIn. TODO: URL real del perfil de Movía. */
export const LINKEDIN_URL = '';

/**
 * The social profiles that `sameAs` declares, with the empty ones left out.
 *
 * It stays an empty array until the URLs above exist, and while it is empty the
 * `sameAs` property is not written at all: declaring it empty tells Google nothing and
 * only makes the block longer.
 */
export const SOCIAL_PROFILE_URLS: readonly string[] = [FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL].filter((url) => url !== '');
