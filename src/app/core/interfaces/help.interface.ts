import { FaqItem } from './faq.interface';

/** A block of the help centre: one audience with its own questions. */
export interface HelpGroup {
	/** Stable key, used to track the list and to label the block. */
	id: string;
	/** Title of the block, the audience it speaks to. */
	title: string;
	/** One sentence saying who should read this block. */
	description: string;
	/** Questions of this audience. */
	items: readonly FaqItem[];
}
