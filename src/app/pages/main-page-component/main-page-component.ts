import { Component } from '@angular/core';
import { RestaurantMapComponent } from "../../components/restaurant-map-component/restaurant-map-component";

@Component({
  selector: 'app-main-page-component',
  imports: [RestaurantMapComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.css',
})
export class MainPageComponent {}
