import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/city';
import { Observable, of } from 'rxjs';
import { NominatimSearchResult } from '../models/nominatim-search-result';
import {
  NOMINATIM_SEARCH_URL,
  NOMINATIM_DEFAULT_LIMIT,
} from '../constants/nominatim.constants';

const POI_QUERY = "McDonald's";
const VIEWBOX_MARGIN = 0.10;

@Injectable({
  providedIn: 'root',
})
export class NearbyPoiService {

  constructor(private http: HttpClient) {}

  private makeViewbox(boundingbox: string[]): string {
    // transformation de chaque point du rectangle en numérique (pour ajouter de la marge)
    const [south, north, west, east] = boundingbox.map(Number);

    // marge ajoutée pour avoir un rectangle de recherche plus large et retransformation en string pour Nominatim.
    return [
      west - VIEWBOX_MARGIN, // diminution de la longitude pour agrandir vers la gauche.
      north + VIEWBOX_MARGIN, // augmentation de la latitude pour agrandir vers le haut.
      east + VIEWBOX_MARGIN, // augmentation de la latitude pour agrandire vers la droite.
      south - VIEWBOX_MARGIN, //  diminution de la longitude pour agrandir vers le bas.
    ].join(',');
  }
  public getNearbyPOIs(city: City, limit: number = NOMINATIM_DEFAULT_LIMIT): Observable<NominatimSearchResult[]> {
    /*
    ATTENTION : city doit contenir boundingbox car on en a besoin pour définir la viewbox (rectangle de recherche)
    Il est possible de faire autrement : Overpass pour trouver les POIs dans un rayon autour de la ville
    + Nominatim pour trouver les adresses exactes.
    */
    if (!city || city.boundingbox == null) {
      // comme on doit retourner un Observable, return[] tableau vide nok.
      return of([]);
    }

    const viewbox: string = this.makeViewbox(city.boundingbox);

    return this.http.get<NominatimSearchResult[]>(NOMINATIM_SEARCH_URL, {
      params: {
        format: 'json',
        q: POI_QUERY,
        limit,
        viewbox,
        // Limite les résultats à l’intérieur de la viewbox.
        bounded: 1,
        // Ajoute les détails d’adresse.
        addressdetails: 1,
      },
    });
  }

}
