import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CarBackground } from '../car-background/car-background';

@Component({
	selector: 'app-sign-in',
	imports: [HeaderComponent, FormsModule, LucideAngularModule, CarBackground],
	templateUrl: './sign-in.html',
	styleUrl: './sign-in.scss',
})
export class SignIn {
	onSubmit(f: NgForm) {}
}
