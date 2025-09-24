import { Component, computed, Signal, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from '#components/header/header';
import { CarBackground } from '#components/car-background/car-background';
import { Step } from '#components/form/step/step';
import { Form, StepInfo } from '#components/form/form';
import { Steps } from '#components/form/steps/steps';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cities, City, State, States } from '#app/utils';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-sign-up',
	imports: [
		ReactiveFormsModule,
		HeaderComponent,
		LucideAngularModule,
		CarBackground,
		Step,
		Form,
		Steps,
	],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	states = States;
	stepInfo: Signal<StepInfo[]>;
	selectedState: Signal<State | null | undefined>;
	cities: Signal<City[]>;

	constructor(private readonly formBuilder: FormBuilder) {
		this.stepInfo = signal([
			{
				formGroup: this.formBuilder.group({
					personal: this.formBuilder.group({
						fullName: [
							'',
							[Validators.required, Validators.minLength(3)],
						],
						telephone: [
							'',
							[Validators.required, Validators.minLength(10)],
						],
						email: ['', [Validators.required, Validators.email]],
						rg: [
							'',
							[Validators.required, Validators.minLength(9)],
						],
						cpf: [
							'',
							[
								Validators.required,
								Validators.minLength(11),
								Validators.maxLength(11),
							],
						],
					}),
					location: this.formBuilder.group({
						cep: [
							'',
							[
								Validators.required,
								Validators.minLength(8),
								Validators.maxLength(8),
							],
						],
						state: [null, [Validators.required]],
						city: [null, [Validators.required]],
						neighborhood: ['', [Validators.required]],
						street: ['', [Validators.required]],
						number: ['', [Validators.required]],
						complement: [''],
					}),
				}),
				button: { text: 'Próximo Passo', icon: 'arrow-right' },
			},
			{
				formGroup: this.formBuilder.group({
					profissional: this.formBuilder.group({
						profession: ['', [Validators.required]],
						company: ['', [Validators.required]],
						monthlyIncome: [
							0,
							[Validators.required, Validators.min(100)],
						],
					}),
					password: this.formBuilder.group({
						password: ['', [Validators.required]],
						confirmPassword: ['', [Validators.required]],
					}),
				}),
				button: { text: 'Concluir Cadastro', icon: 'check' },
			},
		]);

		const stateControl = this.stepInfo()
			.at(0)
			?.formGroup.get('location.state');

		if (!stateControl) {
			this.selectedState = signal(null);
		} else {
			this.selectedState = toSignal(stateControl.valueChanges, {
				initialValue: stateControl.value,
			});
		}

		this.cities = computed(() => {
			const state = this.selectedState();
			return state ? Cities[state] : [];
		});
	}

	onSubmit(form: any) {
		console.log(form);
	}
}
