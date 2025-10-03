import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
	form;

	totalFields = 4 + (this.hasNextButton ? 1 : 0);

	constructor(
		private readonly router: Router,
		private readonly formBuilder: FormBuilder,
	) {
		this.form = this.formBuilder.group({
			pickupLocation: ['', [Validators.required]],
			pickupDate: ['', [Validators.required]],
			returnLocation: ['', [Validators.required]],
			returnDate: ['', [Validators.required]],
		});
	}

	getWidthStyle() {
		return `width: calc((100% - ${this.totalFields * 16}px) / ${
			this.totalFields === 4 ? 4 : 5
		})`;
	}

	navigate() {
		if (this.form.valid === false) {
			this.form.markAllAsTouched();
			return;
		}

		const pickupDate = new Date(this.form.value.pickupDate!);
		if (pickupDate.getTime() < Date.now()) {
			this.form.get('pickupDate')?.setErrors({ invalidDate: true });
		}

		const returnDate = new Date(this.form.value.returnDate!);
		if (pickupDate.getTime() > returnDate.getTime()) {
			this.form.get('returnDate')?.setErrors({ invalidDateRange: true });
			return;
		}

		const queryParams = {
			pickupDate: pickupDate.getTime(),
			returnDate: returnDate.getTime(),
			pickupLocation: this.form.value.pickupLocation,
			returnLocation: this.form.value.returnLocation,
		};
		if (window.location.pathname === '/rent') {
			this.router.navigate([], {
				queryParams,
				queryParamsHandling: 'merge',
			});
		} else {
			this.router.navigate(['rent'], {
				queryParams,
			});
		}
	}
}
