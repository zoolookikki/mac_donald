// https://angular.dev/guide/http/testing

import { TestBed } from '@angular/core/testing';

import { NearbyPoiService } from './nearby-poi-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NOMINATIM_SEARCH_URL } from '../constants/nominatim.constants';
import { city1, cityInvalid, cityWithoutBoundingbox, nearbyPoiCity1Result, nominatimPoiResults } from '../test/data';
import { Poi } from '../models/poi';
import { City } from '../models/city';

describe('NearbyPoiService', () => {
  let service: NearbyPoiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    // Démarre la configuration de l’environnement de test Angular : 
    TestBed.configureTestingModule({
      providers: [
        // le service que l'on veut tester.
        NearbyPoiService,
        /*
        Fourni un httpclient de test :
        Cela permet d'intercepter les requêtes HTTP avec HttpTestingController au lieu d'envoyer de vrais appels réseau vers l'API Nominatim.
        */
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(NearbyPoiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  function expectGetRequest() {
    const request = httpTesting.expectOne((req) => {
      return req.url === NOMINATIM_SEARCH_URL;
    });

    expect(request.request.method).toBe('GET');

    return request;
  }

  it('Le service doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getNearbyPOIs OK => transformation en Poi[]', () => {
    service.getNearbyPOIs(city1).subscribe({
      next: (pois: Poi[]) => {
        console.log('Résultat reçu (NearbyPoiService) :', pois);
        console.log('Résultat attendu (NearbyPoiService) :', nearbyPoiCity1Result);
        expect(pois).toEqual(nearbyPoiCity1Result);
      },
    });

    const request = expectGetRequest();
    request.flush(nominatimPoiResults);
  });

  it('getNearbyPOIs OK => vérifie utilisation de la limite personnalisée', () => {
    service.getNearbyPOIs(city1, 2).subscribe();

    const request = expectGetRequest();

    expect(request.request.params.get('limit')).toBe('2');

    request.flush([]);
  });

  function expectCityError(city: City): void {
    let errorIsCall = false;

    service.getNearbyPOIs(city).subscribe({
      next: () => {},
      error: (error: Error) => {
        errorIsCall = true;
        expect(error.message).not.toBe('');
      },
    });

    expect(errorIsCall).toBe(true);

    httpTesting.expectNone(NOMINATIM_SEARCH_URL);
  }
 
  it('getNearbyPOIs HS => retourne une erreur si la ville est invalie', () => {
    expectCityError(cityInvalid);
  });

  it('getNearbyPOIs HS => retourne une erreur si la boundingbox est vide', () => {
    expectCityError(cityWithoutBoundingbox);
  });
});
