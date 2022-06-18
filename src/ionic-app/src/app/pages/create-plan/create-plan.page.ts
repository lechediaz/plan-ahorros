import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

// Constants
import { ROUTES } from '../../constants';

// Models
import { SavingPlan } from './../../models';

// Services
import { SavingPlanService } from './../../services';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.page.html',
  styleUrls: ['./create-plan.page.scss'],
})
export class CreatePlanPage implements OnInit {
  constructor(
    private planService: SavingPlanService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async onSubmitClick(plan: SavingPlan) {
    try {
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

      await toast.present();
    }
  }
}
