/** One of the subscription plans of the pricing page. */
export interface Plan {
	/** Commercial name of the plan. */
	name: string;
	/** Price as it is printed, currency included. */
	price: string;
	/** What the price is per, printed small next to it. */
	period: string;
	/** Who the plan is for, in one sentence. */
	description: string;
	/** What the plan includes, one line per feature; the first one is always the check-ins. */
	features: readonly string[];
	/** Whether this is the highlighted plan: lime card and «Plan popular» badge. */
	featured: boolean;
}
