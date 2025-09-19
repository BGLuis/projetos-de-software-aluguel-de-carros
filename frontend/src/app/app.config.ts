import {
	ApplicationConfig,
	importProvidersFrom,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
	provideClientHydration,
	withEventReplay,
} from '@angular/platform-browser';
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Eye,
	EyeOff,
	Fuel,
	LucideAngularModule,
	Menu,
	Settings,
	Users,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		importProvidersFrom(
			LucideAngularModule.pick({
				Menu,
				ArrowLeft,
				ArrowRight,
				Check,
				Eye,
				EyeOff,
				Fuel,
				Users,
				Settings,
			}),
		),
	],
};
