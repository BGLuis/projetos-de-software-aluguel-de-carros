import { Component } from '@angular/core';
import { CarBackground } from '../../components/car-background/car-background';
import { HeaderComponent } from '../../components/header/header';
import { SearchBar } from "../../components/search-bar/search-bar";

@Component({
	selector: 'app-home',
	imports: [CarBackground, HeaderComponent, SearchBar],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {}
