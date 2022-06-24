/**
 * Allows to round a number with a max of decimals.
 * @param value The value to round.
 * @param decimals The decimals to round.
 * @returns Value rounded.
 */
export function roundDecimal(value: number, decimals: number) {
  return Number(Math.round(Number(`${value}e${decimals}`)) + `e-${decimals}`);
}

export default roundDecimal;
