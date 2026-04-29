import { Component, EventEmitter, Output } from '@angular/core';
import { City } from '../../models/city';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  @Output() currentCity = new EventEmitter<City>();

  /* 
  Typage meilleur que public citySearchForm: FormGroup; ==> voir type CitySearchForm plus haut.
  C'est un formulaire mais en plus Typescript sait que le champ city de type string.
  Me permet en plus d'écrire citySearchForm.controls.city.value au lieu de citySearchForm.controls['city'].value + autocompletion.
  */
  public citySearchForm: CitySearchForm;

  constructor() {
    this.citySearchForm = new FormGroup({
      city: new FormControl('', {
        /*
        Typage plus strict permettant d'être sûr que la valeur ne sera jamais nulle. 
        Evite des tests.
        */
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  private choix1() : void {
    const lieusaint: City = {
      name: 'Lieusaint',
      lat : 48.633331,
      lon: 2.55
    };

    this.currentCity.emit(lieusaint);
  }
  private choix2() : void {
    const sete: City = {
      name: 'Sète',
      lat: 43.400002,
      lon: 3.68333
    };

    this.currentCity.emit(sete);
  }

  public onSubmit() {
    if (this.citySearchForm.invalid) {
      /*
      Marque tous les champs du formulaire comme “touchés” => sans markAllAsTouched(), si l’utilisateur clique directement sur le 
      bouton de validation sans toucher au champ, le message d’erreur pourrait ne pas s’afficher.
      */
      this.citySearchForm.markAllAsTouched();
      return;
    }

    /*
    const city = this.citySearchForm.get('city')?.value.trim().toLowerCase();
    Je récupère directement le contrôle "city" dans la liste des contrôles du formulaire => mieux que le get (si le champs 
      n'existe pas)
    */
    const city: string = this.citySearchForm.controls.city.value.trim().toLowerCase();

    // par protection.
    if (!city) {
      this.citySearchForm.markAllAsTouched();
      return;
    }    

    if (city === 'lieusaint') {
      this.choix1();
      return;
    }

    if (city === 'sète' || city === 'sete') {
      this.choix2();
      return;
    }

    // Simulation provisoire tant que Nominatim n'est pas branché.
    this.choix1();
  }

}
