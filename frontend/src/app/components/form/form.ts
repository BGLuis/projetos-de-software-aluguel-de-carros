import { Component, computed, Input, Signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export type StepInfo = {
	button: {
		text: string;
		icon: string;
	};
};

@Component({
	selector: 'app-form',
	imports: [FormsModule, LucideAngularModule],
	templateUrl: './form.html',
	styleUrl: './form.scss',
})
export class Form {
	@Input({ required: true }) onSubmit!: (form: any) => void;
	@Input({ required: true }) stepInfo!: Signal<StepInfo[]>;
	@Input({ required: true }) title!: string;
	currentStepIndex = 0;
	endStepIndex = computed(() => this.stepInfo().length - 1);

	_onSubmit(f: NgForm) {
		if (!f.valid) return;

		if (this.currentStepIndex < this.endStepIndex()) {
			this.currentStepIndex++;
		}

		if (this.currentStepIndex === this.endStepIndex())
			this.onSubmit(f.value);
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
