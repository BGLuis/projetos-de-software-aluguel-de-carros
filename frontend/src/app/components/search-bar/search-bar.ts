import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
	selector: 'app-search-bar',
	imports: [LucideAngularModule],
	templateUrl: './search-bar.html',
	styleUrl: './search-bar.scss',
})
export class SearchBar {
	@Input() hasNextButton = false;

	totalFields = 4 + (this.hasNextButton ? 1 : 0);

	getWidthStyle() {
		return `width: calc((100% - ${this.totalFields * 16}px) / ${
			this.totalFields
		})`;
	}
}
