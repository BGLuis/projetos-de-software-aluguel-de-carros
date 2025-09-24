import { Component, Signal, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from '../../../components/header/header';
import { CarBackground } from '../../../components/car-background/car-background';
import { Step } from '../../../components/form/step/step';
import { Form, StepInfo } from '../../../components/form/form';
import { Steps } from "../../../components/form/steps/steps";

@Component({
	selector: 'app-sign-up',
	imports: [HeaderComponent, LucideAngularModule, CarBackground, Step, Form, Steps],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	stepInfo: Signal<StepInfo[]> = signal([
		{ button: { text: 'Próximo Passo', icon: 'arrow-right' } },
		{ button: { text: 'Concluir Cadastro', icon: 'check' } },
	]);

	onSubmit(form: any) {
		console.log(form);
	}
}
