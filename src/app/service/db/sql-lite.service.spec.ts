import { TestBed, inject } from '@angular/core/testing';

import { SqlLiteService } from './sql-lite.service';

describe('SqlLiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SqlLiteService]
    });
  });

  it('should be created', inject([SqlLiteService], (service: SqlLiteService) => {
    expect(service).toBeTruthy();
  }));
});
