import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { CORPORATE_MODEL_STEPS } from '@core/constants/corporate.constants';

/** «Cómo funciona el modelo 50/50»: the four lime cards of the co-financed deal. */
@Component({
	selector: 'app-corporate-model-section',
	imports: [NgOptimizedImage],
	templateUrl: './corporate-model-section.html'
})
export class CorporateModelSection {
	/** Steps of the model, in the order of the design. */
	protected readonly steps = CORPORATE_MODEL_STEPS;
}
