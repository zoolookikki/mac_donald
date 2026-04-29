import { Component } from '@angular/core';
import { RestaurantMapComponent } from "../../components/restaurant-map-component/restaurant-map-component";
import { CitySearchComponent } from "../../components/city-search-component/city-search-component";
import { City } from '../../models/city';
import { RestaurantOverlayComponent } from "../../components/restaurant-overlay-component/restaurant-overlay-component";

@Component({
  selector: 'app-main-page-component',
  imports: [RestaurantMapComponent, CitySearchComponent, RestaurantOverlayComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.css',
})
export class MainPageComponent {
  public currentCity: City | null = null;

  public handleSelect(event: City) {
    this.currentCity = event;
    console.log('ville reçue de city-search-component :', this.currentCity);
  }
}
