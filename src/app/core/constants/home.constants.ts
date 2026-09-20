import { ActivityCategory, Benefit, CompanyPerk, FaqItem, HeroCard, HowToStep } from '@core/interfaces/home.interface';

/** Cards under the hero. The labels are the ones of the design, not the route names. */
export const HERO_CARDS: readonly HeroCard[] = [
	{ title: 'Para ti', lead: 'Deporte y bienestar a tu ritmo,', rest: 'donde quieras y como quieras.', path: '/planes' },
	{ title: 'Partners', lead: 'Únete al movimiento', rest: 'e Inspira una vida más activa y saludable', path: '/estudios' },
	{ title: 'Empresas', lead: 'Equipos felices y sanos', rest: 'que mejoran sus talentos', path: '/empresas' }
];

/** The four steps of «Así es como Movía transforma la manera en que te mueves». */
export const HOW_TO_STEPS: readonly HowToStep[] = [
	{ number: 1, title: 'Elige el plan.', description: 'Selecciona la suscripción mensual que mejor se ajuste a tu ritmo de entrenamiento.' },
	{
		number: 2,
		title: 'Elige la red.',
		description: 'Descubre en la app los centros aliados cerca de ti, filtra por categoría horarios y clases disponibles.'
	},
	{ number: 3, title: 'Reserva.', description: 'Reserva tu clase con anticipación, o simplemente acércate a los centros de acceso libre.' },
	{ number: 4, title: 'Haz check-in.', description: 'Escanea el QR con la app de Movia y listo: cada visita cuenta como un check-in de tu plan.' }
];

/**
 * Photos of the activity categories strip. The copy says eight categories but the
 * design only shows five photos, so only those five are here.
 */
export const ACTIVITY_CATEGORIES: readonly ActivityCategory[] = [
	{ name: 'Artes marciales', image: '/imgs/home/categorias/artes-marciales.jpg' },
	{ name: 'Gimnasio', image: '/imgs/home/categorias/gimnasio.jpg' },
	{ name: 'Yoga', image: '/imgs/home/categorias/yoga.jpg' },
	{ name: 'Natación', image: '/imgs/home/categorias/natacion.jpg' },
	{ name: 'Danza', image: '/imgs/home/categorias/danza.jpg' }
];

/** The three reasons of the dark «Variedad sin límites» section. */
export const BENEFITS: readonly Benefit[] = [
	{
		icon: '/imgs/icons/flexibilidad.svg',
		title: 'Flexibilidad total',
		description: 'Sin permanencia forzada ni pagos por local. Entrena en distintos centros y ciudades con la misma suscripción.'
	},
	{
		icon: '/imgs/icons/descubrimiento.svg',
		title: 'Descubrimiento',
		description: 'Cambia de rutina cuando quieras: hoy natación, mañana artes marciales, el fin de semana un masaje en el spa.'
	},
	{
		icon: '/imgs/icons/simplicidad.svg',
		title: 'Simplicidad',
		description: 'Un solo cobro mensual, una sola app y check-in con QR. Todo tu bienestar, organizado en un solo lugar.'
	}
];

/** Lime cards of the studios section. */
export const STUDIO_PERKS: readonly string[] = ['$0 de costo inicial', 'Pago por check-in', 'Sin contratos', 'Tu controlas'];

/** Selling points of the companies section. */
export const COMPANY_PERKS: readonly CompanyPerk[] = [
	{ title: 'Atrae talento', description: 'Un beneficio que suma valor a tu equipo.' },
	{ title: 'Gestión simple', description: 'Una sola factura para toda la empresa.' },
	{ title: 'Más bienestar', description: 'Equipos activos, saludables y con más energía.' },
	{ title: 'Total flexibilidad', description: 'Cada persona elige dónde, cuándo y cómo moverse.' }
];

/**
 * Questions of the FAQ.
 *
 * PENDIENTE: en el diseño los seis acordeones salen cerrados, así que las RESPUESTAS
 * de abajo NO vienen de él: son un texto provisional escrito a partir de lo que la
 * propia página cuenta. Hay que sustituirlas por el copy real antes de publicar.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
	{
		id: 'check-in',
		question: '¿Qué es un check-in?',
		answer: 'Es cada visita a un centro aliado. Escaneas el QR con la app al llegar y esa visita se descuenta de las que incluye tu plan.'
	},
	{
		id: 'gimnasios',
		question: '¿Puedo ir a distintos gimnasios?',
		answer: 'Sí. Con la misma suscripción entras en cualquier centro de la red, en tu ciudad o en otra, sin pagar por local.'
	},
	{
		id: 'check-ins-agotados',
		question: '¿Qué pasa si uso todos mis check-ins?',
		answer: 'Puedes esperar a la siguiente renovación mensual o cambiar a un plan con más check-ins desde la propia app.'
	},
	{
		id: 'permanencia',
		question: '¿Hay permanencia o contratos largos?',
		answer: 'No. La suscripción es mensual y se cancela cuando quieras, sin permanencia ni penalización.'
	},
	{
		id: 'impuestos',
		question: '¿Los precios incluyen impuestos?',
		answer: 'Sí. El precio que ves en los planes es el final: es lo que se cobra cada mes.'
	},
	{
		id: 'cancelar-clase',
		question: '¿Qué pasa si cancelo una clase?',
		answer: 'Si cancelas con antelación, el check-in no se consume y la plaza queda libre para otra persona.'
	}
];
