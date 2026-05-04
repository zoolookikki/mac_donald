import { Component, Input } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {Icon, latLng, LatLng, MapOptions, marker, Marker, tileLayer } from 'leaflet';
import { City } from '../../models/city';
import { Poi } from '../../models/poi';

const LEAFLET_DEFAULT_CENTER: LatLng = latLng(48.8566, 2.3522);
const LEAFLET_DEFAULT_ZOOM = 13;
const LEAFLET_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const LEAFLET_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';

/*
  Leaflet cherche automatiquement ses icônes par défaut à partir de son CSS.
  On désactive donc cette détection automatique.
  On fournit explicitement les chemins vers les images copiées dans /assets via angular.json.
*/
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-restaurant-map-component',
  imports: [LeafletModule],
  templateUrl: './restaurant-map-component.html',
  styleUrl: './restaurant-map-component.css',
})
export class RestaurantMapComponent {
  public center: LatLng = LEAFLET_DEFAULT_CENTER;
  public markers: Marker[] = [];

  @Input() public set currentCity(value: City | null) {
    console.log('ville reçue de main-page-component :', value);
    this.center = value === null ? LEAFLET_DEFAULT_CENTER : latLng([value.lat, value.lon]);
  }
  @Input() public set poiList(value: Poi[]) {
    console.log('poiList reçue de main-page-component :', value);
    for (const poi of value) {
      /*
      marker : créé un marqueur à la position donnée + bindPopup : ajoute une popup au marqueur.
      */
      const poiMarker: Marker = marker([poi.lat, poi.lon]).bindPopup(poi.address);
      this.markers.push(poiMarker);
    }
  }
  
  public readonly leafletOptions: MapOptions = {
    layers: [
      tileLayer(LEAFLET_TILE_URL, {
        attribution: LEAFLET_TILE_ATTRIBUTION
      })
    ],
    zoom: LEAFLET_DEFAULT_ZOOM,
    center: LEAFLET_DEFAULT_CENTER
  };

}
