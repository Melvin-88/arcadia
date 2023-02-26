import React, { useCallback, useMemo } from 'react';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
  ITextFieldProps, TextField, positiveDigitValidator, parseNumberWithThousandsSeparators,
} from 'arcadia-common-fe';

interface IDenominatorFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const DenominatorTextField: React.FC<IDenominatorFieldProps> = ({
  label = 'Denominator',
  placeholder = 'Denominator',
  ...restProps
}) => {
  const mask = useMemo(() => (
    createNumberMask({
      prefix: '',
      allowDecimal: true,
    })
  ), []);

  const handleParse = useCallback((value: string) => (
    value ? parseNumberWithThousandsSeparators(value) : undefined
  ), []);

  return (
    <TextField
      name="denominator"
      label={label}
      placeholder={placeholder}
      validate={positiveDigitValidator}
      parse={handleParse}
      mask={mask}
      maxLength={25}
      {...restProps}
    />
  );
};
