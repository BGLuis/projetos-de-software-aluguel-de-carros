import { Component, computed, Input, Signal } from '@angular/core';
import { FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export type StepInfo = {
	formGroup: FormGroup;
	button: {
		text: string;
		icon: string;
	};
};

@Component({
	selector: 'app-form',
	imports: [ReactiveFormsModule, LucideAngularModule],
	templateUrl: './form.html',
	styleUrl: './form.scss',
})
export class Form {
	@Input({ required: true }) onSubmit!: (form: any) => void;
	@Input({ required: true }) stepInfo!: Signal<StepInfo[]>;
	currentStepIndex = 0;
	endStepIndex = computed(() => this.stepInfo().length - 1);

	_onSubmit() {
		if (this.currentFormGroup.invalid) {
			this.currentFormGroup.markAllAsTouched();
			return;
		}

		if (this.currentStepIndex < this.endStepIndex()) {
			this.currentStepIndex++;
		} else {
			const combinedValue = this.stepInfo().reduce(
				(acc, step) => ({ ...acc, ...step.formGroup.value }),
				{},
			);
			this.onSubmit(combinedValue);
		}
	}

	get currentFormGroup(): FormGroup {
		return this.stepInfo()[this.currentStepIndex].formGroup;
	}

	previousStep() {
		if (this.currentStepIndex > 0) {
			this.currentStepIndex--;
		}
	}

	calculateColumns(): string {
		const stepCount = this.stepInfo().length;
		const remainingSteps = stepCount - this.currentStepIndex;
		const hidden = Array.from(
			{ length: this.currentStepIndex },
			() => '0',
		).join(' ');
		return `${hidden} repeat(${remainingSteps}, 100%)`;
	}
}
