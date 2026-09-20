import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ACTIVITY_CATEGORIES } from '@core/constants/home.constants';

/** Strip of category photos that bridges the white part of the page and the dark one. */
@Component({
	selector: 'app-home-categories-section',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './home-categories-section.html'
})
export class HomeCategoriesSection {
	/** Photos of the strip, in the order of the design. */
	protected readonly categories = ACTIVITY_CATEGORIES;
}
