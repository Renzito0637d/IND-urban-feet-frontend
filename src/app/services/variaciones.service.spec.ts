import { TestBed } from '@angular/core/testing';

import { VariacionesService } from './variaciones.service';

describe('VariacionesService', () => {
  let service: VariacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
