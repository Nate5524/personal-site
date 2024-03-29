import { TestBed } from '@angular/core/testing';

import { StaticGuiFunctionsService } from './static-gui-functions.service';

describe('StaticGuiFunctionsService', () => {
  let service: StaticGuiFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticGuiFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
