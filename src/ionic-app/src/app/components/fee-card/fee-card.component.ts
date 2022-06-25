import { Component, Input, OnInit } from '@angular/core';
import { SavingPlanDetail } from 'src/app/models';

@Component({
  selector: 'app-fee-card',
  templateUrl: './fee-card.component.html',
  styleUrls: ['./fee-card.component.scss'],
})
export class FeeCardComponent implements OnInit {
  constructor() {}

  @Input() savingPlanDetail: SavingPlanDetail = null;

  ngOnInit() {}
}
