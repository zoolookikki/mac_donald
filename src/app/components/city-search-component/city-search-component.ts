import { Component, EventEmitter, Output, signal } from '@angular/core';
import { City } from '../../models/city';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySearchService } from '../../services/city-search-service';
import { HttpErrorResponse } from '@angular/common/http';

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
  private cityRegex: RegExp = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

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
  }

  public onSubmit(): void {
    this.errorMessage.set('');
    this.suggestions.set([]);

    /*
    const city = this.citySearchForm.get('city')?.value.trim().toLowerCase();
    Je récupère directement le contrôle "city" dans la liste des contrôles du formulaire => mieux que le get (si le champs
      n'existe pas)
    */
    const city: string = this.citySearchForm.controls.city.value.trim().toLowerCase();

    /*
    par protection.
    test !city meilleur que this.citySearchForm.invalid avec Validators.required car ne voit pas la saisie de blancs.
    */
//    if (this.citySearchForm.invalid) {
    if (!city) {
      // force l’affichage des erreurs de validation.
      this.citySearchForm.markAllAsTouched();
      this.errorMessage.set("La saisie de la ville est obligatoire.");
      return;
    }    

    // pas forcément utile dans notre projet (pour tester)
    if (this.citySearchForm.controls.city.hasError('pattern')) {
      this.citySearchForm.markAllAsTouched();
      this.errorMessage.set("La ville ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
      return;
    }

    // test city hs dans le service => erreur interne.
    //this.citySearchService.searchCity('').subscribe({
    this.citySearchService.searchCity(city).subscribe({
      next: (cities: City[]) => {
        if (cities.length === 0) {
          this.errorMessage.set('Aucune correspondance trouvée pour cette recherche.');
          return;
        }

        // set car suggestions est un signal.
        this.suggestions.set(cities);

        console.log(this.suggestions());
      },
      /*
      unknown mieux que any car l'erreur peut venir de plusieurs sources :
      - HttpErrorResponse : erreur HTTP/API ;
      - Error : erreur interne créée avec throwError ;
      - autre type imprévu.
      On vérifie donc le type avant d'utiliser l'erreur.
      */
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage.set("Erreur HTTP : impossible de contacter le service de recherche.");
          return;
        }

        if (error instanceof Error) {
          this.errorMessage.set(error.message);
          return;
        }

        this.errorMessage.set("Erreur inconnue lors de la recherche de la ville.");
      }
    });
  }

  public onClickSuggestion(suggestion: City): void {
    this.currentCity.emit(suggestion);
    this.errorMessage.set('');
    this.suggestions.set([]);
  }

}
