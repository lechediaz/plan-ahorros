import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { calculateNewDate, roundDecimal } from '../../utils';

// Constants
import { ROUTES } from '../../constants';

// Enums
import { Interval, PlanStatus } from './../../enums';

// Models
import { SavingPlan } from './../../models';

// Services
import { SavingPlanService } from './../../services';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  styleUrls: ['./my-plans.page.scss'],
})
export class MyPlansPage implements OnInit {
  constructor(
    private router: Router,
    private planService: SavingPlanService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  PlanStatus = PlanStatus;

  plans: SavingPlan[] = [];

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPlans().then(() => {});
  }

  getPlans = async () => {
    const plans = await this.planService.getAllSavingPlans();

    this.plans = plans;
  };

  onCreateClick() {
    this.router.navigateByUrl(`/${ROUTES.CREATE_PLAN}`);
  }

  onUpdateClick(plan: SavingPlan) {
    const route = `/${ROUTES.UPDATE_PLAN}`.replace(':id', plan.id.toString());

    this.router.navigateByUrl(route);
  }

  async onDeleteClick(plan: SavingPlan) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `Por favor confirme que desea eliminar el plan de ahorros '${plan.goal}'`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'ok',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role === 'ok') {
      await this.planService.deleteSavingPlan(plan);

      const toast = await this.toastController.create({
        message: `Plan '${plan.goal}' eliminado.`,
        duration: 3000,
      });

      await toast.present();

      await this.getPlans();
    }
  }

  async onStartClick(plan: SavingPlan) {
    let multiple = 1;

    switch (plan.interval) {
      case Interval.Weekly:
        multiple = 52.1429;
        break;
      case Interval.Biweekly:
        multiple = 26.0714;
        break;
      default:
        // Monthly
        multiple = 12;
        break;
    }

    multiple *= plan.years;

    let newDate = new Date();
    let subTotal = 0;

    for (let year = 0; year < multiple; year++) {
      let fee = plan.fee;
      newDate = calculateNewDate(newDate, plan.interval);

      if (
        [Interval.Biweekly, Interval.Weekly].includes(plan.interval) &&
        year >= multiple - 1
      ) {
        fee = roundDecimal(plan.amount_to_save - subTotal, 2);
        subTotal = roundDecimal(subTotal + fee, 2);
      } else {
        subTotal = roundDecimal(subTotal + plan.fee, 2);
      }

      console.log('Data', {
        nuevaFecha: dayjs(newDate).format('YYYY-MM-DD'),
        subTotal,
        fee,
        year: year + 1,
      });
    }
  }
}
