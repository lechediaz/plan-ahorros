import * as dayjs from 'dayjs';
import { Interval } from '../enums';

/**
 * Allows to calculate a new date using an initial date and depending the interval.
 * @param initialDate The initial date.
 * @param interval Interval to calculate new date.
 * @returns New Date
 */
export const calculateNewDate = (
  initialDate: Date,
  interval: Interval
): Date => {
  let newDate = dayjs(initialDate);

  switch (interval) {
    case Interval.Biweekly:
      newDate = newDate.add(2, 'week');
      break;
    case Interval.Weekly:
      newDate = newDate.add(1, 'week');
      break;

    default:
      newDate = newDate.add(1, 'month');
      break;
  }

  return newDate.toDate();
};

export default calculateNewDate;
