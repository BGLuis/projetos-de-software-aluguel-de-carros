import { User } from '#app/auth/user';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-payment',
	imports: [],
	templateUrl: './payment.html',
	styleUrl: './payment.scss',
})
export class Payment {
	@Input({ required: true }) user!: User;
}
