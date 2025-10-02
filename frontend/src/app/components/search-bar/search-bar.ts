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
			this.totalFields
		})`;
	}

	navigate() {
		this.router.navigate(['rent'], {
			queryParams: this.form.value,
		});
	}
}
