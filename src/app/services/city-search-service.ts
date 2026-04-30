import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NominatimSearchResult } from '../models/nominatim-search-result';

@Injectable({
  providedIn: 'root',
})
export class CitySearchService {

  private readonly NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
  private readonly DEFAULT_LIMIT = 10;

  constructor(private http: HttpClient) {}
  
  public searchCity(query: string): Observable<NominatimSearchResult[]> {
    // test
    // query="";

    // null, undefined, "" OR "  "
    if (!query || !query.trim()) throw new Error("Query invalide");

    return this.http.get<NominatimSearchResult[]>(this.NOMINATIM_SEARCH_URL, {
      params: {
        format: 'json',
        q: query,
        limit: this.DEFAULT_LIMIT,
      },
    });
  }
}
