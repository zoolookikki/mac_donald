import { Injectable, signal } from '@angular/core';
import { City } from '../models/city';
import { Poi } from '../models/poi';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  /*
  Bonne pratique :
  private readonly ...Signal accessible dans la classe uniquement => en plus avec readonly : la propriété currentCitySignal ne pourra pas être réassignée après son initialisation.
    exemple interdit, refaire plus tard : this.currentCitySignal = signal<City | null>(null)
    exemple autorisé dans le service : this.currentCitySignal.set(city)

  public readonly ... asReadonly() accessible depuis l'extérieur par les composants mais :
    readonly : la propriété ne peut pas être réassignée.
    asReadonly() : les composants ne peuvent pas appeler .set() dessus.

  Les composants peuvent lire : this.stateService.currentCity()
  Mais ne peuvent pas faire : this.stateService.currentCity.set(city)
  Obligé de passer par le setter : public setCurrentCity(city: City)
  => application sûre de la logique métier.

  Au lieu de :
    public currentCity = signal<City | null>(null);
    public errorMessage = signal<string>("");
    public poiList = signal<Poi[]>([]);
    public currentPOI = signal<Poi | null>(null);
  */
  private readonly currentCitySignal = signal<City | null>(null);
  private readonly errorMessageSignal = signal<string>('');
  private readonly poiListSignal = signal<Poi[]>([]);
  private readonly currentPOISignal = signal<Poi | null>(null);

  public readonly currentCity = this.currentCitySignal.asReadonly();
  public readonly errorMessage = this.errorMessageSignal.asReadonly();
  public readonly poiList = this.poiListSignal.asReadonly();
  public readonly currentPOI = this.currentPOISignal.asReadonly();

  // Certains setters contiennent de la logique métier.

  public setCurrentCity(city: City): void {
    const previousCity: City | null = this.currentCity();

    this.errorMessageSignal.set('');

    /*
    Si la ville sélectionnée est déjà la ville courante,
    on ne réinitialise pas les données liées à la recherche.
    Le ?. => Si previousCity n’est pas null, alors lis l'id sinon retourne undefined et donc !== event.id => reset.
    */
    if (previousCity?.id === city.id) {
      return;
    }

    // Si la ville change, le restaurant sélectionné et la liste des restaurants ne correspondent plus au nouveau contexte.
    this.currentPOISignal.set(null);
    this.poiListSignal.set([]);

    this.currentCitySignal.set(city);
  }

 public setCurrentPOI(poi: Poi): void {
    this.currentPOISignal.set(poi);
    this.errorMessageSignal.set('');
  }

  public setPoiList(pois: Poi[]): void {
    this.poiListSignal.set(pois);
  }

  public setErrorMessage(message: string): void {
    this.errorMessageSignal.set(message);
  }
}
