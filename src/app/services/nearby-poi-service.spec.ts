import { TestBed } from '@angular/core/testing';

import { NearbyPoiService } from './nearby-poi-service';

describe('NearbyPoiService', () => {
  let service: NearbyPoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyPoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
