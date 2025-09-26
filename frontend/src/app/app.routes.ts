import { Routes } from '@angular/router';
import { SignUp } from './pages/auth/sign-up/sign-up';
import { Home } from './pages/home/home';
import { Rent } from './pages/rent/rent';

export const routes: Routes = [
	{
		path: '',
		component: Home,
	},
	{
		path: 'auth/sign-up',
		component: SignUp,
	},
	{
		path: 'rent',
		component: Rent,
	},
];
