import { Router } from '@angular/router';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Constants
import { ROUTES } from '../../constants';

// Enums
import { Interval, PlanStatus } from '../../enums';

// Models
import { SavingPlan } from './../../models';

// Services
import { BasicInfoService, SavingPlanService } from './../../services';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.page.html',
  styleUrls: ['./create-plan.page.scss'],
})
export class CreatePlanPage implements OnInit {
  constructor(
    private platform: Platform,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private basicInfoService: BasicInfoService,
    private planService: SavingPlanService
  ) {}

  plan: SavingPlan = null;
  subscriptions = new Subscription();

  ngOnInit() {
    this.platform.ready().then(() => {
      this.subscriptions.add(
        this.basicInfoService.basicInfo
          .pipe(filter((basicInfo) => basicInfo !== null))
          .subscribe((basicInfo) => {
            this.plan = {
              amount_to_save: 0,
              bills: 0,
              fee: 0,
              goal: '',
              income: basicInfo.income,
              interval: Interval.Monthly,
              status: PlanStatus.Draft,
              years: 1,
              id: 0,
            };
          })
      );
    });
  }

  async onSubmitClick(plan: SavingPlan) {
    let loading: HTMLIonLoadingElement = null;

    try {
      loading = await this.loadingCtrl.create({
        message: 'Creando nuevo plan',
      });

      await loading.present();

      await this.planService.createSavingPlan(plan);

      const toast = await this.toastController.create({
        message: 'Plan creado correctamente',
        duration: 4000,
      });

      await toast.present();

      this.router.navigateByUrl(`/${ROUTES.MY_PLANS}`, { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Ha ocurrido un error',
      });

      await loading.dismiss();
      await toast.present();
    } finally {
      if (loading !== null) {
        await loading.dismiss();
      }
    }
  }
}
