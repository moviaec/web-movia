import { Component } from '@angular/core';

import { HomeBenefitsSection } from './components/home-benefits-section/home-benefits-section';
import { HomeCategoriesSection } from './components/home-categories-section/home-categories-section';
import { HomeCompaniesSection } from './components/home-companies-section/home-companies-section';
import { HomeCtaSection } from './components/home-cta-section/home-cta-section';
import { HomeFaqSection } from './components/home-faq-section/home-faq-section';
import { HomeHeroSection } from './components/home-hero-section/home-hero-section';
import { HomeMapSection } from './components/home-map-section/home-map-section';
import { HomeStepsSection } from './components/home-steps-section/home-steps-section';
import { HomeStudiosSection } from './components/home-studios-section/home-studios-section';

/** Home page: the landing itself, composed of its nine sections. */
@Component({
	selector: 'app-home',
	imports: [
		HomeHeroSection,
		HomeStepsSection,
		HomeCategoriesSection,
		HomeBenefitsSection,
		HomeMapSection,
		HomeStudiosSection,
		HomeCompaniesSection,
		HomeFaqSection,
		HomeCtaSection
	],
	templateUrl: './home.html'
})
export class Home {}
