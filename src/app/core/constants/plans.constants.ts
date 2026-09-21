import { Plan } from '@core/interfaces/plan.interface';

/**
 * The three individual plans, from the cheapest to the most expensive.
 *
 * The corporate one is NOT here on purpose: va en su propio bloque (`CORPORATE_PLAN`)
 * porque el diseño lo separa del grupo de planes individuales, y mezclarlos en la misma
 * lista obligaría a filtrar en la plantilla para pintar dos cosas distintas.
 */
export const PLANS: readonly Plan[] = [
	{
		name: 'Basic',
		price: '$39,99',
		period: '/mes',
		description: 'Para empezar a moverte sin comprometer tu rutina ni tu presupuesto.',
		features: [
			'8 check-ins al mes',
			'Acceso a más de 5.000 lugares',
			'Clases online incluidas',
			'Reserva desde la aplicación',
			'Sin permanencia: cancelas cuando quieras'
		],
		featured: false
	},
	{
		name: 'Standard',
		price: '$59,99',
		period: '/mes',
		description: 'Para quienes entrenan varias veces por semana y alternan disciplinas.',
		features: [
			'16 check-ins al mes',
			'Acceso a toda la red de centros aliados',
			'Clases en vivo y bajo demanda',
			'Reserva con 7 días de antelación',
			'Soporte prioritario'
		],
		featured: true
	},
	{
		name: 'Premium',
		price: '$69,99',
		period: '/mes',
		description: 'Máxima flexibilidad para quienes viven y respiran deporte.',
		features: [
			'28 check-ins al mes',
			'Todo lo del plan Standard',
			'Centros de bienestar premium',
			'Dos pases de invitado al mes',
			'Sesiones con entrenador personal'
		],
		featured: false
	}
];

/** The corporate plan, shown apart from the individual ones and with its own badge. */
export const CORPORATE_PLAN: Plan = {
	name: 'Enterprise',
	price: '$49,99',
	period: '/mes por colaborador',
	description: 'El plan de empresa: la compañía co-financia la mitad y el colaborador paga el resto.',
	features: [
		'16 check-ins al mes por colaborador',
		'Una sola factura para toda la empresa',
		'Panel de RR. HH. con reportes de uso',
		'Altas y bajas de colaboradores cuando quieras',
		'Gasto 100% deducible del Impuesto a la Renta',
		'Sin fee de alta ni permanencia'
	],
	featured: false
};

/** Label of the pill that marks the highlighted plan. */
export const PLANS_FEATURED_BADGE = 'Plan popular';

/** Label of the pill that marks the corporate plan as what it is. */
export const PLANS_CORPORATE_BADGE = 'Para empresas';

/** The small print under the cards, one string per paragraph. */
export const PLANS_LEGAL_NOTE: readonly string[] = [
	'*Todos los precios incluyen IVA. En nuestros centros colaboradores, puedes hacer check-in a diario hasta agotar los check-ins de tu plan en el mes natural; no se permiten múltiples check-ins en el mismo centro el mismo día.',
	'Tu suscripción anual se convertirá automáticamente en una suscripción mensual una vez finalizada.'
];
