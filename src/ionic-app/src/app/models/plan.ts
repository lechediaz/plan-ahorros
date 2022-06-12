import { Interval } from '../enums';

export interface Plan {
  income: number;
  interval: Interval;
  amount_to_save: number;
  bills: number;
  years: number;
  goal: string;
  fee: number;
}
