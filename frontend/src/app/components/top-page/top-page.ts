import { Component, Input } from '@angular/core';
import { HeaderComponent } from '#app/components/header/header';
import { CarBackground } from '#app/components/car-background/car-background';
import { SearchBar } from '#app/components/search-bar/search-bar';

@Component({
	selector: 'app-top-page',
	imports: [HeaderComponent, CarBackground, SearchBar],
	templateUrl: './top-page.html',
	styleUrl: './top-page.scss',
})
export class TopPage {
	@Input() hasNextButton = true;
}
