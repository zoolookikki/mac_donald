import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// RxJS est la bibliothèque utilisée par Angular pour gérer les traitements asynchrones.
import { map, Observable, throwError } from 'rxjs';
import { NominatimSearchResult } from '../models/nominatim-search-result';
import {
  NOMINATIM_SEARCH_URL,
  NOMINATIM_DEFAULT_LIMIT,
} from '../constants/nominatim.constants';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root',
})
export class CitySearchService {

  constructor(private http: HttpClient) {}

  private convertNominatimSearchResultsToCities(results: NominatimSearchResult[]): City[] {
    const cities: City[] = [];

    for (const result of results) {
      const city: City = {
        id: result.place_id,
        name: result.display_name,
        lat: Number(result.lat),
        lon: Number(result.lon),
        boundingbox: result.boundingbox,
      };

      cities.push(city);
    }

    return cities;
  }

  // retourne un Observable => il faut s'abonner avec Subscribe.
  public searchCity(query: string): Observable<City[]> {
    /*
    Si query est absente, vide, ou composée uniquement d’espaces, alors la recherche est invalide.
    Comme cette méthode retourne un Observable, on utilise throwError(...) de rxjs plutôt que throw new Error(...) => ce qui permet de tester l'erreur au nivau du composant
      qui appelle le service.
    throwError attend une fonction qui retourne une erreur.
   */
    if (!query || !query.trim()) {
      return throwError(function () {
        return new Error('Erreur interne : query invalide');
      });
    }

    // TEST POC : permet de simuler une erreur HTTP/API
    if (query === 'hs') {
      return throwError(function () {
        return new Error('Erreur simulée : recherche interrompue volontairement');
      });
    }    

    return this.http
      .get<NominatimSearchResult[]>(NOMINATIM_SEARCH_URL, {
        params: {
          format: 'json',
          q: query,
          limit: NOMINATIM_DEFAULT_LIMIT,
        },
      })
      // permet de modifier le résultat avant l'émission de l'observable => avantage de faire la transformation ici plutôt que dans le composant qui appelle ce service.
      .pipe(
        map((results: NominatimSearchResult[]) => {
          return this.convertNominatimSearchResultsToCities(results);
        })
      );      
  }
}

