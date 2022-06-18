import { ToastController } from '@ionic/angular';
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
    private planService: SavingPlanService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  plan: SavingPlan = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.planService.getSavingPlanById(id).then((plan) => (this.plan = plan));
  }

  async onSubmitClick(plan: SavingPlan) {
    try {
      await this.planService.updateSavingPlan(plan);

      const toast = await this.toastController.create({
        message: 'Plan actualizado correctamente',
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
