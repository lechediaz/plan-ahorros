import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Constants
import { ROUTES } from '../../constants';

// Models
import { SavingPlan } from './../../models';

// Services
import { SavingPlanService } from './../../services';

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.page.html',
  styleUrls: ['./update-plan.page.scss'],
})
export class UpdatePlanPage implements OnInit {
  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private planService: SavingPlanService
  ) {}

  plan: SavingPlan = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.platform
      .ready()
      .then(() => this.getPlanById(Number(id)))
      .then(() => {});
  }

  getPlanById = async (id: number) => {
    let loading = await this.loadingCtrl.create({
      message: 'Consultando plan',
    });

    await loading.present();

    this.plan = await this.planService.getSavingPlanById(id);

    await loading.dismiss();
  };

  async onSubmitClick(plan: SavingPlan) {
    let loading: HTMLIonLoadingElement = null;

    try {
      loading = await this.loadingCtrl.create({
        message: 'Actualizando plan',
      });

      await loading.present();

      await this.planService.updateSavingPlan(plan);

      const toast = await this.toastController.create({
        message: 'Plan actualizado correctamente',
        duration: 4000,
      });

      await loading.dismiss();
      await toast.present();

      this.router.navigateByUrl(`/${ROUTES.MY_PLANS}`, { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Ha ocurrido un error',
      });

      await toast.present();

      if (loading !== null) {
        await loading.dismiss();
      }
    }
  }
}
