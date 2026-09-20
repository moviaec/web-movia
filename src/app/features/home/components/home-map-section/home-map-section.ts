import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight } from '@ng-icons/heroicons/outline';

/** Invitation to find the nearest club, over the map of the city. */
@Component({
	selector: 'app-home-map-section',
	imports: [NgOptimizedImage, RouterLink, NgIcon],
	viewProviders: [provideIcons({ heroArrowRight })],
	templateUrl: './home-map-section.html'
})
export class HomeMapSection {}
