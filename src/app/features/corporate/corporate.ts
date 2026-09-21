import { Component } from '@angular/core';

import { CorporateBenefitsSection } from './components/corporate-benefits-section/corporate-benefits-section';
import { CorporateCtaSection } from './components/corporate-cta-section/corporate-cta-section';
import { CorporateHeroSection } from './components/corporate-hero-section/corporate-hero-section';
import { CorporateModelSection } from './components/corporate-model-section/corporate-model-section';
import { CorporateOnboardingSection } from './components/corporate-onboarding-section/corporate-onboarding-section';
import { CorporateReasonsSection } from './components/corporate-reasons-section/corporate-reasons-section';

/** Corporate page: the pitch for the companies, composed of its six sections. */
@Component({
	selector: 'app-corporate',
	imports: [
		CorporateHeroSection,
		CorporateModelSection,
		CorporateBenefitsSection,
		CorporateReasonsSection,
		CorporateOnboardingSection,
		CorporateCtaSection
	],
	templateUrl: './corporate.html'
})
export class Corporate {}
