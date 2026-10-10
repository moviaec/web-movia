import { NavLink } from './navigation.interface';

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

/** One entry of a list inside a clause, with an optional bold lead-in. */
export interface LegalListItem {
	/** Lead-in printed in bold before the text («Datos de cuenta»). Optional. */
	term?: string;
	/** Body of the entry. */
	text: string;
}

/** One clause of a legal document: a paragraph, optionally followed by a list and a link. */
export interface LegalClause {
	/** Paragraph of the clause. */
	text: string;
	/** List printed right under the paragraph. */
	items?: readonly LegalListItem[];
	/** Link to another page of the site printed after the paragraph. */
	link?: NavLink;
}

/** One numbered section of a legal document. */
export interface LegalSection {
	/** Stable key, used to track the list and as the anchor of the heading. */
	id: string;
	/** Heading of the section, without its number. */
	title: string;
	/** Clauses of the section, in order. */
	clauses: readonly LegalClause[];
}

/** Full content of a legal page. */
export interface LegalDocumentContent {
	/** Small label above the title («Documento legal»). */
	eyebrow: string;
	/** Title of the page: its only `h1`. */
	title: string;
	/** Line under the title with who issues it and since when it applies. */
	meta: string;
	/** Paragraphs before the first section. */
	intro: readonly string[];
	/** Whether every clause is numbered as `<section>.<clause>`, the way a contract is. */
	numberedClauses: boolean;
	/** Sections of the document, in order. */
	sections: readonly LegalSection[];
	/** Lines of the closing signature block. Empty when the document has none. */
	signature: readonly string[];
}
