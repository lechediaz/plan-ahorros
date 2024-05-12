import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants';
import { FeeCardInfo } from '../../models';
import { BasicInfoService, SavingPlanDetailService } from '../../services';
import { createArray } from '../../utils';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private basicInfoService: BasicInfoService,
    private router: Router,
    private savingPlanDetailService: SavingPlanDetailService
  ) {}

  feeCardsInfo: FeeCardInfo[] = [];
  fakeCards: number[] = [];
  isLoadingCardsInfo: boolean = false;
  userName: string = '';
  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.createFakeCards();
    this.fetchPendingDetails().then(() => {});
    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => {
          this.userName = basicInfo.username;
        })
    );
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

  onCardClickHandler(feeCardInfo: FeeCardInfo) {
    const { saving_plan_id } = feeCardInfo;
    const url = ROUTES.VIEW_PLAN.replace(':id', String(saving_plan_id));

    this.router.navigateByUrl(`/${url}`);
  }

  onCreateClick() {
    this.router.navigateByUrl(`/${ROUTES.CREATE_PLAN}`);
  }
}
