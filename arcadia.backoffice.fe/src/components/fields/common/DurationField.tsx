import React, { useMemo } from 'react';
import {
  TimeSpanFormat, ITextFieldProps, TextField, IFormFieldProps,
} from 'arcadia-common-fe';

interface IDurationFieldProps extends Partial<ITextFieldProps>, IFormFieldProps {
  timeSpanFormat?: TimeSpanFormat
}

export const DurationField: React.FC<IDurationFieldProps> = ({
  className,
  timeSpanFormat = TimeSpanFormat.mmss,
  name = 'duration',
  label,
  ...restProps
}) => {
  const maskPattern = useMemo(() => {
    if (timeSpanFormat === TimeSpanFormat.HHmmss) {
      return [/[0-9]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
    }

    return [/[0-9]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
  }, [timeSpanFormat]);

  return (
    <TextField
      className={className}
      name={name}
      label={label}
      mask={maskPattern}
      placeholder={timeSpanFormat}
      {...restProps}
    />
  );
};
