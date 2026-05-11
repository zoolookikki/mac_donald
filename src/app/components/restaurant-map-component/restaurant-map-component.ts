import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  /*
  Création d'un marqueur à la position donnée + ajout une popup contenant un bouton permettant de choisir le point d'intérêt : marker([poi.lat, poi.lon]) 
    => Création du marqueur Leaflet.
  Le contenu d’une popup Leaflet n’est pas interprété comme un template Angular. Il n’est donc pas possible d’utiliser directement une liaison (click) dans le HTML de la popup.
    - popupContent => le contenu d'une popup Leaflet à construire avec createElement :
      - une div qui est le conteneur de la popup.
      - un paragraphe pour afficher l’adresse du restaurant.
      - un bouton "choisir" pour sélectionner le restaurant => addEventListener pour permettre le click sur le bouton créer dynamiquement.
    - bindPopup => associe le contenu HTML créé au marqueur.
  */
  private createMarker(poi: Poi): Marker {
    const poiMarker: Marker = marker([poi.lat, poi.lon]);

    const popupContent: HTMLDivElement = document.createElement('div');

    const address: HTMLParagraphElement = document.createElement('p');
    address.className = 'text-xs';
    address.textContent = poi.address;

    const button: HTMLButtonElement = document.createElement('button');
    button.type = 'button';
    button.className = 'mt-2 rounded-lg cursor-pointer bg-yellow-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-500';
    button.textContent = 'choisir';
    button.addEventListener('click', () => {
      this.currentPOI.emit(poi);
    });

    popupContent.appendChild(address);
    popupContent.appendChild(button);

    poiMarker.bindPopup(popupContent);

    return poiMarker;
  }
  
  @Input() public set currentCity(value: City | null) {
    console.log('ville reçue de main-page-component :', value);
    this.center = value === null ? LEAFLET_DEFAULT_CENTER : latLng([value.lat, value.lon]);
  }
  @Input() public set poiList(value: Poi[]) {
    console.log('poiList reçue de main-page-component :', value);
    this.markers = [];
    for (const poi of value) {
      const poiMarker: Marker = this.createMarker(poi);
      this.markers.push(poiMarker);
    }
  }

  @Output() public currentPOI = new EventEmitter<Poi>();

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
