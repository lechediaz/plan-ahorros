import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ROUTES } from '../../constants';
import { PlanStatus } from './../../enums';
import { Plan } from './../../models';
import { PlanService } from './../../services';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  styleUrls: ['./my-plans.page.scss'],
})
export class MyPlansPage implements OnInit {
  constructor(
    private router: Router,
    private planService: PlanService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  PlanStatus = PlanStatus;

  plans: Plan[] = [];

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPlans().then(() => {});
  }

  getPlans = async () => {
    const plans = await this.planService.getPlans();

    this.plans = plans;
  };

  onCreateClick() {
    this.router.navigateByUrl(`/${ROUTES.CREATE_PLAN}`);
  }

  onUpdateClick(plan: Plan) {
    const route = `/${ROUTES.UPDATE_PLAN}`.replace(':id', plan.id.toString());

    this.router.navigateByUrl(route);
  }

  async onDeleteClick(plan: Plan) {
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
      await this.planService.deletePlan(plan);

      const toast = await this.toastController.create({
        message: `Plan '${plan.goal}' eliminado.`,
      });

      await toast.present();

      await this.getPlans();
    }
  }
}
