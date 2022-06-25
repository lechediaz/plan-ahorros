import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Interval, PlanStatus } from '../../enums';
import { SavingPlan } from '../../models';
import { SavingPlanService } from '../../services';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent implements OnInit, OnChanges {
  constructor(private savingPlanService: SavingPlanService) {
    const yearsArray = [];

    for (let index = 0; index < 30; index++) {
      yearsArray.push(index + 1);
    }

    this.yearsArray = yearsArray;
  }

  public Interval = Interval;

  @Output() onSubmitClick = new EventEmitter<SavingPlan>();

  @Input() planToEdit: SavingPlan = null;

  form = new FormGroup({
    income: new FormControl('', [Validators.required, Validators.min(0)]),
    bills: new FormControl('', [Validators.required, Validators.min(0)]),
    years: new FormControl('1', [Validators.required, Validators.min(1)]),
    fee: new FormControl(0),
    interval: new FormControl(Interval.Monthly, [Validators.required]),
    amount_to_save: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    goal: new FormControl('', [Validators.required]),
    status: new FormControl(PlanStatus.Draft),
    id: new FormControl(0),
  });

  yearsArray: number[] = [];

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const planToEditPrevious = changes['planToEdit'].previousValue;
    const planToEditCurrent = changes['planToEdit'].currentValue;

    if (planToEditPrevious === null && planToEditCurrent !== null) {
      const {
        amount_to_save,
        bills,
        fee,
        goal,
        id,
        income,
        interval,
        status,
        years,
      } = planToEditCurrent;

      this.form.setValue({
        amount_to_save: amount_to_save !== 0 ? amount_to_save.toString() : '',
        bills: bills !== 0 ? bills.toString() : '',
        fee,
        goal,
        id,
        income: income.toString(),
        interval,
        status,
        years: years.toString(),
      });
    }
  }

  onCalculateFeeClick() {
    this.calculateFee();
  }

  onSubmit() {
    this.calculateFee();

    const {
      amount_to_save,
      bills,
      fee,
      goal,
      id,
      income,
      interval,
      status,
      years,
    } = this.form.value;

    this.onSubmitClick.emit({
      id,
      amount_to_save: parseFloat(amount_to_save),
      goal,
      income: parseFloat(income),
      bills: parseFloat(bills),
      years: parseFloat(years),
      fee,
      interval,
      status,
    });
  }

  calculateFee() {
    let { amount_to_save, income, bills, years } = this.form.value;

    const savinPlan = {
      ...this.form.value,
      amount_to_save: parseFloat(amount_to_save),
      income: parseFloat(income),
      bills: parseFloat(bills),
      years: parseInt(years),
    };

    this.savingPlanService
      .calculateFee(savinPlan)
      .then((fee) =>
        this.form.patchValue({
          fee,
        })
      )
      .catch(() => {});
  }
}
