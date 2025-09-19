import {
	Component,
	ComponentRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from '../../../components/header/header';
import { CarBackground } from '../../../components/car-background/car-background';

@Component({
	selector: 'app-sign-up',
	imports: [HeaderComponent, FormsModule, LucideAngularModule, CarBackground],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	buttonInfo: { name: string; icon: string }[] = [
		{ name: 'Próximo Passo', icon: 'arrow-right' },
		{ name: 'Concluir Cadastro', icon: 'check' },
	];
	currentStepIndex = 0;
	endStepIndex = 1;

	onSubmit(f: NgForm) {
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
