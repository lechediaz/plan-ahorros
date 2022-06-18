import { TestBed } from '@angular/core/testing';

import { SavingPlanService } from './saving-plan.service';

describe('SavingPlanService', () => {
  let service: SavingPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavingPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
