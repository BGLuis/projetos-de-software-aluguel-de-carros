import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'app-car-background',
	imports: [],
	templateUrl: './car-background.html',
	styleUrl: './car-background.scss',
})
export class CarBackground {
	@Input() isAbsolute: boolean = true;

	@HostBinding('style.position')
	get position() {
		return this.isAbsolute ? 'absolute' : 'relative';
	}
}
