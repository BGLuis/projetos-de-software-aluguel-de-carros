import { CarBackground } from '#app/components/car-background/car-background';
import { HeaderComponent } from '#app/components/header/header';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CarBackground,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {

}
