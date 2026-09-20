import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Closing call to action, on the lime block right above the footer. */
@Component({
	selector: 'app-home-cta-section',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './home-cta-section.html'
})
export class HomeCtaSection {}
