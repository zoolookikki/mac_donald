import { Injectable, signal } from '@angular/core';
import { City } from '../models/city';
import { Poi } from '../models/poi';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public currentCity = signal<City | null>(null);
  public errorMessage = signal<string>("");
  public poiList = signal<Poi[]>([]);
  public currentPOI = signal<Poi | null>(null);

  // Certains setters contiennent de la logique métier.

  public setCurrentCity(city: City): void {
    const previousCity: City | null = this.currentCity();

    // On efface toujours le restaurant sélectionné quand une ville est choisie.
    this.currentPOI.set(null);
    /*
    On efface les POI uniquement si la ville change.
    Le ?. => Si previousCity n’est pas null, alors lis l'id sinon retourne undefined et donc !== event.id => reset.
    */
    if (previousCity?.id !== city.id) {
      this.poiList.set([]);
    }
    // On efface le message d'erreur.
    this.errorMessage.set('');

    this.currentCity.set(city);
  }

 public setCurrentPOI(poi: Poi): void {
    this.currentPOI.set(poi);
    this.errorMessage.set('');
  }

  public setPoiList(pois: Poi[]): void {
    this.poiList.set(pois);
  }

  public setErrorMessage(message: string): void {
    this.errorMessage.set(message);
  }
}
