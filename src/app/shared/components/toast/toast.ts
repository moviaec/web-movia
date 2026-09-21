import { Component, DestroyRef, afterNextRender, inject, input, output } from '@angular/core';

import { ToastTone } from '@core/types/toast.type';

/**
 * How long a toast stays on screen, in milliseconds.
 *
 * Five seconds: long enough to read a couple of lines and write down a request
 * number, short enough not to sit on top of the page while someone keeps using it.
 */
const TOAST_DURATION_MS = 5000;

/**
 * Floating notice that says how something went and leaves on its own.
 *
 * It takes its content by projection instead of a text input, because what a toast
 * says usually carries something inside it: a request number in bold, a link to
 * write to. Whoever opens it owns the message; this only puts it on screen, paints
 * it by tone and takes it away.
 *
 * It is `fixed` to the bottom right corner, so where it is declared in the template
 * does not matter. On a phone it spans the width between the gutters instead, which
 * is the same corner with nothing to its left worth keeping. What it must NOT have
 * is an ancestor with a `transform`: that would make it the containing block and the
 * toast would hang from there instead of from the viewport.
 */
@Component({
	selector: 'app-toast',
	host: {
		class: 'fixed bottom-4 left-4 right-4 z-50 block sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-sm',
		role: 'status'
	},
	templateUrl: './toast.html'
})
export class Toast {
	private readonly _destroyRef = inject(DestroyRef);

	constructor() {
		// The timer starts once painted and only in the browser: `afterNextRender`
		// never runs while prerendering, where a pending timeout would hold the build.
		afterNextRender(() => {
			const timer = setTimeout(() => this.dismissed.emit(), TOAST_DURATION_MS);

			// A toast that is closed by hand, or one whose page is left, is destroyed
			// before the time is up: without this its timer would emit into the void.
			this._destroyRef.onDestroy(() => clearTimeout(timer));
		});
	}

	/** Whether it is saying that something went through, or that it did not. */
	readonly tone = input.required<ToastTone>();

	/**
	 * Fired when the toast is done: on its own after five seconds, or when the close
	 * button is pressed. Whoever opened it decides what that means — usually taking
	 * the state that opened it back to idle.
	 */
	readonly dismissed = output<void>();
}
