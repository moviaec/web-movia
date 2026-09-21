import { CorporateBenefit, CorporateModelStep, CorporateReason } from '@core/interfaces/corporate.interface';

/** The four lime cards that explain the co-financed 50/50 model. */
export const CORPORATE_MODEL_STEPS: readonly CorporateModelStep[] = [
	{ title: 'La empresa firma un contrato corporativo con Movia', note: '(No hay pago individual al empleado).' },
	{ title: 'La empresa paga el 50% ($25) y el colaborador el 50% ($25)', note: 'De la membresía de $49,99.' },
	{
		title: 'Los colaboradores acceden a toda la red',
		note: 'Gimnasio, yoga, natación, cycling, pilates, artes marciales, spa y danza con una sola membresía.'
	},
	{ title: 'Ambos obtienen beneficio fiscal', note: 'La empresa deduce el 100% de su aporte; el colaborador deduce su copago.' }
];

/** The two sides of the deal, each with its photo and its checklist. */
export const CORPORATE_BENEFITS: readonly CorporateBenefit[] = [
	{
		title: 'Empresa',
		image: '/imgs/corporate/beneficios-empresa.webp',
		imageAlt: 'Dos personas dándose la mano en el gimnasio de una empresa',
		items: [
			'Gasto 100% deducible del Impuesto a la Renta',
			'Escudo fiscal del 25%',
			'No constituye materia gravada del IESS',
			'No afecta décimos ni fondos de reserva',
			'Retención de talento y employer branding',
			'Administración simple'
		]
	},
	{
		title: 'Colaborador',
		image: '/imgs/corporate/beneficios-colaborador.webp',
		imageAlt: 'Un grupo de compañeros de trabajo entrenando juntos',
		items: [
			'Acceso a las 8 categorías y a toda la red de centros aliados con una sola membresía.',
			'Copago deducible como gasto personal de salud',
			'Valor percibido enorme: por su copago accede a decenas de centros y disciplinas.',
			'Flexibilidad total: elige cuándo, dónde y qué disciplina practicar'
		]
	}
];

/** Quote that closes the dark band, above «¿Por qué Movia?». */
export const CORPORATE_QUOTE = '“ El mejor beneficio es el acompañar a tus colaboradores en su salud”';

/** The four reasons to pick Movía as the corporate wellness provider. */
export const CORPORATE_REASONS: readonly CorporateReason[] = [
	{
		title: 'Red diversa',
		description: 'Acceso a ocho categorías —gimnasio, yoga, natación, cycling, pilates, artes marciales, spa y danza— en una sola membresía.'
	},
	{
		title: '100% digital',
		description: 'App para reservas, tracking de uso y reportes para RR. HH.: visibilidad total sobre la adopción del programa.'
	},
	{
		title: 'Hecho en Ecuador',
		description: 'Plataforma local, con conocimiento del marco regulatorio ecuatoriano y facturación conforme al SRI.'
	},
	{
		title: 'Un solo contrato',
		description: 'Administración centralizada, sin gestionar múltiples proveedores y con estructura legal óptima para la deducibilidad.'
	}
];

/** The four things a company has to do to start, each with its lime tick. */
export const CORPORATE_ONBOARDING_STEPS: readonly string[] = [
	'Formalizar el contrato corporativo empresa–Movia.',
	'Establecer la política interna como servicio colectivo no remunerativo.',
	'Configurar la facturación electrónica conforme al SRI.',
	'Comunicar la ventaja fiscal y el beneficio a los colaboradores.'
];
