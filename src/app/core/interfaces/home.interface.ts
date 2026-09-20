/** One of the three cards that sit under the hero and lead to the other pages. */
export interface HeroCard {
	/** Card title, also the name of the audience it targets. */
	title: string;
	/** Part of the description that goes in bold. */
	lead: string;
	/** Rest of the description. */
	rest: string;
	/** Route of this application the card opens. */
	path: string;
}

/** One of the four numbered steps that explain how Movía works. */
export interface HowToStep {
	/** Position shown inside the lime circle. */
	number: number;
	/** Title of the step, kept short and with its full stop, as in the design. */
	title: string;
	/** What the user does in this step. */
	description: string;
}

/** A photo of the activity categories strip. */
export interface ActivityCategory {
	/** Name of the category, used as the image description. */
	name: string;
	/** Path of the photo. */
	image: string;
}

/** One of the three reasons listed on the dark «Variedad sin límites» section. */
export interface Benefit {
	/** Path of the lime line icon. */
	icon: string;
	/** Title of the reason. */
	title: string;
	/** One sentence expanding on it. */
	description: string;
}

/** A selling point of the companies section, shown with an arrow icon. */
export interface CompanyPerk {
	/** Title of the perk. */
	title: string;
	/** One sentence expanding on it. */
	description: string;
}

/** A question of the frequently asked questions section. */
export interface FaqItem {
	/** Stable key, used to track the list and to tie the button to its panel. */
	id: string;
	/** The question, as written in the design. */
	question: string;
	/** The answer. PROVISIONAL: the design shows every accordion closed. */
	answer: string;
}
