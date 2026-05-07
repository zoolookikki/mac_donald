import { Component, signal } from '@angular/core';
import { RestaurantMapComponent } from "../../components/restaurant-map-component/restaurant-map-component";
import { CitySearchComponent } from "../../components/city-search-component/city-search-component";
import { City } from '../../models/city';
import { RestaurantOverlayComponent } from "../../components/restaurant-overlay-component/restaurant-overlay-component";
import { NearbyPoiService } from '../../services/nearby-poi-service';
import { Poi } from '../../models/poi';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main-page-component',
  imports: [RestaurantMapComponent, CitySearchComponent, RestaurantOverlayComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.css',
})
export class MainPageComponent {
  public currentCity = signal<City | null>(null);
  public errorMessage = signal<string>("");
  public poiList = signal<Poi[]>([]);
  public currentPOI = signal<Poi | null>(null);

  constructor(private nearbyPoiService: NearbyPoiService) {}

  public handleSelectCity(city: City): void {
    console.log('ville reçue de city-search-component :', city);

    // On efface toujours le restaurant sélectionné quand une ville est choisie.
    this.currentPOI.set(null);
    /*
    On efface les POI uniquement si la ville change.
    Le ?. => Si currentCity() n’est pas null, alors lis l'id sinon retourne undefined et donc !== event.id => reset.
    */
    if (this.currentCity()?.id !== city.id) {
      this.poiList.set([]);
    }
    // on efface le message d'erreur.
    this.errorMessage.set('');

    this.currentCity.set(city);

    // test city hs dans le service => erreur interne.
    /*
    const testCity = city;
    testCity.boundingbox = [];
    this.nearbyPoiService.getNearbyPOIs(testCity).subscribe({
    */
    this.nearbyPoiService.getNearbyPOIs(city).subscribe({
      next: (pois: Poi[]) => {
        console.log(pois);
        if (pois.length === 0) {
          this.errorMessage.set('Aucun Macdo trouvé.');
          return;
        }

        this.poiList.set(pois);
      },
      /*
      unknown mieux que any car l'erreur peut venir de plusieurs sources :
      - HttpErrorResponse : erreur HTTP/API ;
      - Error : erreur interne créée avec throwError ;
      - autre type imprévu.
      On vérifie donc le type avant d'utiliser l'erreur.
      */
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage.set("Erreur HTTP : impossible de récupérer la liste des points d'intérêt.");
          return;
        }

        if (error instanceof Error) {
          this.errorMessage.set(error.message);
          return;
        }

        this.errorMessage.set("Erreur inconnue lors de la recherche des points d'intérêt.");
      },
    });
  }

  public handleSelectPOI(poi: Poi): void {
    console.log('poi reçu de restaurant-mapcomponent :', poi);
    this.currentPOI.set(poi);
  }

  // on a cliqué sur "Continuer" dans l'overlay.
  public handleContinue(): void {
    /*
    Bonne pratique => variable locale :
      - Quand on doit lire plusieurs fois une valeur nullable
      - Pour que TypeScript soit ok avec la valeur null sinon erreur plus bas (this.currentPOI().name => l'objet a peut être la valeur null)
    */
    const currentPOI: Poi | null = this.currentPOI();

    // cas normalement impossible (par protection)
    if (currentPOI === null) {
      this.errorMessage.set('Choix non effectué.');
      return;
    }
    // simulation de la suite avec alert pour distinguer le cas.
    //alert(`On continue, le choix est : ${this.currentPOI().name}`);
    alert(`On continue, le choix est : ${currentPOI.name}`);
  }

}
