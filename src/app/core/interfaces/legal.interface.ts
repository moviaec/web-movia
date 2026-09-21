/** One of the legal documents of the site, as it is listed on the `/legal` index. */
export interface LegalDocument {
	/** Stable key, used to track the list. */
	id: string;
	/** Name of the document, the way it is written in the footer. */
	title: string;
	/** One line saying what the document answers, so the index is readable and not just three links. */
	summary: string;
	/** Route of the document. */
	path: string;
}
