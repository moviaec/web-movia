import { ApplicationRef } from '@angular/core';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Entry point used at BUILD time to prerender the routes. It never runs in production:
 * the output is static HTML (`outputMode: 'static'`), so no Node server is deployed.
 */
const bootstrap = (context: BootstrapContext): Promise<ApplicationRef> => bootstrapApplication(App, config, context);

export default bootstrap;
