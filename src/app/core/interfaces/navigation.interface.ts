/** A link of the site navigation. */
export interface NavLink {
	/** Visible text. Comes from the design, so it is in Spanish. */
	label: string;
	/** Route of this application the link points to. */
	path: string;
}

/** A link to a page that does not exist yet, kept as a placeholder. */
export interface PendingLink {
	/** Visible text. */
	label: string;
}
