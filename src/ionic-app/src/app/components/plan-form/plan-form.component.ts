import { ToastController } from '@ionic/angular';
import { Plan } from '../../models/plan';
import { Interval } from '../../enums/interval';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent implements OnInit {
  constructor(private toast: ToastController) {
    const yearsArray = [];

    for (let index = 0; index < 30; index++) {
      yearsArray.push(index + 1);
    }

    this.yearsArray = yearsArray;
  }

  public interval = Interval;

  @Output() onSubmitClick = new EventEmitter<Plan>();

  form = new FormGroup({
    income: new FormControl('', [Validators.required, Validators.min(0)]),
    bills: new FormControl('', [Validators.required, Validators.min(0)]),
    years: new FormControl('1', [Validators.required, Validators.min(1)]),
    fee: new FormControl('0'),
    interval: new FormControl('', [Validators.required]),
    amount_to_save: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    goal: new FormControl('', [Validators.required]),
  });

  yearsArray: number[] = [];

  ngOnInit() {}

  onCalculateFeeClick() {
    this.calculateFee();
  }

  onSubmit() {
    this.calculateFee();

    this.onSubmitClick.emit({
      amount_to_save: parseFloat(this.form.value.amount_to_save),
      goal: this.form.value.goal,
      income: parseFloat(this.form.value.income),
      bills: parseFloat(this.form.value.bills),
      years: parseFloat(this.form.value.years),
      fee: parseFloat(this.form.value.fee),
      interval: Interval[this.form.value.interval],
    });
  }

  calculateFee() {
    let borrowingCapacity =
      parseFloat(this.form.value.income) - parseFloat(this.form.value.bills);

    const amount_to_save = parseFloat(this.form.value.amount_to_save);
    const intervalValue = parseInt(this.form.value.interval);
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
      this.toast
        .create({
          message: `Imposible ahorrar ese monto en el intervalo de tiempo`,
          duration: 5000,
        })
        .then((t) => t.present());
    } else {
      this.form.patchValue({
        fee: fee.toString(),
      });
    }
  }
}
