import { ActivityCategory, Benefit, CompanyPerk, HeroCard, HowToStep } from '@core/interfaces/home.interface';
import { FaqItem } from '@core/interfaces/faq.interface';

/** Cards under the hero. The labels are the ones of the design, not the route names. */
export const HERO_CARDS: readonly HeroCard[] = [
	{ title: 'Planes', lead: 'Deporte y bienestar a tu ritmo,', rest: 'donde quieras y como quieras.', path: '/plans' },
	{ title: 'Partners', lead: 'Únete al movimiento', rest: 'e Inspira una vida más activa y saludable', path: '/partners' },
	{ title: 'Empresas', lead: 'Equipos felices y sanos', rest: 'que mejoran sus talentos', path: '/corporate' }
];

/**
 * The three steps of «Así es como Movía transforma la manera en que te mueves».
 *
 * Choosing the plan is NOT one of them any more: it is what someone does once,
 * before anything else, and it already has the whole `/plans` page and the
 * subscribe button of the header. What is left here is the loop that repeats
 * every week — find, book, walk in — which is what the section is about.
 */
export const HOW_TO_STEPS: readonly HowToStep[] = [
	{
		number: 1,
		title: 'Elige la red.',
		description: 'Descubre en la app los centros aliados cerca de ti, filtra por categoría horarios y clases disponibles.'
	},
	{ number: 2, title: 'Reserva.', description: 'Reserva tu clase con anticipación, o simplemente acércate a los centros de acceso libre.' },
	{ number: 3, title: 'Haz check-in.', description: 'Escanea el QR con la app de Movia y listo: cada visita cuenta como un check-in de tu plan.' }
];

/**
 * Photos of the activity categories strip. The copy says eight categories but the
 * design only shows five photos, so only those five are here.
 */
export const ACTIVITY_CATEGORIES: readonly ActivityCategory[] = [
	{ name: 'Artes marciales', image: '/imgs/home/categorias/artes-marciales.webp' },
	{ name: 'Gimnasio', image: '/imgs/home/categorias/gimnasio.webp' },
	{ name: 'Yoga', image: '/imgs/home/categorias/yoga.webp' },
	{ name: 'Natación', image: '/imgs/home/categorias/natacion.webp' },
	{ name: 'Baile', image: '/imgs/home/categorias/baile.webp' }
];

/** The three reasons of the dark «Variedad sin límites» section. */
export const BENEFITS: readonly Benefit[] = [
	{
		icon: 'icon-flexibilidad',
		title: 'Flexibilidad total',
		description: 'Sin permanencia forzada ni pagos por local. Entrena en distintos centros y ciudades con la misma suscripción.'
	},
	{
		icon: 'icon-descubrimiento',
		title: 'Descubrimiento',
		description: 'Cambia de rutina cuando quieras: hoy natación, mañana artes marciales, el fin de semana un masaje en el spa.'
	},
	{
		icon: 'icon-simplicidad',
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
 * The design shows the six accordions closed, so the ANSWERS are not in it: they are
 * written from what the landing itself claims (one monthly membership, check-in by QR,
 * many centres, no lock-in).
 *
 * PENDIENTE de confirmar con negocio, porque no sale de ninguna pantalla: (1) si los
 * check-ins sin usar se pierden al renovar, (2) si al cancelar se sigue entrando hasta
 * acabar el mes pagado, (3) si los precios publicados llevan el IVA dentro y (4) con
 * cuánta antelación hay que cancelar una reserva para no gastar el check-in. Las cuatro
 * están redactadas con la respuesta más habitual en este modelo.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
	{
		id: 'check-in',
		question: '¿Qué es un check-in?',
		answer: 'Es cada entrada a un centro aliado: llegas, abres la app y escaneas el QR de recepción. Esa visita descuenta un check-in de los que incluye tu plan del mes, y en el local no pagas nada más.'
	},
	{
		id: 'gimnasios',
		question: '¿Puedo ir a distintos gimnasios?',
		answer: 'Sí, y esa es justamente la idea: con una sola membresía entras a cualquier centro de la red. Gimnasio un día, yoga al siguiente y natación el fin de semana, en tu ciudad o en cualquier otra donde Movia tenga aliados, sin matrícula ni mensualidad por local.'
	},
	{
		id: 'check-ins-agotados',
		question: '¿Qué pasa si uso todos mis check-ins?',
		answer: 'Puedes subir a un plan con más check-ins desde la app y seguir entrenando el mismo día, o esperar a que tu mes se renueve y vuelvas a tenerlos completos. Tu cuenta no se bloquea: sigues viendo la red de centros y sus horarios.'
	},
	{
		id: 'permanencia',
		question: '¿Hay permanencia o contratos largos?',
		answer: 'No. Es una suscripción mensual que cancelas cuando quieras desde la app, sin permanencia, sin matrícula y sin penalización. Al cancelar sigues entrando hasta que termine el mes que ya pagaste.'
	},
	{
		id: 'impuestos',
		question: '¿Los precios incluyen impuestos?',
		answer: 'Sí. El precio que ves en cada plan es el final, con impuestos incluidos: es exactamente lo que se cobra cada mes, sin cargos por inscripción ni sorpresas en el centro.'
	},
	{
		id: 'cancelar-clase',
		question: '¿Qué pasa si cancelo una clase?',
		answer: 'Si cancelas con antelación no se consume el check-in y la plaza queda libre para otra persona. Si no avisas y no te presentas, esa visita sí cuenta como usada: es lo que mantiene los cupos disponibles para quien sí va.'
	}
];
