import { TestBed } from '@angular/core/testing';

import { AllVoyageService } from './all-voyage.service';

describe('AllVoyageService', () => {
  let service: AllVoyageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllVoyageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
