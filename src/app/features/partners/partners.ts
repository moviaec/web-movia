import { Component } from '@angular/core';

import { PartnersCtaSection } from './components/partners-cta-section/partners-cta-section';
import { PartnersGrowthSection } from './components/partners-growth-section/partners-growth-section';
import { PartnersGuaranteesSection } from './components/partners-guarantees-section/partners-guarantees-section';
import { PartnersHeroSection } from './components/partners-hero-section/partners-hero-section';
import { PartnersSolutionSection } from './components/partners-solution-section/partners-solution-section';
import { PartnersStepsSection } from './components/partners-steps-section/partners-steps-section';

/** Partners page: the pitch for the studios, composed of its six sections. */
@Component({
	selector: 'app-partners',
	imports: [
		PartnersHeroSection,
		PartnersGrowthSection,
		PartnersSolutionSection,
		PartnersGuaranteesSection,
		PartnersStepsSection,
		PartnersCtaSection
	],
	templateUrl: './partners.html'
})
export class Partners {}
