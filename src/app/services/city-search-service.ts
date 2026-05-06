import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// RxJS est la bibliothèque utilisée par Angular pour gérer les traitements asynchrones.
import { Observable, throwError } from 'rxjs';
import { NominatimSearchResult } from '../models/nominatim-search-result';
import {
  NOMINATIM_SEARCH_URL,
  NOMINATIM_DEFAULT_LIMIT,
} from '../constants/nominatim.constants';

@Injectable({
  providedIn: 'root',
})
export class CitySearchService {

  constructor(private http: HttpClient) {}
  
  // retourne un Observable => il faut s'abonner avec Subscribe.
  public searchCity(query: string): Observable<NominatimSearchResult[]> {
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

    return this.http.get<NominatimSearchResult[]>(NOMINATIM_SEARCH_URL, {
      params: {
        format: 'json',
        q: query,
        limit: NOMINATIM_DEFAULT_LIMIT,
      },
    });
  }
}
