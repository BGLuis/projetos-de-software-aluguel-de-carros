import { Component } from '@angular/core';
import { TopPage } from '#app/components/top-page/top-page';
import {
	Status,
	StatusProgress,
} from '#app/components/status-progress/status-progress';
import { Icons } from '#app/components/icons/icons';
import { Car, CarCard } from '#app/components/car-card/car-card';
import { Resume } from '#app/components/resume/resume';
import { Payment } from '#app/components/payment/payment';
import { User } from '#app/auth/user';

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
	imports: [TopPage, StatusProgress, CarCard, Icons, Resume, Payment],
	templateUrl: './rent.html',
	styleUrl: './rent.scss',
})
export class Rent {
	choices = choices;
	statuses: Status[] = [
		{
			label: 'Local e Data',
			value: true,
			editOption: {
				label: 'Editar',
				action: () => this.editLocalEData(),
			},
		},
		{
			label: 'Escolha do Carro',
			value: false,
			editOption: {
				label: 'Editar',
				action: () => this.toggle(1, false),
			},
		},
		{
			label: 'Tarifas e Adicionais',
			value: false,
			editOption: {
				label: 'Editar',
				action: () => this.toggle(2, false),
			},
		},
		{
			label: 'Dados Cadastrais',
			value: false,
			editOption: {
				label: 'Editar',
				action: () => this.toggle(3, false),
			},
		},
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

	user: User = {
		name: 'Marcela Mendes',
		email: 'marcela.mendes@google.com',
		phone: {
			ddi: '55',
			ddd: '31',
			number: '91234-5678',
		},
		document: {
			type: 'CPF',
			number: '123.456.789-09',
		},
	};

	pickupDate: Date = new Date('2024-07-01T10:00:00');
	returnDate: Date = new Date('2024-07-10T10:00:00');
	hasInsurance: boolean = false;

	selectedCar: Car | null = null;

	toggle(index: number, current: boolean = true) {
		for (let i = 0; i < this.statuses.length; i++) {
			this.statuses[i].value = i <= index ? true : false;
		}
		if (current !== undefined) {
			this.statuses[index].value = current;
		}
	}

	editLocalEData() {
		this.toggle(0, false);
	}

	selectCar(car: Car) {
		this.toggle(1);
		this.selectedCar = car;
	}

	confirmReservation() {
		this.toggle(2);
	}

	reserve() {
		this.toggle(3);
	}
}
