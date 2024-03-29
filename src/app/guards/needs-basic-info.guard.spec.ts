import { TestBed } from '@angular/core/testing';

import { NeedsBasicInfoGuard } from './needs-basic-info.guard';

describe('NeedsBasicInfoGuard', () => {
  let guard: NeedsBasicInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NeedsBasicInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
