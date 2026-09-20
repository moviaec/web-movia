import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Application root: nothing but the routed tree. */
@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html'
})
export class App {}
