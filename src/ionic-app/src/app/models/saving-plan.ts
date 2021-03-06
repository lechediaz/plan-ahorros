import { Interval, PlanStatus } from '../enums';

/**
 * Saving plan representation.
 */
export interface SavingPlan {
  id?: number;
  income: number;
  interval: Interval;
  amount_to_save: number;
  bills: number;
  years: number;
  goal: string;
  fee: number;
  status: PlanStatus;
  started_date?: string;
  completed_date?: string;
  discarded_date?: string;
}
