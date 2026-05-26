/*
Outil Angular qui permet de préparer un environnement de test.
Il sert à créer un faux “mini module Angular” pour tester un composant.
*/
import { TestBed } from '@angular/core/testing';

import { StateService } from './state-service';
import { city1, poi1, poi2 } from '../test/data';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    // Démarre la configuration de l’environnement de test Angular
    TestBed.configureTestingModule({});
    /*
    Récupération du service Api injecté (ici le mock).
    Cela signifie : donne-moi l’instance que le système d’injection fournirait pour Api.
    Du point de vue du framework : on parle d’injection.
    Du point de vue du développeur qui lit la ligne : ça ressemble à une récupération.
    */
    service = TestBed.inject(StateService);
  });

  it('Le service doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('État initial => les signaux ont leurs valeurs par défaut', () => {
    expect(service.currentCity()).toBeNull();
    expect(service.currentPOI()).toBeNull();
    expect(service.poiList()).toEqual([]);
    expect(service.errorMessage()).toBe('');
  });

  it('Mise à jour de la ville => réinitialisation des états', () => {
    service.setCurrentPOI(poi1);
    service.setPoiList([poi1, poi2]);
    service.setErrorMessage('Erreur');

    service.setCurrentCity(city1);

    expect(service.currentCity()).toEqual(city1);
    expect(service.currentPOI()).toBeNull();
    expect(service.errorMessage()).toBe('');
    expect(service.poiList()).toEqual([]);
  });

  it('Même ville sélectionnée => le restaurant sélectionné et la liste des restaurants sont conservés', () => {
    service.setCurrentCity(city1);
    service.setPoiList([poi1, poi2]);
    service.setCurrentPOI(poi1);

    service.setCurrentCity(city1);

    expect(service.currentCity()).toEqual(city1);
    expect(service.currentPOI()).toEqual(poi1);
    expect(service.poiList()).toEqual([poi1, poi2]);
  });

  it('Sélection d’un restaurant => currentPOI est mis à jour et le message d’erreur est vidé', () => {
    service.setErrorMessage('Erreur');

    service.setCurrentPOI(poi1);

    expect(service.currentPOI()).toEqual(poi1);
    expect(service.errorMessage()).toBe('');
  });

  it('Mise à jour de la liste des restaurants => poiList est mis à jour', () => {
    service.setPoiList([poi1, poi2]);

    expect(service.poiList()).toEqual([poi1, poi2]);
  });

  it('Mise à jour du message d’erreur => errorMessage est mis à jour', () => {
    service.setErrorMessage('Erreur');

    expect(service.errorMessage()).toBe('Erreur');
  });
});
