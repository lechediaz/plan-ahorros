import { Component, OnInit } from '@angular/core';
import { SavingPlanDetail } from 'src/app/models';

// Service
import { SavingPlanDetailService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private savingPlanDetailService: SavingPlanDetailService) {}

  nextSavingPlanDetails: SavingPlanDetail[] = [];

  ngOnInit() {
    this.savingPlanDetailService.getNextSavingDetails().then((details) => {
      this.nextSavingPlanDetails = details;
    });
  }
}
