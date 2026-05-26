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

    this.errorMessage.set('');

    /*
    Si la ville sélectionnée est déjà la ville courante,
    on ne réinitialise pas les données liées à la recherche.
    Le ?. => Si previousCity n’est pas null, alors lis l'id sinon retourne undefined et donc !== event.id => reset.
    */
    if (previousCity?.id === city.id) {
      return;
    }

    // Si la ville change, le restaurant sélectionné et la liste des restaurants ne correspondent plus au nouveau contexte.
    this.currentPOI.set(null);
    this.poiList.set([]);

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
