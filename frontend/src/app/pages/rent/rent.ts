import { Component } from '@angular/core';
import { TopPage } from '#app/components/top-page/top-page';

const choices = [
	{
		label: 'Marcas',
		options: [
			'Audi',
			'BMW',
			'Chevrolet',
			'Ford',
			'Honda',
			'Hyundai',
			'Jeep',
			'Kia',
			'Mazda',
			'Mercedes-Benz',
			'Nissan',
			'Toyota',
			'Volkswagen',
		],
	},
	{
		label: 'Tipo',
		options: [
			'SUV',
			'Sedan',
			'Hatchback',
			'Coupé',
			'Conversível',
			'Picape',
		],
	},
];

@Component({
	selector: 'app-rent',
	imports: [TopPage],
	templateUrl: './rent.html',
	styleUrl: './rent.scss',
})
export class Rent {
	choices = choices;
}
