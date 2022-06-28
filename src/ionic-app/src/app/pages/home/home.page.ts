import { Component, OnInit } from '@angular/core';
import { FeeCardInfo } from '../../models';

// Service
import { SavingPlanDetailService } from '../../services';

// Utils
import { createArray } from '../../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private savingPlanDetailService: SavingPlanDetailService) {}

  feeCardsInfo: FeeCardInfo[] = [];
  fakeCards: number[] = [];
  isLoadingCardsInfo: boolean = false;

  ngOnInit() {
    this.createFakeCards();
    this.fetchPendingDetails().then(() => {});
  }

  createFakeCards() {
    this.fakeCards = createArray(6);
  }

  fetchPendingDetails = async () => {
    this.isLoadingCardsInfo = true;

    const pendingDetails =
      await this.savingPlanDetailService.getPendingDetails();

    this.feeCardsInfo = pendingDetails;
    this.isLoadingCardsInfo = false;
  };

  async onQuotaSaved(feeCardInfo: FeeCardInfo) {
    const { id, saving_plan_id } = feeCardInfo;

    await this.savingPlanDetailService.markDetailAsMade(id, saving_plan_id);
    await this.fetchPendingDetails();
  }
}
