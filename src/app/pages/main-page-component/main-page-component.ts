import { Component, signal } from '@angular/core';
import { RestaurantMapComponent } from "../../components/restaurant-map-component/restaurant-map-component";
import { CitySearchComponent } from "../../components/city-search-component/city-search-component";
import { City } from '../../models/city';
import { RestaurantOverlayComponent } from "../../components/restaurant-overlay-component/restaurant-overlay-component";
import { NearbyPoiService } from '../../services/nearby-poi-service';
import { NominatimSearchResult } from '../../models/nominatim-search-result';
import { Poi } from '../../models/poi';

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

  constructor(private nearbyPoiService: NearbyPoiService) {}

  private convertNominatimSearchResultsToPois(results: NominatimSearchResult[]): Poi[] {
    const pois: Poi[] = [];

    for (const result of results) {
      const poi: Poi = {
        id: result.place_id,
        name: result.display_name,
        lat: Number(result.lat),
        lon: Number(result.lon),
        address: result.display_name,
      };

      pois.push(poi);
    }

    return pois;
  }

  public handleSelectCity(city: City): void {
    console.log('ville reçue de city-search-component :', city);
    /*
    Reset POI uniquement si la ville a changé.
    Le ?. => Si currentCity() n’est pas null, alors lis l'id sinon retourne undefined et donc !== event.id => reset.
    */
    if (this.currentCity()?.id !== city.id) {
      this.poiList.set([]);
    }

    this.currentCity.set(city);
    this.errorMessage.set('');

    this.nearbyPoiService.getNearbyPOIs(city).subscribe({
      next: (results: NominatimSearchResult[]) => {
        console.log(results);
        if (results.length === 0) {
          this.errorMessage.set('Aucun Macdo trouvé.');
          return;
        }

        const pois: Poi[] = this.convertNominatimSearchResultsToPois(results);
        this.poiList.set(pois);
      },
      error: () => {
        this.errorMessage.set("Impossible de récupérer la liste des points d'intérêt.");
      },
    });
  }

  public handleSelectPOI(poi: Poi): void {
    console.log('poi reçu de restaurant-mapcomponent :', poi);
  }

}
