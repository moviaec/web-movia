/** A question and its answer, shown inside an accordion. */
export interface FaqItem {
	/** Stable key, used to track the list and to tie the button to its panel. */
	id: string;
	/** The question. */
	question: string;
	/** The answer. */
	answer: string;
}
