import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PLANS_COUNTRY_CODE, PUBLIC_PLANS_PATH } from '@core/constants/plans.constants';
import { PublicPlan } from '@core/interfaces/plan.interface';
import { PlanAudience } from '@core/types/plan.type';

import { environment } from '../../../environments/environment';

/**
 * The public plans catalogue of `api-movia`.
 *
 * The plans are data of the back-office, not copy of the landing: prices and
 * benefits change there, and the page has to show them without a new build. The
 * decision is written down in `docs/decisiones/`.
 */
@Injectable({ providedIn: 'root' })
export class PlansService {
	private readonly _http = inject(HttpClient);

	/**
	 * Fetches the ACTIVE plans of the country the site serves, for one audience, in
	 * the order of the catalogue.
	 *
	 * It rejects when the request fails, and the page is the one that turns that
	 * into what the person reads.
	 */
	findPublic(audience: PlanAudience): Promise<PublicPlan[]> {
		return firstValueFrom(
			this._http.get<PublicPlan[]>(`${environment.apiUrl}${PUBLIC_PLANS_PATH}`, {
				params: { countryCode: PLANS_COUNTRY_CODE, audience }
			})
		);
	}
}
