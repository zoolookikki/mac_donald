import { Component, EventEmitter, Output } from '@angular/core';
import { City } from '../../models/city';

@Component({
  selector: 'app-city-search-component',
  imports: [],
  templateUrl: './city-search-component.html',
  styleUrl: './city-search-component.css',
})
export class CitySearchComponent {
  @Output() currentCity = new EventEmitter<City>();

  public choix1() : void {
    const lieusaint: City = {
      name: 'Lieusaint',
      lat : 48.633331,
      lon: 2.55
    };

    this.currentCity.emit(lieusaint);
  }
  public choix2() : void {
    const sete: City = {
      name: 'Sète',
      lat: 43.400002,
      lon: 3.68333
    };

    this.currentCity.emit(sete);
  }
}
