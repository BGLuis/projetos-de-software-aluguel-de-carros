import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './pages/auth/sign-up/sign-up';

export const routes: Routes = [
	{
		path: 'auth/sign-up',
		component: SignUp,
	},
];
