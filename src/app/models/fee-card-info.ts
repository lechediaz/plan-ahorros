/** Represents fee card information.  */
export interface FeeCardInfo {
  // Saving plan info
  amount_to_save: number;
  goal: string;

  // Saving plan detail info
  id?: number;
  saving_plan_id: number;
  saving_date: string;
  subtotal: number;
  fee: number;
  quota_number: number;
  saving_made: number;
}
