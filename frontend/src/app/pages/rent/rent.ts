import { Component } from '@angular/core';
import { TopPage } from '#app/components/top-page/top-page';
import { StatusProgress } from '#app/components/status-progress/status-progress';
import { Icons } from '#app/components/icons/icons';
import { Car, CarCard } from '#app/components/car-card/car-card';

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
	imports: [TopPage, StatusProgress, CarCard, Icons],
	templateUrl: './rent.html',
	styleUrl: './rent.scss',
})
export class Rent {
	choices = choices;
	statuses = [
		{
			label: 'Local e Data',
			value: true,
			editOption: {
				label: 'Editar',
				action: () => this.editLocalEData()
			}
		},
		{
			label: 'Escolha do Carro',
			value: false,
		},
		{
			label: 'Tarifas e Adicionais',
			value: false,
		},
		{
			label: 'Dados Cadastrais',
			value: false,
		}
	];

	carsEX: Car = {
		imageURL: 'cars/bmw-m4.png',
		name: 'BMW M4',
		backgroundName: 'M4',
		pricePerDay: 2000,
		gasType: 'flex',
		gearType: 'automatic',
		seats: 4,
	};

	editLocalEData() {
		// Lógica para editar local e data
		console.log('Editando Local e Data');
	}
}
