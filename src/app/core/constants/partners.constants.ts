import { HowToStep } from '@core/interfaces/home.interface';
import { PartnerGrowthStat, PartnerGuarantee, PartnerSolutionStep } from '@core/interfaces/partners.interface';

/** The three lime cards that put a number on what joining the network is worth. */
export const PARTNER_GROWTH_STATS: readonly PartnerGrowthStat[] = [
	{ value: '+8–13%', description: 'Incremento en ingresos mensuales para partners' },
	{ value: '+20–40%', description: 'Más ingresos por m² al subir la ocupación del 40% al 85%' },
	{ value: '~$2,900', description: 'Ingresos adicionales al mes vs. estudios sin red' }
];

/** What joining Movía looks like, from signing up to getting paid. */
export const PARTNER_SOLUTION_STEPS: readonly PartnerSolutionStep[] = [
	{ title: 'Te unes a la red,', note: 'sin costo inicial.' },
	{ title: 'Publicas tus horarios y spots disponibles,', note: 'Tú decides cuántos y cuándo.' },
	{ title: 'Los usuarios reservan y asisten', note: 'a tus clases.' },
	{ title: 'Recibes un pago por cada check-in', note: 'Automático, cada mes.' }
];

/** The four reasons why listing a studio carries no risk. */
export const PARTNER_GUARANTEES: readonly PartnerGuarantee[] = [
	{ title: '$0 de costo inicial', description: 'Sin fee de setup, sin pago para entrar. Listar tu estudio es gratis.' },
	{ title: 'Pago por check-in', description: 'Sin visita, no hay costo. Cada check-in es ingreso para ti.' },
	{ title: 'Sin contrato', description: 'Sin compromisos de largo plazo. Entras y sales cuando quieras.' },
	{ title: 'Tú controlas', description: 'Tú decides los horarios, cuántos spots liberas y qué clases ofreces.' }
];

/**
 * The four steps of «¿Cómo Funciona En Tu Estudio?», told from the studio's side.
 *
 * They reuse `HowToStep` —the shape of the home steps— on purpose: it is the same
 * numbered step in a lime circle, and a second identical interface would be the
 * duplicated object shape that `CLAUDE.md` forbids.
 */
export const PARTNER_CHECKIN_STEPS: readonly HowToStep[] = [
	{ number: 1, title: 'Reserva', description: 'El usuario encuentra tu clase en la app y reserva su lugar.' },
	{ number: 2, title: 'Llega', description: 'Ve el stand de Movia con el código QR en tu recepción.' },
	{ number: 3, title: 'Escanea', description: 'Abre la app y escanea el QR: check-in listo.' },
	{ number: 4, title: 'Ganas', description: 'Recibes $3,21 por ese check-in, de forma automática.' }
];
