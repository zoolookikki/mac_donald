import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// RxJS est la bibliothèque utilisée par Angular pour gérer les traitements asynchrones.
import { Observable } from 'rxjs';
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
    // test
    // query="";

    // null, undefined, "" OR "  "
    if (!query || !query.trim()) throw new Error("Query invalide");

    return this.http.get<NominatimSearchResult[]>(NOMINATIM_SEARCH_URL, {
      params: {
        format: 'json',
        q: query,
        limit: NOMINATIM_DEFAULT_LIMIT,
      },
    });
  }
}
