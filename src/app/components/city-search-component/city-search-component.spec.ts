/*
Outil Angular qui permet de préparer un environnement de test.
TestBed sert à créer un faux “mini module Angular” pour tester un composant.
ComponentFixture représente l’environnement de test du composant :
- instance du composant 
- template associé 
- DOM généré 
- détection de changements
*/
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { CitySearchComponent } from './city-search-component';
import { city1, city2 } from '../../test/data';
/*
of(...) permet de créer un Observable qui émet immédiatement une valeur.
Ici, on l’utilise pour simuler une réponse réussie du service, sans faire de vrai appel HTTP.
*/
import { Observable, of, throwError } from 'rxjs';
import { City } from '../../models/city';
import { CitySearchService } from '../../services/city-search-service';
import { HttpErrorResponse } from '@angular/common/http';

describe('CitySearchComponent', () => {
  // instance du composant.
  let component: CitySearchComponent;
  /*
  Permet d’interagir avec l’environnement de test du composant :
    - création du composant 
    - accès au DOM 
    - déclenchement de la détection de changements
  */
  let fixture: ComponentFixture<CitySearchComponent>;
  // Pour la réponse simulée du service CitySearchService.
  let searchCityResponse: Observable<City[]> = of([city1, city2]);

  // création du mock qui doit renvoyé la réponse paramètrable du service CitySearchService.
  class CitySearchServiceMock {
    public searchCity(): Observable<City[]> {
      return searchCityResponse;
    }
  }

  beforeEach(async () => {
    // Démarre la configuration de l’environnement de test Angular : 
    await TestBed.configureTestingModule({
        // le composant que l'on veut tester.
      imports: [CitySearchComponent],
      // très important pour activer le mock => cela veut dire : quand CitySearchComponent demande CitySearchService, Angular lui donne CitySearchServiceMock à la place.
      providers: [
        {
          provide: CitySearchService,
          useClass: CitySearchServiceMock,
        },
      ],
    /*
    Termine la configuration.
    Prépare le composant et son template
    */      
    }).compileComponents();

    // Crée réellement le composant Login dans l’environnement de test
    fixture = TestBed.createComponent(CitySearchComponent);
    // Récupération de l'instance TypeScript du composant pour permettre ensuite d’appeler ses méthodes directement
    component = fixture.componentInstance;
    // Déclenche l'initialisation Angular du composant et du template
    fixture.detectChanges();
  });

  it('Le composant doit être créé', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit OK => met à jour les suggestions si le service retourne des villes', () => {
    component.citySearchForm.controls.city.setValue('City');

    component.onSubmit();

    expect(component.suggestions()).toEqual([city1, city2]);
    expect(component.searchErrorMessage()).toBe('');
  });

  it('onSubmit OK => affiche une erreur si le service ne retourne aucune ville', () => {
    searchCityResponse = of([]);

    component.citySearchForm.controls.city.setValue('City');

    component.onSubmit();

    expect(component.suggestions()).toEqual([]);
    expect(component.searchErrorMessage()).not.toBe('');
  });

  [
    {
      label: 'la ville est vide',
      value: '',
    },
    {
      label: 'la ville contient des caractères invalides',
      value: 'Paris"',
    },
  ].forEach((testCase) => {
    it(`onSubmit HS => affiche une erreur si ${testCase.label}`, () => {
      component.citySearchForm.controls.city.setValue(testCase.value);

      component.onSubmit();

      expect(component.searchErrorMessage()).not.toBe('');
    });
  });

  it('onSubmit HS => affiche une erreur HTTP si le service retourne une HttpErrorResponse', () => {
    searchCityResponse = throwError(() => new HttpErrorResponse({ status: 500 }));

    component.citySearchForm.controls.city.setValue('City');

    component.onSubmit();

    expect(component.searchErrorMessage()).toContain('Erreur HTTP');
  });

  it('onSubmit HS => affiche le message si le service retourne une Error classique', () => {
    searchCityResponse = throwError(() => new Error('Erreur simulée'));

    component.citySearchForm.controls.city.setValue('City');

    component.onSubmit();

    expect(component.searchErrorMessage()).toBe('Erreur simulée');
  });

  it('onClickSuggestion OK => émet la ville sélectionnée et vide les suggestions', () => {
    // Permet d'espionner l'émission de l'output du composant.
    const emitSpy = vi.spyOn(component.currentCity, 'emit');
    component.suggestions.set([city1, city2]);
    // simulation d'une erreur précédente.
    component.searchErrorMessage.set('Erreur');

    component.onClickSuggestion(city2);

    expect(emitSpy).toHaveBeenCalledWith(city2);
    expect(component.suggestions()).toEqual([]);
    expect(component.searchErrorMessage()).toBe('');
  });
});
