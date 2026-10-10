# Términos y condiciones y políticas de privacidad

`/legal/terms` y `/legal/privacy` dejan de ser un `<h1>` vacío y pasan a tener su texto completo.

## De dónde sale el texto

Se adaptaron los documentos de MOOV Fitness Club (`/terminos` y `/privacidad` de su sitio) al producto de Movía:

- **Check-ins en lugar de monedas.** Las reglas son las que ya promete el sitio: renovación mensual, sin acumulación, un check-in por centro y día, reservas canceladas a tiempo que no consumen check-in (letra pequeña de `/plans` y centro de ayuda).
- **Fuera lo que Movía no tiene:** marketplace de profesionales, comisiones por intermediación, retos, métricas y foros.
- **Añadido lo que MOOV no tiene:** membresías corporativas (términos §5) y, en privacidad, el formulario de contacto del sitio y los datos agregados que ve la empresa.
- **Identidad:** razón social `LEGAL_NAME` (MOVIAPASS SAS), marca `SITE_NAME` y correo `CONTACT_EMAIL`, leídos de sus constantes y no tecleados.
- Privacidad añade una sección de derechos (acceso, rectificación, eliminación, oposición, portabilidad) según la LOPDP.

## Cómo está montado

- Contenido tipado en `core/constants/legal.constants.ts` (`TERMS_OF_SERVICE`, `PRIVACY_POLICY`) con sus interfaces en `core/interfaces/legal.interface.ts`.
- Un único componente del dominio, `features/legal/components/legal-article/`, pinta cualquier documento; las dos páginas solo eligen el contenido (regla 10).
- Las dos rutas pasan a `indexable: true` y entran en el sitemap. `/legal/data-usage` sigue vacía y en `noindex`.

## Pendiente

- **Revisión jurídica** de ambos textos antes de darlos por definitivos.
- **Ciudad del domicilio** de la sociedad para la cláusula de jurisdicción (hoy dice «domicilio de MOVIAPASS SAS en el Ecuador»).
- Confirmar con negocio las reglas de check-ins que el centro de ayuda ya marcaba como pendientes.
