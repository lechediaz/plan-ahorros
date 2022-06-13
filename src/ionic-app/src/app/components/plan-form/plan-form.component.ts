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

import { ToastController } from '@ionic/angular';
import { Interval, PlanStatus } from '../../enums';
import { Plan } from '../../models';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent implements OnInit, OnChanges {
  constructor(private toastController: ToastController) {
    const yearsArray = [];

    for (let index = 0; index < 30; index++) {
      yearsArray.push(index + 1);
    }

    this.yearsArray = yearsArray;
  }

  public Interval = Interval;

  @Output() onSubmitClick = new EventEmitter<Plan>();

  @Input() planToEdit: Plan = null;

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
        amount_to_save: amount_to_save.toString(),
        bills: bills.toString(),
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
    let borrowingCapacity =
      parseFloat(this.form.value.income) - parseFloat(this.form.value.bills);

    const amount_to_save = parseFloat(this.form.value.amount_to_save);
    const intervalValue = this.form.value.interval;
    const yearsValue = parseInt(this.form.value.years);

    let dividend = 0;

    switch (intervalValue) {
      case Interval.Weekly:
        dividend = 52.1429;
        borrowingCapacity /= 4.34524;
        break;
      case Interval.Biweekly:
        dividend = 26.0714;
        borrowingCapacity /= 2.17262;
        break;
      case Interval.Monthly:
        dividend = 12;
        break;
    }

    dividend *= yearsValue;

    const fee = amount_to_save / dividend;

    if (fee > borrowingCapacity) {
      this.toastController
        .create({
          message: `Imposible ahorrar ese monto en el intervalo de tiempo`,
          duration: 5000,
        })
        .then((t) => t.present());
    } else {
      this.form.patchValue({
        fee,
      });
    }
  }
}
