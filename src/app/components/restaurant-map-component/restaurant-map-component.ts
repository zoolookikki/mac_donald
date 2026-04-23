import { Component, Input } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, MapOptions, tileLayer } from 'leaflet';
import { City } from '../../models/city';

const DEFAULT_CENTER: LatLng = latLng(48.8566, 2.3522);
const DEFAULT_ZOOM = 13;
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';

@Component({
  selector: 'app-restaurant-map-component',
  imports: [LeafletModule],
  templateUrl: './restaurant-map-component.html',
  styleUrl: './restaurant-map-component.css',
})
export class RestaurantMapComponent {
  public center: LatLng = DEFAULT_CENTER;

  @Input() public set currentCity(value: City | null) {
    console.log('ville reçue de main-page-component :', value);
    this.center = value === null ? DEFAULT_CENTER : latLng([value.lat, value.lon]);
  }
  
  readonly leafletOptions: MapOptions = {
    layers: [
      tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION
      })
    ],
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER
  };

}
