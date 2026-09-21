/** One of the three lime cards of «¿Cuánto puedes crecer con Movia?». */
export interface PartnerGrowthStat {
	/** The figure itself, written as the design shows it («+8–13%», «~$2,900»). */
	value: string;
	/** What the figure measures, printed under it. */
	description: string;
}

/** A line of the «La solución» list, the one with the diagonal arrow. */
export interface PartnerSolutionStep {
	/** What the studio does, in bold. */
	title: string;
	/** Short clarification printed under the title. */
	note: string;
}

/** One of the four reasons of «Riesgo Cero. Solo Ganas». */
export interface PartnerGuarantee {
	/** Title of the guarantee. */
	title: string;
	/** One sentence expanding on it. */
	description: string;
}
