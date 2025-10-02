import { Component, Input } from '@angular/core';
import {
	FormBuilder,
	FormSubmittedEvent,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'app-search-bar',
	imports: [ReactiveFormsModule, LucideAngularModule],
	templateUrl: './search-bar.html',
	styleUrl: './search-bar.scss',
})
export class SearchBar {
	@Input() hasNextButton = false;

	totalFields = 4 + (this.hasNextButton ? 1 : 0);

	formGroup;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly router: Router,
	) {
		this.formGroup = this.formBuilder.group({
			pickupLocation: ['', [Validators.required]],
			pickupDate: ['', [Validators.required]],
			returnLocation: ['', [Validators.required]],
			returnDate: ['', [Validators.required]],
		});
	}

	getWidthStyle() {
		return `width: calc((100% - ${this.totalFields * 16}px) / ${
			this.totalFields
		})`;
	}

	onSubmit() {
		if (this.formGroup.valid) {
			const formData = this.formGroup.value;
			this.router.navigate(['/rent'], {
				queryParams: {
					pickupLocation: formData.pickupLocation,
					pickupDate: formData.pickupDate,
					returnLocation: formData.returnLocation,
					returnDate: formData.returnDate,
				},
			});
		}
	}
}
