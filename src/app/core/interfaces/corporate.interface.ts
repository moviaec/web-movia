/** One of the four lime cards of «Cómo funciona el modelo 50/50». */
export interface CorporateModelStep {
	/** What happens, in bold. */
	title: string;
	/** Short clarification printed under the title. */
	note: string;
}

/** One of the two benefit cards, each with its photo and its checklist. */
export interface CorporateBenefit {
	/** Who the card is about: «Empresa» or «Colaborador». */
	title: string;
	/** Path of the photo that sits on top of the card. */
	image: string;
	/** What the photo shows, for `alt`. */
	imageAlt: string;
	/** The checklist itself, one line per advantage. */
	items: readonly string[];
}

/** One of the four reasons of «¿Por qué Movia?». */
export interface CorporateReason {
	/** Title of the reason. */
	title: string;
	/** One sentence expanding on it. */
	description: string;
}
