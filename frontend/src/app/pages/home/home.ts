import { Component, signal } from '@angular/core';
import { CarBackground } from '../../components/car-background/car-background';
import { HeaderComponent } from '../../components/header/header';
import { SearchBar } from '../../components/search-bar/search-bar';
import { Car, CarCard } from '../../components/car-card/car-card';

const cars: Car[] = [
	{
		imageURL: 'cars/bmw-m4.png',
		name: 'BMW M4',
		backgroundName: 'M4',
		pricePerDay: 2000,
		gasType: 'flex',
		gearType: 'automatic',
		seats: 4,
	},
	{
		imageURL: 'cars/fusca.png',
		name: 'Fusca',
		backgroundName: 'Fusca',
		pricePerDay: 53.9,
		gasType: 'gasoline',
		gearType: 'manual',
		seats: 4,
	},
	{
		imageURL: 'cars/impala-1967.png',
		name: 'Impala 1967',
		backgroundName: 'Impala',
		pricePerDay: 200000,
		gasType: 'gasoline',
		gearType: 'manual',
		seats: 4,
	},
	{
		imageURL: 'cars/jeep-renegade.png',
		name: 'Jeep Renegade',
		backgroundName: 'Renegade',
		pricePerDay: 130,
		gasType: 'flex',
		gearType: 'automatic',
		seats: 4,
	},
];

@Component({
	selector: 'app-home',
	imports: [CarBackground, HeaderComponent, SearchBar, CarCard],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	cars = signal(cars);
}
