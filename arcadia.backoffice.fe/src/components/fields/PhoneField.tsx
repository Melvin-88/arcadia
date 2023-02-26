import React, { useCallback, useMemo } from 'react';
import { createRequiredValidator, ITextFieldProps, TextField } from 'arcadia-common-fe';

interface IPhoneFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const PhoneField: React.FC<IPhoneFieldProps> = ({ label = 'Phone', placeholder = 'Phone number', ...restProps }) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  const handleParse = useCallback((value) => {
    if (!value) {
      return undefined;
    }

    return value.replace(/\D/g, '');
  }, []);

  return (
    <TextField
      name="phone"
      label={label}
      placeholder={placeholder}
      validate={validator}
      parse={handleParse}
      mask={['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
      {...restProps}
    />
  );
};
