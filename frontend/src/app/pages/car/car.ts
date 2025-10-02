import { Icons } from '#app/components/icons/icons';
import { StatusProgress } from '#app/components/status-progress/status-progress';
import { TopPage } from '#app/components/top-page/top-page';
import { Component } from '@angular/core';

@Component({
  selector: 'app-car',
  imports: [TopPage, StatusProgress, Icons],
  templateUrl: './car.html',
  styleUrl: './car.scss'
})
export class Car {

}
