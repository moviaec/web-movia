import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';

/** Application root: the shared chrome (header and footer) around the routed page. */
@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Header, Footer],
	templateUrl: './app.html'
})
export class App {}
