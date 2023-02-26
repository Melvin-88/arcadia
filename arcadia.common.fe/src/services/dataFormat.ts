export const formatDenominator = (value: number) => {
  const { length } = value.toString();
  const formatter = new Intl.NumberFormat(undefined, {
    minimumSignificantDigits: length + 2,
  });

  return formatter.format(value);
};

export const formatCurrency = (value: number, currency: string) => {
  if (currency && value) {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  }

  return '';
};

export const parseNumberWithThousandsSeparators = (value: string = '') => (
  parseFloat(value.replace(/,/g, ''))
);

export const covertBooleanToYesNo = (state: boolean) => (
  state ? 'Yes' : 'No'
);

export const valueOrEmptyStub = (value: any) => (
  value || 'N/A'
);

export const convertDataToJSON = (data?: object | string | undefined | null) => {
  if (!data) {
    return '{}';
  }

  if (typeof data === 'string') {
    return data;
  }

  return (
    JSON.stringify(data || undefined, null, 4) || '{}'
  );
};

export const joinArrayBySymbol = (array: string[] | number[], symbol: string = ', ') => array && array.join(symbol);
