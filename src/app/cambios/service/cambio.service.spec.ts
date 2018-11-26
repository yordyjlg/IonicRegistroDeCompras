import { TestBed, inject } from '@angular/core/testing';

import { CambioService } from './cambio.service';

describe('CambioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambioService]
    });
  });

  it('should be created', inject([CambioService], (service: CambioService) => {
    expect(service).toBeTruthy();
  }));
});
