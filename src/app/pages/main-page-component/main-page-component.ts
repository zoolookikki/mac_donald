import { Component } from '@angular/core';
import { RestaurantMapComponent } from "../../components/restaurant-map-component/restaurant-map-component";
import { CitySearchComponent } from "../../components/city-search-component/city-search-component";
import { City } from '../../models/city';
import { RestaurantOverlayComponent } from "../../components/restaurant-overlay-component/restaurant-overlay-component";
import { NearbyPoiService } from '../../services/nearby-poi-service';
import { Poi } from '../../models/poi';
import { HttpErrorResponse } from '@angular/common/http';
import { StateService } from '../../services/state-service';

@Component({
  selector: 'app-main-page-component',
  imports: [RestaurantMapComponent, CitySearchComponent, RestaurantOverlayComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.css',
})
export class MainPageComponent {

  constructor(
    private nearbyPoiService: NearbyPoiService,
    // public sinon le template ne peut pas y accéder.
    public stateService: StateService
  ) {}

  public handleSelectCity(city: City): void {
    console.log('ville reçue de city-search-component :', city);

    this.stateService.setCurrentCity(city);

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
          this.stateService.setErrorMessage('Aucun Macdo trouvé.');
          return;
        }

        this.stateService.setPoiList(pois);
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
          this.stateService.setErrorMessage("Erreur HTTP : impossible de récupérer la liste des points d'intérêt.");
          return;
        }

        if (error instanceof Error) {
          this.stateService.setErrorMessage(error.message);
          return;
        }

        this.stateService.setErrorMessage("Erreur inconnue lors de la recherche des points d'intérêt.");
      },
    });
  }

  public handleSelectPOI(poi: Poi): void {
    console.log('poi reçu de restaurant-map-component :', poi);
    this.stateService.setCurrentPOI(poi);
  }

  // on a cliqué sur "Continuer" dans l'overlay.
  public handleContinue(): void {
    /*
    Bonne pratique => variable locale :
      - Quand on doit lire plusieurs fois une valeur nullable
      - Pour que TypeScript soit ok avec la valeur null sinon erreur plus bas (this.currentPOI().name => l'objet a peut être la valeur null)
    */
    const currentPOI: Poi | null = this.stateService.currentPOI();

    // cas normalement impossible (par protection)
    if (currentPOI === null) {
      this.stateService.setErrorMessage('Choix non effectué.');
      return;
    }
    // simulation de la suite avec alert pour distinguer le cas.
    //alert(`On continue, le choix est : ${this.currentPOI().name}`);
    alert(`On continue, le choix est : ${currentPOI.name}`);
  }

}
