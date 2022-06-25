import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

// Constants
import { ROUTES } from '../../constants';

// Enums
import { PlanStatus } from './../../enums';

// Models
import { SavingPlan } from './../../models';

// Services
import { SavingPlanDetailService, SavingPlanService } from './../../services';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  styleUrls: ['./my-plans.page.scss'],
})
export class MyPlansPage implements OnInit {
  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private savingPlanService: SavingPlanService,
    private savingPlanDetailService: SavingPlanDetailService
  ) {}

  PlanStatus = PlanStatus;

  plans: SavingPlan[] = [];

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPlans().then(() => {});
  }

  getPlans = async () => {
    const plans = await this.savingPlanService.getAllSavingPlans();

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
      await this.savingPlanService.deleteSavingPlan(plan);

      const toast = await this.toastController.create({
        message: `Plan '${plan.goal}' eliminado.`,
        duration: 3000,
      });

      await toast.present();

      await this.getPlans();
    }
  }

  onStartClick = async (plan: SavingPlan) => {
    const detailsToCreate = this.savingPlanDetailService.generateQuotas(plan);

    await this.savingPlanDetailService.createSavingPlanDetails(detailsToCreate);

    plan.status = PlanStatus.Started;
    plan.started_date = new Date().toISOString();

    await this.savingPlanService.updateSavingPlan(plan);

    await this.getPlans();

    const toast = await this.toastController.create({
      message: `Plan '${plan.goal}' iniciado.`,
      duration: 3000,
    });

    await toast.present();
  };
}
