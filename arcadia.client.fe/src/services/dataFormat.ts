export const formatCurrency = (value: number, options: Intl.NumberFormatOptions) => {
  const { minimumFractionDigits = 2, ...restOptions } = options || {};

  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currencyDisplay: 'symbol',
    minimumFractionDigits,
    ...restOptions,
  });

  return formatter.format(value);
};
