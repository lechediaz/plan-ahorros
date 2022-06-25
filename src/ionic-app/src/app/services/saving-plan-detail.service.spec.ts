import { TestBed } from '@angular/core/testing';

import { SavingPlanDetailService } from './saving-plan-detail.service';

describe('SavingPlanDetailService', () => {
  let service: SavingPlanDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavingPlanDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
