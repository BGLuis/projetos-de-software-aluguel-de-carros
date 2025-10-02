import { CurrencyPipe } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type Car = {
	imageURL: string;
	name: string;
	backgroundName: string;
	pricePerDay: number;
	gasType: 'gasoline' | 'flex' | 'electric' | 'hybrid';
	gearType: 'automatic' | 'manual';
	seats: number;
};

@Component({
	selector: 'app-car-card',
	imports: [CurrencyPipe, LucideAngularModule],
	templateUrl: './car-card.html',
	styleUrl: './car-card.scss',
})
export class CarCard {
	@Input({ required: true }) car!: Car;
	@Input() expanded = false;

	@HostBinding('style.width')
	get width() {
		return this.expanded ? '100%' : '400px';
	}
}
