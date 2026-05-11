import { Component, EventEmitter, Output, signal } from '@angular/core';
import { City } from '../../models/city';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySearchService } from '../../services/city-search-service';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, filter, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type CitySearchForm = FormGroup<{
  city: FormControl<string>;
}>;

@Component({
  selector: 'app-city-search-component',
  imports: [ReactiveFormsModule],
  templateUrl: './city-search-component.html',
  styleUrl: './city-search-component.css',
})
export class CitySearchComponent {
  @Output() public currentCity = new EventEmitter<City>();

  /*
  Typage meilleur que public citySearchForm: FormGroup; ==> voir type CitySearchForm plus haut.
  C'est un formulaire mais en plus Typescript sait que le champ city de type string.
  Me permet en plus d'écrire citySearchForm.controls.city.value au lieu de citySearchForm.controls['city'].value + autocompletion.
  */
  public citySearchForm: CitySearchForm;

  // signal sinon affichage en retard.
  //public suggestions: City[] = [];
  public suggestions = signal<City[]>([]);

  public errorMessage = signal<string>("");

  // pas forcément utile dans notre projet (pour tester)
  private readonly cityRegex: RegExp = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

  /*
  POC séquence 4 :
    true  => recherche optimisée avec debounceTime + switchMap
      Dans ce cas j'ai supprimé le bouton de recherche car génant ergonomiquement.
    false => recherche manuelle classique au submit
  */
  public readonly useOptimizedSearch: boolean = false;

  constructor(private citySearchService: CitySearchService) {
    this.citySearchForm = new FormGroup({
      city: new FormControl('', {
        /*
        Typage plus strict permettant d'être sûr que la valeur ne sera jamais nulle. 
        Evite des tests.
        */
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(this.cityRegex),
        ],
      }),
    });

    this.initOptimizedSearch();
  }

  private normalizeCitySearch(value: string): string {
    return value.trim().toLowerCase();
  }

  /*
  Cette méthode initialise la recherche automatique uniquement si useOptimizedSearch vaut true.
  Si useOptimizedSearch vaut false, aucun abonnement à valueChanges n'est créé.
  */
  private initOptimizedSearch(): void {
    if (this.useOptimizedSearch) {
      /*
      Le pipe ici permet d'enchaîner plusieurs traitements RxJS (transformation, filtre).
      L'observable valueChanges nous prévient à chaque fois que la valeur du champ change.
      */
      this.citySearchForm.controls.city.valueChanges.pipe(
        // on attend quelques millisecondes après la dernière frappe avant de continuer sinon on va appeler l' API Nominatim trop souvent (elle va s'arrêter de fonctionner).
        debounceTime(500),
        /*
        La saisie est tranformée dès le début du flux.
        Aurait pu être fait au moment du switchMap mais c'est mieux de le faire maintenant si la suite du flux en a besoin.
        */
        map((value: string) => this.normalizeCitySearch(value)),
        // on ne va pas plus loin si le champ n'a pas une saisie valide.
        filter((value: string) => {
          // suppression de la liste avant validation de la saisie sinon on ne voit pas clairement le message.
          this.suggestions.set([]);
          return this.validateSearch(value);
        }),
        /*
        Avec switchMap, si une nouvelle saisie arrive avant la réponse de l'API, l'ancienne recherche est ignorée au profit de la dernière.
        Sans switchMap, les réponses pourraient arriver dans le désordre et afficher des suggestions obsolètes.
        Donc mieux que de faire la recherche dans le subscribe ci-dessous.
        */
        switchMap((city: string) => this.citySearchService.searchCity(city)),
        // Un valueChanges reste actif tant que le composant existe. takeUntilDestroyed() évite de garder un abonnement inutile en mémoire si le composant disparaît.
        takeUntilDestroyed()
      ).subscribe({
        next: (cities: City[]) => {
          this.handleCitySearchSuccess(cities);
        },
        error: (error: unknown) => {
          this.handleCitySearchError(error);
        },
      });
    }
  }

  private validateSearch(city: string): boolean {
    this.errorMessage.set('');
    /*
    par protection.
    test !city meilleur que this.citySearchForm.invalid avec Validators.required car ne voit pas la saisie de blancs.
    */
//    if (this.citySearchForm.invalid) {
    if (!city) {
      this.citySearchForm.markAllAsTouched();
      this.errorMessage.set('La saisie de la ville est obligatoire.');
      return false;
    }

    // pas forcément utile dans notre projet (pour tester le regex)
    if (this.citySearchForm.controls.city.hasError('pattern')) {
      this.citySearchForm.markAllAsTouched();
      this.errorMessage.set('La ville ne doit contenir que des lettres, espaces, tirets ou apostrophes.');
      return false;
    }

    return true;
  }

  private handleCitySearchSuccess(cities: City[]): void {

    if (cities.length === 0) {
      this.errorMessage.set('Aucune correspondance trouvée pour cette recherche.');
      return;
    }

    this.suggestions.set(cities);

    console.log(this.suggestions());
  }  

  /*
  unknown mieux que any car l'erreur peut venir de plusieurs sources :
  - HttpErrorResponse : erreur HTTP/API ;
  - Error : erreur interne créée avec throwError ;
  - autre type imprévu.
  On vérifie donc le type avant d'utiliser l'erreur.
  */
  private handleCitySearchError(error: unknown): void {

    if (error instanceof HttpErrorResponse) {
      this.errorMessage.set('Erreur HTTP : impossible de contacter le service de recherche.');
      return;
    }

    if (error instanceof Error) {
      this.errorMessage.set(error.message);
      return;
    }

    this.errorMessage.set('Erreur inconnue lors de la recherche de la ville.');
  }

  /*
  En mode non optimisé (par défaut) => onSubmit lance la recherche API.
  En mode optimisé comme la recherche est gérée par ValueChanges => pas de bouton, pas de submit.
  */
  public onSubmit(): void {

    if (this.useOptimizedSearch) {
      return;
    }

    // Je récupère directement le contrôle "city" dans la liste des contrôles du formulaire => mieux que le get (si le champs n'existe pas)
    const city: string = this.normalizeCitySearch(this.citySearchForm.controls.city.value);

    this.suggestions.set([]);

    if (!this.validateSearch(city)) {
      return;
    }

    // test city hs dans le service => erreur interne.
    //this.citySearchService.searchCity('').subscribe({
    this.citySearchService.searchCity(city).subscribe({
      next: (cities: City[]) => {
        this.handleCitySearchSuccess(cities);
      },
      error: (error: unknown) => {
        this.handleCitySearchError(error);
      }
    });
  }

  public onClickSuggestion(suggestion: City): void {
    this.currentCity.emit(suggestion);
    this.errorMessage.set('');
    this.suggestions.set([]);
  }
}
