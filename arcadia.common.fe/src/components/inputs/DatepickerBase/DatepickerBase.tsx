import React, { forwardRef, Ref, useRef } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import classNames from 'classnames';
import { ITextFieldBaseProps, TextFieldBase } from '../TextFieldBase/TextFieldBase';
import { DATEPICKER_PORTAL_ID } from '../../../constants';
import './styles/DatepickerBase.scss';

export interface IDatepickerBaseProps extends ReactDatePickerProps {
  classNameDatepicker?: string
  label?: string
  dateFormat?: string
  error?: string
}

interface ICustomDateInputProps {
  props?: ITextFieldBaseProps
  ref: Ref<HTMLInputElement>
  error?: string
}

const CustomDateInput: React.FC<ICustomDateInputProps> = forwardRef((props, ref) => (
  <TextFieldBase {...props} inputRef={ref} autoComplete="off" />
));

export const DatepickerBase: React.FC<IDatepickerBaseProps> = ({
  className,
  classNameDatepicker,
  label,
  error,
  isClearable = true,
  placeholderText = 'MM/DD/YYYY',
  dateFormat = 'MM/dd/yyyy',
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={classNames('datepicker', className)}>
      { label && (
        <div className="datepicker__label">{ label }</div>
      ) }
      <DatePicker
        portalId={DATEPICKER_PORTAL_ID}
        dateFormat={dateFormat}
        calendarClassName={classNames(
          'datepicker__body',
          classNameDatepicker,
        )}
        wrapperClassName="datepicker__wrapper"
        placeholderText={placeholderText}
        isClearable={isClearable}
        popperModifiers={{
          preventOverflow: {
            enabled: true,
          },
        }}
        customInput={(
          <CustomDateInput ref={inputRef} error={error} />
        )}
        {...restProps}
      />
    </div>
  );
};
