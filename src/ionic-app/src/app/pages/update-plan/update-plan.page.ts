import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from './../../models';
import { PlanService } from './../../services';

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.page.html',
  styleUrls: ['./update-plan.page.scss'],
})
export class UpdatePlanPage implements OnInit {
  constructor(
    private planService: PlanService,
    private route: ActivatedRoute
  ) {}

  plan: Plan = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.planService.getPlanById(id).then((plan) => (this.plan = plan));
  }

  onSubmitClick(plan: Plan) {
    // TODO:Actualizar el plan
  }
}
