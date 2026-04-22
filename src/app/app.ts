import { Component } from '@angular/core';
import { MainPageComponent } from "./pages/main-page-component/main-page-component";

@Component({
  selector: 'app-root',
  imports: [MainPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
