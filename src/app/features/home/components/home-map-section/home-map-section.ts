import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Invitation to find the nearest club, over the map of the city. */
@Component({
	selector: 'app-home-map-section',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './home-map-section.html'
})
export class HomeMapSection {}
