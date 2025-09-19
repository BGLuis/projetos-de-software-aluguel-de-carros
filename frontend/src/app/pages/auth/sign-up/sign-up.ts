import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from '../../../components/header/header';
import { CarBackground } from '../../../components/car-background/car-background';

type StepInfo = {
	button: {
		text: string;
		icon: string;
	};
};

@Component({
	selector: 'app-sign-up',
	imports: [HeaderComponent, FormsModule, LucideAngularModule, CarBackground],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	stepInfo: StepInfo[] = [
		{ button: { text: 'Próximo Passo', icon: 'arrow-right' } },
		{ button: { text: 'Concluir Cadastro', icon: 'check' } },
	];
	currentStepIndex = 0;
	endStepIndex = 1;

	onSubmit(f: NgForm) {
		if (!f.valid) return;

		if (this.currentStepIndex < this.endStepIndex) {
			this.currentStepIndex++;
		}
	}

	previousStep() {
		if (this.currentStepIndex > 0) {
			this.currentStepIndex--;
		}
	}
}
