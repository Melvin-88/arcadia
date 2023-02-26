import React, { ChangeEvent, useCallback } from 'react';
import { TimePickerBase } from './TimePickerBase';
import { convertTimeToSeconds, secondsToTimeSpan } from '../../services/dateTime';
import { TimeSpanFormat } from '../../types';

export interface IDurationPickerBaseProps {
  className?: string
  value: number
  onChange: (value: number) => void
}

export const DurationPickerBase: React.FC<IDurationPickerBaseProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const timeSpan = secondsToTimeSpan(value);
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(convertTimeToSeconds(event.target.value, TimeSpanFormat.HHmm));
  }, [onChange]);

  return (
    <TimePickerBase
      value={timeSpan}
      onChange={handleChange}
      {...restProps}
    />
  );
};
