// @ts-ignore
import TimeFieldBase from 'react-simple-timefield';
import React, { ChangeEvent } from 'react';
import { ITextFieldBaseProps, TextFieldBase } from './TextFieldBase/TextFieldBase';

export interface ITimePickerBaseProps {
  textFieldProps?: Partial<ITextFieldBaseProps>
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const TimePickerBase: React.FC<ITimePickerBaseProps> = ({
  textFieldProps,
  ...restProps
}) => (
  <TimeFieldBase
    input={<TextFieldBase {...textFieldProps} />}
    colon=":"
    {...restProps}
  />
);
