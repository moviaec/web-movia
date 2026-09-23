import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PublicPlan } from '@core/interfaces/plan.interface';

import { environment } from '../../../environments/environment';
import { PlansService } from './plans.service';

describe('PlansService', () => {
	let service: PlansService;
	let http: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
		service = TestBed.inject(PlansService);
		http = TestBed.inject(HttpTestingController);
	});

	afterEach(() => http.verify());

	it('asks the public catalogue for the country the site serves and the given audience', async () => {
		const plans: PublicPlan[] = [];
		const result = service.findPublic('empresa');

		const request = http.expectOne((req) => req.url === `${environment.apiUrl}/plans/public`);
		expect(request.request.method).toBe('GET');
		expect(request.request.params.get('countryCode')).toBe('EC');
		expect(request.request.params.get('audience')).toBe('empresa');
		request.flush(plans);

		await expect(result).resolves.toEqual(plans);
	});
});
