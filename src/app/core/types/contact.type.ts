/**
 * Who the person writing through the contact form speaks for.
 *
 * The three doors of the product, the same three the help centre is split into.
 * The values are the ones `api-movia` stores in `contact_requests.audience`, so
 * they travel as they are written here: the Spanish label lives in
 * `CONTACT_AUDIENCES` and never reaches the API.
 */
export type ContactAudience = 'user' | 'corporate' | 'partner';
