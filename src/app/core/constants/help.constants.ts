import { HelpGroup } from '@core/interfaces/help.interface';

/**
 * Content of the help centre, split by audience.
 *
 * Everything here is written from what the product is —one monthly membership that
 * opens the door of every partner centre, one check-in per visit— and from what the
 * landing already promises. Nothing comes from a design: the help centre is not in the
 * prototype.
 *
 * PENDIENTE de confirmar con negocio, porque no sale de ninguna pantalla: si los
 * check-ins sin usar se pierden al renovar, si al cancelar se sigue entrando hasta
 * acabar el mes pagado, si los precios llevan el IVA dentro, con cuánta antelación hay
 * que cancelar una reserva, el mínimo de personas de un plan de empresa, cada cuánto se
 * liquida a los partners y si hay co-pago entre empresa y empleado. Están redactadas con
 * la respuesta más habitual en este modelo y marcadas aquí para revisarlas antes de
 * publicar.
 */
export const HELP_GROUPS: readonly HelpGroup[] = [
	{
		id: 'usuarios',
		title: 'Para usuarios',
		description: 'Cómo funciona la membresía, los check-ins y el día a día en los centros.',
		items: [
			{
				id: 'que-es-movia',
				question: '¿Qué es Movia y en qué se diferencia de un gimnasio?',
				answer: 'Movia es una membresía mensual que te abre la puerta de toda una red de centros: gimnasios, estudios de yoga, artes marciales, natación, danza y bienestar. En vez de atarte a un local, pagas una sola suscripción y entras en cualquiera de ellos con la app.'
			},
			{
				id: 'como-empiezo',
				question: '¿Cómo empiezo?',
				answer: 'Descarga la app, crea tu cuenta y elige el plan que se ajuste a cuántas veces entrenas al mes. Desde ese momento ves los centros cercanos, sus horarios y puedes reservar o entrar directamente.'
			},
			{
				id: 'check-in',
				question: '¿Qué es un check-in?',
				answer: 'Es cada entrada a un centro aliado: llegas, abres la app y escaneas el QR de recepción. Esa visita descuenta un check-in de los que incluye tu plan del mes, y en el local no pagas nada más.'
			},
			{
				id: 'cambiar-deporte',
				question: '¿Puedo cambiar de deporte cuando quiera?',
				answer: 'Sí, esa es la idea. Puedes hacer pesas el lunes, yoga el miércoles y natación el sábado, en centros distintos y sin avisar a nadie: mientras te queden check-ins, eliges libremente.'
			},
			{
				id: 'que-llevar',
				question: '¿Necesito llevar carnet o algún documento?',
				answer: 'No. Tu entrada es el QR de la app, así que con el móvil basta. En algunos centros pueden pedirte tu nombre para la lista de una clase reservada.'
			},
			{
				id: 'check-ins-agotados',
				question: '¿Qué pasa si uso todos mis check-ins del mes?',
				answer: 'Puedes subir a un plan con más check-ins desde la app y seguir entrenando el mismo día, o esperar a que tu mes se renueve y vuelvas a tenerlos completos. Tu cuenta no se bloquea: sigues viendo la red y los horarios.'
			},
			{
				id: 'cancelar-reserva',
				question: '¿Qué pasa si reservo una clase y no puedo ir?',
				answer: 'Cancela desde la app con antelación y el check-in no se consume: la plaza queda libre para otra persona. Si no avisas y no te presentas, esa visita sí cuenta como usada.'
			},
			{
				id: 'cambiar-plan',
				question: '¿Puedo cambiar o cancelar mi plan?',
				answer: 'Sí, las dos cosas desde la app y sin llamar a nadie. No hay permanencia ni penalización: al cancelar sigues entrando hasta que termine el mes que ya pagaste.'
			},
			{
				id: 'ciudades',
				question: '¿En qué ciudades puedo usar Movia?',
				answer: 'En todo Ecuador, en cada ciudad donde haya centros aliados, y la red sigue creciendo. Tu membresía es la misma viajes donde viajes: el mapa de la app te muestra siempre lo que tienes cerca.'
			},
			{
				id: 'cobro',
				question: '¿Cómo y cuándo se me cobra?',
				answer: 'La suscripción se cobra una vez al mes con el medio de pago que registres en la app, y el precio que ves en el plan es el final, impuestos incluidos. En el centro nunca pagas la entrada aparte.'
			}
		]
	},
	{
		id: 'empresas',
		title: 'Para empresas',
		description: 'Cómo dar Movia como beneficio de bienestar a tu equipo.',
		items: [
			{
				id: 'que-es-empresas',
				question: '¿Qué es Movia para Empresas?',
				answer: 'Es la misma red, contratada por la empresa para su equipo: cada persona elige dónde, cuándo y qué entrenar, y tú gestionas un solo beneficio en vez de convenios con gimnasios sueltos.'
			},
			{
				id: 'facturacion',
				question: '¿Cómo se factura?',
				answer: 'Una sola factura mensual para toda la empresa, con el detalle de las personas activas. Ni reembolsos por empleado ni un contrato por cada local.'
			},
			{
				id: 'altas-bajas',
				question: '¿Podemos dar de alta y de baja a personas cuando queramos?',
				answer: 'Sí. El beneficio se administra desde el panel de empresa: das de alta a quien entra, das de baja a quien sale y el cobro del mes siguiente se ajusta solo.'
			},
			{
				id: 'minimo',
				question: '¿Hay un mínimo de personas para contratar?',
				answer: 'Trabajamos con equipos de todos los tamaños, desde oficinas pequeñas hasta plantillas grandes. Escríbenos y armamos la propuesta según cuántas personas vayan a usarlo.'
			},
			{
				id: 'uso',
				question: '¿Sabemos cuánto se usa el beneficio?',
				answer: 'Sí: verás cuántas personas lo activan y con qué frecuencia entrenan, de forma agregada. Es el dato que necesitas para justificar el beneficio, sin entrar en la actividad individual de nadie.'
			},
			{
				id: 'reparto',
				question: '¿La empresa paga todo o se puede compartir con el empleado?',
				answer: 'Se puede montar de las dos formas: que la empresa cubra el plan completo o que aporte una parte y la persona complete el resto. Lo definimos contigo antes de arrancar.'
			},
			{
				id: 'empezar-empresa',
				question: '¿Cómo empezamos?',
				answer: 'Escríbenos desde la página de contacto con el tamaño de tu equipo y te mandamos la propuesta. La activación es rápida: cada persona descarga la app y entra con el correo de la empresa.'
			}
		]
	},
	{
		id: 'partners',
		title: 'Para partners',
		description: 'Cómo funciona Movia si tienes un gimnasio, un estudio o un centro de bienestar.',
		items: [
			{
				id: 'que-gano',
				question: '¿Qué gano sumándome a Movia?',
				answer: 'Te conectamos con miles de personas activas que ya están buscando tu tipo de clase y que hoy no te conocen. Llenas las horas flojas y cobras por cada persona que entra, sin invertir en publicidad.'
			},
			{
				id: 'costo-inicial',
				question: '¿Cuánto cuesta entrar en la red?',
				answer: '$0 de costo inicial. No hay cuota de alta ni mensualidad: Movia solo gana cuando alguien hace check-in en tu centro.'
			},
			{
				id: 'pago-partner',
				question: '¿Cómo se me paga?',
				answer: 'Por check-in: cada visita que se registra en tu local se te liquida. En el panel de partner ves las visitas del periodo y lo que corresponde a cada una antes de que llegue el pago.'
			},
			{
				id: 'control-cupos',
				question: '¿Tengo que reservar cupos para Movia?',
				answer: 'Tú controlas qué clases y qué horarios abres, y puedes cambiarlos cuando quieras. Si una franja se te llena con tus propios socios, simplemente no la publicas.'
			},
			{
				id: 'contratos',
				question: '¿Hay contrato de permanencia?',
				answer: 'No. Trabajamos sin contratos de permanencia: si en algún momento no te sirve, dejas de publicar horarios y ya está.'
			},
			{
				id: 'registro-visita',
				question: '¿Cómo se registra la visita en recepción?',
				answer: 'La persona escanea el QR de tu local con la app y la visita queda registrada al instante, sin cobros en caja ni papeleo. Tu equipo de recepción ve la confirmación en el panel.'
			},
			{
				id: 'unirme',
				question: '¿Cómo me uno?',
				answer: 'Escríbenos desde la página de contacto con los datos de tu centro. Revisamos que encaje con la red, publicamos tu ficha y empiezas a recibir check-ins.'
			}
		]
	}
];
