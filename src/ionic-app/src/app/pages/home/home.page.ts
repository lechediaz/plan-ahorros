import { Component, OnInit } from '@angular/core';
import { FeeCardInfo } from '../../models';

// Service
import { SavingPlanDetailService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private savingPlanDetailService: SavingPlanDetailService) {}

  feeCardsInfo: FeeCardInfo[] = [];

  ngOnInit() {
    this.fetchPendingDetails().then(() => {});
  }

  fetchPendingDetails = async () => {
    const pendingDetails =
      await this.savingPlanDetailService.getPendingDetails();

    this.feeCardsInfo = pendingDetails;
  };

  async onQuotaSaved(feeCardInfo: FeeCardInfo) {
    const { id, saving_plan_id } = feeCardInfo;

    await this.savingPlanDetailService.markDetailAsMade(id, saving_plan_id);
    await this.fetchPendingDetails();
  }
}
