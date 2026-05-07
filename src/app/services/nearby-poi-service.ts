import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/city';
// RxJS est la bibliothèque utilisée par Angular pour gérer les traitements asynchrones.
import { map, Observable, throwError } from 'rxjs';
import { NominatimSearchResult } from '../models/nominatim-search-result';
import {
  NOMINATIM_SEARCH_URL,
  NOMINATIM_DEFAULT_LIMIT,
} from '../constants/nominatim.constants';
import { Poi } from '../models/poi';

const POI_QUERY = "McDonald's";
// environ 10km.
const VIEWBOX_MARGIN = 0.10;

@Injectable({
  providedIn: 'root',
})
export class NearbyPoiService {

  constructor(private http: HttpClient) {}

  /*
  Nominatim renvoie une boundingbox pour chaque ville qui correspond au rectangle géographique approximatif de la ville (sud, nord, ouest, est).
  On l’utilise pour construire une viewbox, c’est-à-dire une zone de recherche permettant de la limiter autour de la ville sélectionnée.
  On ajoute une marge pour inclure les restaurants proches de la ville même s’ils sont légèrement en dehors de ses limites administratives.
  */
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

  // retourne un Observable => il faut s'abonner avec Subscribe.
  public getNearbyPOIs(city: City, limit: number = NOMINATIM_DEFAULT_LIMIT): Observable<Poi[]> {
    /*
    ATTENTION : city doit contenir boundingbox car on en a besoin pour définir la viewbox (rectangle de recherche)
    Il est possible de faire autrement : Overpass pour trouver les POIs dans un rayon autour de la ville
      + Nominatim pour trouver les adresses exactes.
    Comme cette méthode retourne un Observable, on utilise throwError(...) de rxjs plutôt que throw new Error(...) => ce qui permet de tester l'erreur au nivau du composant
      qui appelle le service.
    throwError attend une fonction qui retourne une erreur.
    */
    if (!city || city.boundingbox == null || city.boundingbox.length === 0) {
      return throwError(function () {
        return new Error('Erreur interne : ville invalide ou rectangle de recherche absent.');
      });
    }

    const viewbox: string = this.makeViewbox(city.boundingbox);

    return this.http
      .get<NominatimSearchResult[]>(NOMINATIM_SEARCH_URL, {
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
      })
      // permet de modifier le résultat avant l'émission de l'observable => avantage de faire la transformation ici plutôt que dans le composant qui appelle ce service.
      .pipe(
        map((results: NominatimSearchResult[]) => {
          return this.convertNominatimSearchResultsToPois(results);
        })
      );
  }

}
