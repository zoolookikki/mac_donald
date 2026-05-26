//https://angular.dev/guide/http/testing

import { TestBed } from '@angular/core/testing';

import { CitySearchService } from './city-search-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NOMINATIM_SEARCH_URL } from '../constants/nominatim.constants';
import { searchCitiesResult, nominatimSearchResults } from '../test/data';
import { City } from '../models/city';

describe('CitySearchService', () => {
  let service: CitySearchService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    // Démarre la configuration de l’environnement de test Angular : 
    TestBed.configureTestingModule({
      providers: [
        // le service que l'on veut tester.
        CitySearchService,
        /*
        Fourni un httpclient de test :
        Cela permet d'intercepter les requêtes HTTP avec HttpTestingController au lieu d'envoyer de vrais appels réseau vers l'API Nominatim.
        */
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CitySearchService);
    httpTesting = TestBed.inject(HttpTestingController);
    
  });

  it('Le service doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('searchCity OK => transformation en City[]', () => {
    service.searchCity('City').subscribe({
      next: (cities: City[]) => {
        console.log('Résultat reçu (CitySearchService) :', cities);
        console.log('Résultat attendu (CitySearchService) :', searchCitiesResult);
        expect(cities).toEqual(searchCitiesResult);
      },
    });

    /*
    On intercepte la requête HTTP envoyée par le service.
    expectOne vérifie qu'une seule requête correspond au critère donné.
    Ici, on cherche la requête dont l'URL correspond à NOMINATIM_SEARCH_URL.
    Aucun vrai appel réseau n'est effectué : la requête est capturée par HttpTestingController.
    */
    const request = httpTesting.expectOne((req) => {
      return req.url === NOMINATIM_SEARCH_URL;
    });

    // On vérifie que le service utilise bien la méthode HTTP GET.
    expect(request.request.method).toBe('GET');

    /*
    On simule la réponse de l'API Nominatim.
    flush envoie au service les données de test comme si elles venaient réellement de l'API.
    Cela déclenche ensuite le traitement du pipe(map(...)) dans le service, qui transforme les résultats Nominatim en City[].
    */
    request.flush(nominatimSearchResults);
  });

  function expectQueryError(query: string): void {
    let errorIsCall = false;

    service.searchCity(query).subscribe({
      next: () => {},
      error: (error: Error) => {
        errorIsCall = true;
        expect(error.message).not.toBe('');
      },
    });

    // pour être sûr que l'erreur a été déclenchée et donc que le test est bien écrit (prouvable en mettant 'City' dans l'appel à searchCity).
    expect(errorIsCall).toBe(true);

    // On vérifie qu'aucune requête HTTP n'a été envoyée.
    httpTesting.expectNone(NOMINATIM_SEARCH_URL);
  }

  it('searchCity HS => retourne une erreur si la query est vide', () => {
    expectQueryError('');
  });

  it('searchCity HS => retourne une erreur si la query contient seulement des espaces', () => {
    expectQueryError('   ');    
  });  
});
