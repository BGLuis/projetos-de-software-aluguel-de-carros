import { Component, Input } from '@angular/core';
import { Car } from '../car-card/car-card';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
	selector: 'app-resume',
	imports: [CurrencyPipe, DatePipe],
	templateUrl: './resume.html',
	styleUrl: './resume.scss',
})
export class Resume {
	@Input() selectedCar!: Car;
	@Input() pickupDate!: Date;
	@Input() returnDate!: Date;
	@Input() hasInsurance: boolean = false;

	get total(): number {
		return this.selectedCar.pricePerDay * this.totalDays;
	}

	get totalDays(): number {
		const timeDiff = Math.abs(
			this.returnDate.getTime() - this.pickupDate.getTime(),
		);
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	}
}
