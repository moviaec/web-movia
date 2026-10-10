import { CONTACT_EMAIL } from '@core/constants/navigation.constants';
import { LEGAL_NAME, SITE_NAME } from '@core/constants/site.constants';
import { LegalDocument, LegalDocumentContent } from '@core/interfaces/legal.interface';

/**
 * The three legal documents, in the order they are listed on `/legal`.
 *
 * The `summary` says what each document ANSWERS; it is navigation copy, not legal
 * text, and it does not replace the document. Los términos y la política de
 * privacidad ya tienen su texto (`TERMS_OF_SERVICE` y `PRIVACY_POLICY`, abajo); la
 * política de uso de datos sigue PENDIENTE y por eso es la única en `noindex` en
 * `core/constants/seo.constants.ts`.
 *
 * The paths are written here and in `FOOTER_LEGAL_NAV` because the two lists are
 * different things —a row of links in the footer, a readable index here— but they
 * point at the same routes; if one of them ever moves, both have to move.
 */
export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
	{
		id: 'terms',
		title: 'Términos y condiciones',
		summary: 'Las reglas del servicio: qué incluye cada plan, cómo se cobra la suscripción y qué ocurre cuando la cancelas.',
		path: '/legal/terms'
	},
	{
		id: 'privacy',
		title: 'Políticas de privacidad',
		summary: 'Qué datos personales tratamos, para qué los usamos, cuánto tiempo los conservamos y cómo ejercer tus derechos.',
		path: '/legal/privacy'
	},
	{
		id: 'data-usage',
		title: 'Política de uso de datos',
		summary: 'Qué hacemos con la información que dejas en el formulario de contacto y con la que se genera dentro de la aplicación.',
		path: '/legal/data-usage'
	}
];

/** Lead paragraph of the `/legal` index, under its `h1`. */
export const LEGAL_INTRO = 'Estos son los documentos que rigen el uso de Movía, tanto de la aplicación como de este sitio.';

/** Route of the privacy policy, which the terms link to. */
const PRIVACY_POLICY_LINK = { label: 'Consultar las Políticas de privacidad', path: '/legal/privacy' };

/**
 * Text of `/legal/privacy`.
 *
 * Adaptado del modelo de MOOV Fitness Club al producto de Movía: check-ins y no
 * monedas, el formulario de contacto de este sitio y el beneficio corporativo, que
 * MOOV no tiene.
 */
export const PRIVACY_POLICY: LegalDocumentContent = {
	eyebrow: 'Documento legal',
	title: 'Políticas de privacidad',
	meta: `${LEGAL_NAME} · República del Ecuador · Vigente desde octubre de 2026`,
	intro: [
		`En ${SITE_NAME} respetamos la privacidad de quienes usan nuestro servicio y nos comprometemos a tratar sus datos personales de forma transparente y segura, de conformidad con la Ley Orgánica de Protección de Datos Personales de la República del Ecuador y con las directrices de las tiendas de aplicaciones de Apple y Google.`,
		`Esta política explica qué datos recogemos cuando usas nuestra aplicación móvil y este sitio web (la «Plataforma»), para qué los usamos, con quién los compartimos y qué opciones tienes sobre ellos.`
	],
	numberedClauses: false,
	sections: [
		{
			id: 'responsable',
			title: 'Responsable del tratamiento',
			clauses: [
				{
					text: `La Plataforma ${SITE_NAME} la opera desde Quito, Ecuador, ${LEGAL_NAME}. Para cualquier consulta o gestión sobre privacidad puedes escribirnos a ${CONTACT_EMAIL}.`
				}
			]
		},
		{
			id: 'datos',
			title: 'Datos que recogemos',
			clauses: [
				{
					text: 'Recogemos únicamente los datos necesarios para prestar el servicio de membresía y de acceso a los centros aliados:',
					items: [
						{
							term: 'Datos de cuenta',
							text: 'nombre, correo electrónico, número de teléfono y contraseña al registrarte en la aplicación.'
						},
						{
							term: 'Uso de la membresía',
							text: 'plan contratado, check-ins disponibles en el mes, historial de visitas y reservas hechas en los centros aliados.'
						},
						{
							term: 'Ubicación (opcional)',
							text: 'con tu permiso explícito en el dispositivo, usamos tu ubicación para mostrarte los centros más cercanos. No hacemos seguimiento continuo ni rastreo en segundo plano.'
						},
						{
							term: 'Cámara (opcional)',
							text: 'pedimos acceso a la cámara únicamente cuando decides escanear el código QR de check-in en la recepción de un centro aliado. No capturamos ni guardamos fotos.'
						},
						{
							term: 'Pagos',
							text: `el cobro de la suscripción lo procesan pasarelas de pago y entidades financieras. ${SITE_NAME} no almacena números completos de tarjetas de crédito o débito.`
						},
						{
							term: 'Formulario de contacto',
							text: 'si nos escribes desde este sitio, el nombre, correo, teléfono, empresa o centro y el mensaje que dejas en el formulario, para poder responderte.'
						},
						{
							term: 'Beneficio corporativo',
							text: 'si tu membresía la contrata tu empresa, el correo corporativo con el que te da de alta y el hecho de que el beneficio está activo.'
						}
					]
				}
			]
		},
		{
			id: 'finalidad',
			title: 'Para qué usamos los datos',
			clauses: [
				{
					text: 'Usamos tus datos con los siguientes propósitos:',
					items: [
						{ text: 'Permitir el inicio de sesión y la gestión de tu cuenta en la aplicación.' },
						{ text: 'Permitir tu acceso a los centros aliados mediante la validación del check-in.' },
						{ text: 'Gestionar el cobro de tu membresía y la renovación mensual de los check-ins de tu plan.' },
						{ text: 'Responder las solicitudes que nos envías por el formulario de contacto y darte soporte cuando lo pidas.' },
						{ text: 'Enviarte notificaciones operativas esenciales sobre tu membresía o el estado de tu cuenta.' }
					]
				}
			]
		},
		{
			id: 'terceros',
			title: 'Con quién compartimos la información',
			clauses: [
				{
					text: `${SITE_NAME} no vende tus datos personales. Compartimos únicamente la información indispensable en estos casos:`,
					items: [
						{
							term: 'Centros aliados («Partners»)',
							text: 'al reservar o hacer check-in, el centro ve tu nombre para comprobar que tienes una membresía activa y dejarte entrar. Los Partners responden por sus propias instalaciones.'
						},
						{
							term: 'Tu empresa',
							text: 'si la membresía es un beneficio corporativo, la empresa ve datos de uso agregados (cuántas personas activan el beneficio y con qué frecuencia entrenan), nunca tu actividad individual.'
						},
						{
							term: 'Proveedores de infraestructura técnica',
							text: 'servicios en la nube de alojamiento, base de datos, pagos y envío de correos, que operan bajo acuerdos de confidencialidad y estándares de seguridad.'
						},
						{
							term: 'Requerimiento legal',
							text: 'únicamente ante una solicitud formal de una autoridad judicial o administrativa competente según la ley ecuatoriana.'
						}
					]
				}
			]
		},
		{
			id: 'derechos',
			title: 'Tus derechos y la eliminación de la cuenta',
			clauses: [
				{
					text: 'Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, actualización, eliminación, oposición y portabilidad sobre tus datos personales. Para pedir la baja de tu cuenta y la supresión de tus datos:',
					items: [
						{ text: 'Hazlo desde la configuración de tu perfil en la aplicación.' },
						{ text: `O escríbenos a ${CONTACT_EMAIL} con el asunto «Solicitud de eliminación de cuenta».` }
					]
				},
				{
					text: 'Al procesar la eliminación se borran tus credenciales de acceso y los datos de tu perfil. Conservamos únicamente los comprobantes contables y de facturación que la normativa tributaria del Ecuador obliga a mantener, durante el plazo legal aplicable.'
				}
			]
		},
		{
			id: 'seguridad',
			title: 'Seguridad de la información',
			clauses: [
				{
					text: 'Adoptamos medidas técnicas y organizativas razonables para proteger la información frente a accesos no autorizados, pérdida o alteración, y todas las comunicaciones con la Plataforma viajan cifradas (HTTPS).'
				}
			]
		},
		{
			id: 'cambios',
			title: 'Cambios a esta política y contacto',
			clauses: [
				{
					text: 'Podemos actualizar esta política para reflejar mejoras del servicio o exigencias normativas. La versión vigente estará siempre publicada en esta página, y los cambios importantes te los avisaremos por correo o dentro de la aplicación.'
				},
				{ text: `Para cualquier duda puedes escribirnos a ${CONTACT_EMAIL}.` }
			]
		}
	],
	signature: []
};

/**
 * Text of `/legal/terms`.
 *
 * Adaptado de los términos de MOOV Fitness Club al producto de Movía: la membresía da
 * check-ins mensuales y no monedas, no hay marketplace de profesionales, retos ni foros
 * —que MOOV sí ofrece— y se añade la membresía corporativa. Las reglas de uso salen de
 * lo que ya promete el sitio (la letra pequeña de `/plans` y el centro de ayuda).
 *
 */
export const TERMS_OF_SERVICE: LegalDocumentContent = {
	eyebrow: 'Contrato de membresía',
	title: 'Términos y condiciones',
	meta: `${LEGAL_NAME} · República del Ecuador · Vigentes desde octubre de 2026`,
	intro: [],
	numberedClauses: true,
	sections: [
		{
			id: 'alcance',
			title: 'Generalidades y alcance',
			clauses: [
				{
					text: `Estos Términos y condiciones generales de membresía (los «Términos») se aplican a todos los contratos celebrados entre ${LEGAL_NAME} («${SITE_NAME}») y las personas usuarias de la Plataforma (los «Miembros»), que actúan como consumidores y la usan exclusivamente con fines personales y no comerciales.`
				},
				{
					text: `${SITE_NAME} es una plataforma digital operada desde la República del Ecuador que permite a los Miembros acceder, con una sola membresía mensual, a una red de gimnasios, estudios y centros de actividad física y bienestar mediante una aplicación móvil, este sitio web y servicios complementarios (conjuntamente, la «Plataforma»).`
				},
				{
					text: 'Los servicios deportivos y de bienestar a los que se accede a través de la Plataforma (las «Ofertas») los prestan, bajo su propia responsabilidad, terceros independientes como gimnasios, estudios y otros centros aliados (los «Partners»).'
				},
				{
					text: 'Estos Términos se aplican a todos los procesos de registro, solicitud y contratación de una membresía o suscripción hechos de forma electrónica a través de la Plataforma (cada uno, una «Membresía»), y forman parte integral de cada Membresía.'
				},
				{
					text: `${SITE_NAME} pone la Plataforma a disposición de los Miembros como un medio tecnológico para facilitar el acceso a las Ofertas. El servicio que se recibe en cada centro lo presta el Partner correspondiente: ${SITE_NAME} no asume responsabilidad por su contenido, cumplimiento, disponibilidad, calidad o resultados.`
				},
				{
					text: `Los Partners no actúan como representantes, mandatarios ni agentes de ${SITE_NAME}, ni ${SITE_NAME} de ellos. ${SITE_NAME} no está obligada a tramitar reclamos ni a mediar disputas entre Miembros y Partners, sin perjuicio de la atención al cliente que pueda ofrecer.`
				},
				{
					text: `Estos Términos se aplican también a las relaciones contractuales futuras entre ${SITE_NAME} y el Miembro, y se consideran aceptados, a más tardar, cuando el Miembro usa la Plataforma. Prevalecen sobre cualquier otra condición del Miembro, salvo aceptación expresa y por escrito de ${SITE_NAME}; los acuerdos individuales celebrados en casos particulares prevalecen sobre estos Términos.`
				},
				{
					text: `Las notificaciones que el Miembro deba enviar a ${SITE_NAME}, en especial las cancelaciones o solicitudes sobre su Membresía, se harán por escrito en formato de texto (por ejemplo, un correo a ${CONTACT_EMAIL}) o desde las opciones de la aplicación, salvo que estos Términos indiquen otra forma.`
				}
			]
		},
		{
			id: 'uso',
			title: 'Uso de la Plataforma y prueba gratis',
			clauses: [
				{
					text: `Con la Membresía, ${SITE_NAME} otorga al Miembro el uso de la Plataforma a cambio del pago de la tarifa del plan contratado (la «Tarifa de Membresía»).`
				},
				{
					text: `${SITE_NAME} procurará ofrecer una red variada, pero el Miembro no tiene derecho a una Oferta concreta, a un número mínimo de Partners ni a disponibilidad garantizada en horarios o zonas determinadas.`
				},
				{
					text: `${SITE_NAME} puede ofrecer acceso limitado sin costo durante el tiempo que determine (la «Prueba gratis»), y modificarla o terminarla en cualquier momento. Si así se indica al activarla, la Prueba gratis se convierte automáticamente en una Membresía de pago.`
				},
				{
					text: `${SITE_NAME} puede apoyarse en proveedores y subcontratistas (pagos, mensajería, alojamiento) para cumplir sus obligaciones.`
				}
			]
		},
		{
			id: 'cuenta',
			title: 'Cuenta, contratación y cambio de plan',
			clauses: [
				{
					text: 'Para usar la Plataforma el Miembro debe crear una cuenta aceptando estos Términos, facilitando sus datos personales y creando una contraseña (la «Cuenta del Miembro»). Desde ella puede contratar una Membresía. Los planes mostrados pueden variar y no constituyen una oferta irrevocable.'
				},
				{
					text: `El proceso incluye elegir el plan, revisar los datos, seleccionar el método de pago y confirmar. La Membresía queda vigente cuando ${SITE_NAME} confirma su activación por correo, dentro de la aplicación o con la confirmación del pago.`
				},
				{
					text: `La Plataforma es solo para mayores de 18 años. ${SITE_NAME} puede pedir información razonable para validar la identidad del Miembro cuando el control de acceso en un Partner lo requiera.`
				},
				{
					text: 'El Miembro puede cambiar a un plan con más o menos check-ins desde la aplicación. Subir de plan puede aplicarse de inmediato, de forma que se siga entrenando el mismo mes; bajar de plan se aplica a partir del siguiente periodo de facturación. La regla concreta se muestra antes de confirmar el cambio.'
				},
				{ text: 'El Miembro debe dar información completa y veraz, mantenerla actualizada y solo puede tener una Cuenta del Miembro.' },
				{
					text: `${SITE_NAME} puede eliminar cuentas inactivas o sin Membresía vigente durante periodos prolongados y atender solicitudes de eliminación de cuenta cuando no haya una Membresía activa, conservando los comprobantes y registros que exijan las obligaciones legales y tributarias.`
				}
			]
		},
		{
			id: 'check-ins',
			title: 'Membresía y check-ins',
			clauses: [
				{
					text: 'La Membresía da derecho a un número de check-ins al mes según el plan contratado. Un check-in es cada entrada a un centro aliado, que se registra escaneando desde la aplicación el código QR de la recepción del Partner.'
				},
				{
					text: 'Los check-ins se rigen por estas reglas:',
					items: [
						{ text: 'Se renuevan con cada periodo mensual de facturación, conforme al plan contratado.' },
						{ text: 'Los check-ins no usados en el periodo no se acumulan para el siguiente.' },
						{
							text: 'Se puede hacer check-in a diario hasta agotar los del plan, pero no se permiten varios check-ins en el mismo centro el mismo día.'
						},
						{
							text: 'No son dinero, no generan intereses, no son canjeables por efectivo y no son transferibles a otra persona.'
						},
						{
							text: 'Una reserva cancelada desde la aplicación con la antelación indicada no consume check-in; si el Miembro no se presenta sin haber cancelado, la visita cuenta como usada.'
						}
					]
				},
				{
					text: 'En el centro aliado el Miembro no paga la entrada aparte. Los servicios adicionales que el Partner ofrezca fuera de la Membresía (productos, clases privadas u otros) se contratan y pagan directamente con él.'
				},
				{
					text: 'Cada Partner decide qué clases y horarios pone a disposición de los Miembros y puede aplicar sus propias normas de uso de las instalaciones, que el Miembro se obliga a respetar.'
				}
			]
		},
		{
			id: 'empresas',
			title: 'Membresías corporativas',
			clauses: [
				{
					text: `Cuando una empresa contrata ${SITE_NAME} como beneficio para su equipo, el Miembro accede con el plan que la empresa le asigna. Las condiciones de pago entre la empresa y ${SITE_NAME} se rigen por su acuerdo particular, y estos Términos se aplican al Miembro en todo lo demás.`
				},
				{
					text: 'Si la empresa da de baja al Miembro o termina su acuerdo, la Membresía corporativa termina en la fecha que corresponda según ese acuerdo. El Miembro puede, si lo desea, continuar con una Membresía individual pagada por él.'
				}
			]
		},
		{
			id: 'derechos-de-uso',
			title: 'Derechos y restricciones de uso',
			clauses: [
				{
					text: `${SITE_NAME} concede al Miembro un derecho no exclusivo, intransferible y no sublicenciable para usar la Plataforma con fines personales durante la vigencia de la Membresía.`
				},
				{
					text: 'El Miembro no puede revender ni explotar comercialmente la Plataforma, copiarla, descompilarla o intentar obtener su código, modificarla sin autorización, vulnerar su seguridad, enviar software malicioso, cometer fraude, interferir con sus sistemas, intentar accesos no autorizados ni hacer pruebas de penetración sin autorización escrita.'
				},
				{
					text: 'El Miembro no puede reproducir ni distribuir los contenidos de la Plataforma sin autorización, salvo las funciones expresamente permitidas.'
				}
			]
		},
		{
			id: 'obligaciones',
			title: 'Obligaciones del Miembro',
			clauses: [
				{
					text: 'El Miembro usará la Plataforma cumpliendo la ley y estos Términos, y es responsable del equipo, la conexión a internet y el software con que accede a ella.'
				},
				{
					text: `El Miembro es responsable de la seguridad de su Cuenta del Miembro y de sus credenciales. Si sospecha un acceso no autorizado debe cambiarlas y avisar a ${SITE_NAME}.`
				},
				{
					text: 'La Membresía es personal: el Miembro no puede permitir que terceros usen su cuenta ni compartir su código de check-in.'
				},
				{
					text: `${SITE_NAME} puede investigar los reportes de mal uso y, de forma proporcional, restringir el acceso del Miembro en caso de incumplimiento.`
				}
			]
		},
		{
			id: 'soporte',
			title: 'Soporte y disponibilidad',
			clauses: [
				{
					text: `${SITE_NAME} ofrece soporte razonable a través de ${CONTACT_EMAIL} y del Centro de ayuda de este sitio, incluido en la Tarifa de Membresía.`
				},
				{
					text: `${SITE_NAME} hará esfuerzos razonables para mantener la Plataforma disponible y minimizar las interrupciones, salvo mantenimientos programados o no programados y causas fuera de su control. ${SITE_NAME} no responde por fallos de la conexión a internet o del dispositivo del Miembro.`
				},
				{
					text: `Si un reporte no corresponde a un fallo de la Plataforma, ${SITE_NAME} puede rechazarlo o pedir información adicional.`
				}
			]
		},
		{
			id: 'pagos',
			title: 'Tarifa de Membresía y pagos',
			clauses: [
				{
					text: 'El Miembro paga la Tarifa de Membresía del plan contratado una vez al mes, con los métodos de pago habilitados en la Plataforma. Los precios publicados incluyen IVA.'
				},
				{ text: 'Una suscripción anual, al terminar, se convierte automáticamente en una suscripción mensual.' },
				{ text: `Si un cobro falla, ${SITE_NAME} puede restringir el acceso hasta que el pago se regularice.` },
				{
					text: 'Si hay contracargos injustificados o fallos de pago imputables al Miembro, este asumirá los costos razonables asociados, en la medida en que la ley lo permita.'
				}
			]
		},
		{
			id: 'promociones',
			title: 'Cupones, promociones y referidos',
			clauses: [
				{
					text: `${SITE_NAME} puede ofrecer cupones, promociones y referidos con las condiciones que muestre en cada caso (vigencia, uso único, intransferibilidad, exclusiones).`
				},
				{
					text: `${SITE_NAME} puede anular los beneficios obtenidos por fraude o abuso, y el Miembro no puede publicar ni comercializar cupones o códigos sin autorización expresa.`
				}
			]
		},
		{
			id: 'duracion',
			title: 'Duración, cancelación y terminación',
			clauses: [
				{ text: 'La Membresía empieza en la fecha de su activación y se renueva automáticamente cada mes, salvo que se cancele.' },
				{
					text: 'No hay permanencia ni penalización. El Miembro puede cancelar la renovación desde la aplicación en cualquier momento y sigue teniendo acceso hasta que termine el periodo que ya pagó.'
				},
				{
					text: `${SITE_NAME} puede terminar la Membresía por causa justificada, incluyendo impago prolongado, fraude, datos falsos, cesión de la cuenta, incumplimientos graves o abuso sistemático.`
				}
			]
		},
		{
			id: 'garantia',
			title: 'Garantía limitada',
			clauses: [
				{
					text: `${SITE_NAME} procurará que la Plataforma mantenga sus funciones esenciales conforme a su descripción vigente, sujeto a limitaciones técnicas y a la dependencia de terceros. Las descripciones, capturas o materiales promocionales no constituyen garantías absolutas.`
				}
			]
		},
		{
			id: 'propiedad',
			title: 'Propiedad intelectual y actualizaciones',
			clauses: [
				{ text: `La Plataforma, la marca ${SITE_NAME}, su software y sus elementos son propiedad de ${LEGAL_NAME} o de sus licenciantes.` },
				{ text: `${SITE_NAME} puede actualizar la Plataforma por razones técnicas, de seguridad, económicas o legales.` }
			]
		},
		{
			id: 'privacidad',
			title: 'Privacidad',
			clauses: [
				{
					text: `${SITE_NAME} cumplirá la normativa ecuatoriana de protección de datos, en particular la Ley Orgánica de Protección de Datos Personales. El tratamiento de los datos personales se detalla en las Políticas de privacidad de ${SITE_NAME}.`,
					link: PRIVACY_POLICY_LINK
				}
			]
		},
		{
			id: 'indemnidad',
			title: 'Indemnidad',
			clauses: [
				{
					text: `En la medida en que la ley lo permita, el Miembro mantendrá indemne a ${SITE_NAME} frente a reclamos de terceros derivados del uso ilegal de la Plataforma o del incumplimiento de estos Términos.`
				}
			]
		},
		{
			id: 'responsabilidad',
			title: 'Limitación de responsabilidad',
			clauses: [
				{
					text: `${SITE_NAME} responde sin limitación en caso de dolo o culpa grave y en los casos en que la ley no permite limitar la responsabilidad. En los demás casos, la responsabilidad se limita a los daños previsibles y típicos, conforme a la ley aplicable.`
				},
				{
					text: `${SITE_NAME} no responde por la ejecución, calidad, disponibilidad, seguridad o resultados de los servicios que prestan los Partners.`
				},
				{
					text: `El Miembro reconoce que la actividad física implica riesgos y que es su responsabilidad valorar su estado de salud antes de entrenar. ${SITE_NAME} no garantiza resultados deportivos ni de salud.`
				}
			]
		},
		{
			id: 'retracto',
			title: 'Derecho de retracto',
			clauses: [
				{
					text: 'Cuando la normativa ecuatoriana reconozca el derecho de retracto en la contratación a distancia, el Miembro podrá ejercerlo dentro del plazo legal, siempre que no haya usado el servicio o con el ajuste proporcional a lo efectivamente usado, conforme a la ley.'
				},
				{ text: `Para ejercerlo, el Miembro debe enviar una declaración clara a ${CONTACT_EMAIL}.` }
			]
		},
		{
			id: 'cesion',
			title: 'Cesión',
			clauses: [
				{
					text: `${SITE_NAME} puede ceder la Membresía o los derechos relacionados a terceros, siempre que no afecte de forma material los derechos del Miembro.`
				},
				{ text: `El Miembro no puede ceder sus derechos u obligaciones sin el consentimiento escrito de ${SITE_NAME}.` }
			]
		},
		{
			id: 'modificaciones',
			title: 'Acuerdo íntegro y modificaciones',
			clauses: [
				{
					text: 'La Membresía y estos Términos constituyen el acuerdo íntegro entre las partes. Si una disposición resulta inválida, las demás siguen vigentes y aquella se sustituye por una válida equivalente.'
				},
				{
					text: `${SITE_NAME} puede actualizar estos Términos por razones técnicas, económicas o legales, y comunicará los cambios importantes por correo o dentro de la aplicación con antelación razonable. El uso continuado de la Plataforma implica su aceptación, salvo norma imperativa en contrario.`
				}
			]
		},
		{
			id: 'ley-aplicable',
			title: 'Ley aplicable y jurisdicción',
			clauses: [
				{
					text: 'Estos Términos y cualquier controversia contractual o extracontractual se rigen por las leyes de la República del Ecuador.'
				},
				{
					text: `Las controversias se someterán a los jueces competentes de Quito, Ecuador, salvo que una norma imperativa disponga otra cosa.`
				}
			]
		}
	],
	signature: [LEGAL_NAME, 'Quito – Ecuador', 'Octubre de 2026']
};
