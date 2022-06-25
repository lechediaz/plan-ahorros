/** Repreents a saving plan detail. */
export interface SavingPlanDetail {
  id?: number;
  saving_plan_id: number;
  saving_date: string;
  subtotal: number;
  fee: number;
  quota_number: number;
  saving_made: number;
}
