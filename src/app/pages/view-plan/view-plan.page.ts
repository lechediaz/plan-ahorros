import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SavingPlanDetail } from 'src/app/models';

// Services
import { SavingPlanDetailService } from '../../services';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.page.html',
  styleUrls: ['./view-plan.page.scss'],
})
export class ViewPlanPage implements OnInit {
  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private savingPlanDetailService: SavingPlanDetailService
  ) {}

  paidDetails: SavingPlanDetail[] = [];
  pendingDetails: SavingPlanDetail[] = [];
  dataIsLoaded = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.platform
      .ready()
      .then(() => this.savingPlanDetailService.getDetailsByPlanId(Number(id)))
      .then((details) => {
        this.pendingDetails = details.filter((d) => d.saving_made === 0);
        this.paidDetails = details.filter((d) => d.saving_made === 1);
        this.dataIsLoaded = true;
      });
  }
}
