import { Component } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LatLngExpression, MapOptions, tileLayer } from 'leaflet';

const DEFAULT_CENTER: LatLngExpression = [48.8566, 2.3522];
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
