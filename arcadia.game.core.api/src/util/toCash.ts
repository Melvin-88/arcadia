import BigNumber from 'bignumber.js';

export function toCash(value: BigNumber.Value, conversionRate: BigNumber.Value): number {
  return new BigNumber(value).multipliedBy(conversionRate).dp(2).toNumber();
}
