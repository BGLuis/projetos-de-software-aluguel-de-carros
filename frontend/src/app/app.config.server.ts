import {
	mergeApplicationConfig,
	ApplicationConfig,
	importProvidersFrom,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import {
	ArrowLeft,
	ArrowRight,
	Check,
	LucideAngularModule,
	Menu,
} from 'lucide-angular';

const serverConfig: ApplicationConfig = {
	providers: [
		provideServerRendering(withRoutes(serverRoutes)),
		importProvidersFrom(
			LucideAngularModule.pick({
				Menu,
				ArrowLeft,
				ArrowRight,
				Check,
			}),
		),
	],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
