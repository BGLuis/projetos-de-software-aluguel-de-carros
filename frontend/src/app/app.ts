import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected title = 'frontend';
}
