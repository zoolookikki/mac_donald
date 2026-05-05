import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Poi } from '../../models/poi';

@Component({
  selector: 'app-restaurant-overlay-component',
  imports: [],
  templateUrl: './restaurant-overlay-component.html',
  styleUrl: './restaurant-overlay-component.css',
})
export class RestaurantOverlayComponent {
  @Input() public currentPOI: Poi | null = null;  
  @Output() public continue = new EventEmitter<void>();

  public onClickContinue(): void {
    this.continue.emit();
  }
}

