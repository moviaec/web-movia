import { environment } from '../../../environments/environment';

/**
 * Where the partner portal (`web-partner-movia`) lives.
 *
 * It is a constant and not a literal in each template because it appears in THREE
 * places of this site —el botón «Iniciar sesión» de la cabecera y los dos CTA de
 * `/partners`— y porque ya se escribió mal: dos plantillas apuntaban a
 * `partner.moviapass.com`, en singular, cuando el portal se sirve en
 * `partners.moviapass.com`. Con un solo sitio donde está escrito, esa clase de
 * error se corrige una vez.
 *
 * Apunta a la RAÍZ del portal a propósito, no a su pantalla de acceso: quien ya
 * tiene la sesión abierta entra directo a su dashboard, y solo quien no la tiene
 * acaba en el formulario. Enlazar a `/auth/login` obligaría a pasar por una
 * pantalla de credenciales a quien ya está dentro.
 */
export const PARTNER_PORTAL_URL = environment.partnerPortalUrl;
