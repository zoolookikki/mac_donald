import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOverlayComponent } from './restaurant-overlay-component';

describe('RestaurantOverlayComponent', () => {
  let component: RestaurantOverlayComponent;
  let fixture: ComponentFixture<RestaurantOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantOverlayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
