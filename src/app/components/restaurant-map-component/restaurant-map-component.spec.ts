import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantMapComponent } from './restaurant-map-component';

describe('RestaurantMapComponent', () => {
  let component: RestaurantMapComponent;
  let fixture: ComponentFixture<RestaurantMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
