import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CONTACT_REQUESTS_PATH } from '@core/constants/contact.constants';
import { ContactRequest, ContactRequestResult } from '@core/interfaces/contact.interface';

import { environment } from '../../../environments/environment';

/**
 * The contact form against `api-movia`.
 *
 * This is the ONLY place in the landing that talks to a server. The site is a
 * static build with its content in `core/constants/`, and that has not changed:
 * what a contact message needs is somewhere to be stored and an address to
 * answer, and neither of those can live in a prerendered HTML file. The decision
 * and its consequences are written down in `docs/decisiones/`.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
	private readonly _http = inject(HttpClient);

	/**
	 * Sends the message and returns its request number.
	 *
	 * It rejects when the request fails, and the caller is the one that turns
	 * that into what the person reads: a service that swallowed the error would
	 * leave the screen showing a success it cannot back up.
	 */
	send(request: ContactRequest): Promise<ContactRequestResult> {
		return firstValueFrom(this._http.post<ContactRequestResult>(`${environment.apiUrl}${CONTACT_REQUESTS_PATH}`, request));
	}
}
