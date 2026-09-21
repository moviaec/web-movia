import { ContactAudience } from '@core/types/contact.type';

/** One of the audiences to choose from before writing. */
export interface ContactAudienceOption {
	/** Value sent to the API. */
	value: ContactAudience;
	/** Label shown on the selector, in Spanish. */
	label: string;
	/** One line saying who should pick this one. */
	description: string;
	/**
	 * Whether this audience is asked for the name of the company or centre it
	 * speaks for. False for someone writing as a user, who speaks for nobody.
	 */
	needsCompany: boolean;
	/** Label of the company field for this audience («Empresa», «Centro»…). */
	companyLabel: string;
	/**
	 * Example shown inside the company field while it is empty.
	 *
	 * It belongs to the audience, like the label: a company writes its trade name
	 * and a centre the name of its gym, and one example cannot stand for both.
	 */
	companyPlaceholder: string;
}

/** The message, as the API expects it. */
export interface ContactRequest {
	audience: ContactAudience;
	fullName: string;
	email: string;
	/** Optional: the email address is enough to answer. */
	phone?: string;
	/** Company or centre the person speaks for. Absent when writing as a user. */
	company?: string;
	message: string;
}

/** What the API answers once the message is stored. */
export interface ContactRequestResult {
	/** Request number (`MOV-7K3QF2`), the same one that goes out by email. */
	reference: string;
	/** Confirmation in Spanish, ready to paint. */
	message: string;
}

/**
 * The form as it is edited on screen.
 *
 * Every field is a string and none of them is optional, which is what a set of
 * inputs actually holds: an untouched phone box is `''`, not `undefined`. The
 * empty ones are dropped when building the `ContactRequest` that goes out, so
 * the API never receives an empty string where it expects nothing.
 */
export interface ContactForm {
	audience: ContactAudience;
	fullName: string;
	email: string;
	phone: string;
	company: string;
	message: string;
}
