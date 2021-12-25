import { TestBed } from '@angular/core/testing';

import { MaintanenceService } from './maintanence.service';

describe('MaintanenceService', () => {
  let service: MaintanenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintanenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
