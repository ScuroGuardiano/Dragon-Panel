import { TestBed } from '@angular/core/testing';

import { RecordValidatorService } from './record-validator.service';

describe('RecordValidatorService', () => {
  let service: RecordValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
