import React, { useCallback, useMemo } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { createRequiredValidator } from './validators';
import { convertTimeToSeconds, convertDataToJSON, secondsToTimeSpan } from '../../services';
import { TimeSpanFormat } from '../../types';
import { DatepickerBase, IDatepickerBaseProps } from '../inputs/DatepickerBase/DatepickerBase';
import { DurationPickerBase } from '../inputs/DurationPickerBase';
import { TextFieldBase } from '../inputs/TextFieldBase/TextFieldBase';
import { CheckboxBase } from '../inputs/CheckboxBase/CheckboxBase';
import { ISelectOptions, SelectBase } from '../inputs/SelectBase/SelectBase';
import { JSONEditorBase } from '../inputs/JSONEditorBase/JSONEditorBase';

export interface ITextFieldProps extends FieldProps<string | number | undefined, FieldRenderProps<string | number | undefined>> {
  isRequired?: boolean
}

export const TextField: React.FC<ITextFieldProps> = ({
  label, isRequired, parse, name, ...restFieldProps
}) => {
  const fieldProps = { ...restFieldProps };
  const validator = useMemo(() => (
    isRequired ? createRequiredValidator(label) : () => undefined
  ), [label]);

  fieldProps.parse = useCallback((value?: null | string | number) => {
    if (parse) {
      return parse(value, name);
    }

    if (fieldProps.type === 'number') {
      return value ? Number(value) : undefined;
    }

    return value === '' ? null : value;
  }, [fieldProps.type, parse, name]);

  if (fieldProps.formValues) {
    delete fieldProps.formValues;
  }

  return (
    <Field
      name={name}
      label={label}
      validate={validator}
      {...fieldProps}
    >
      { ({ input, meta, ...restProps }) => {
        const errorMessage = meta.touched && (meta.dirty || meta.submitFailed) ? meta.error : '';

        return (
          <TextFieldBase
            {...input}
            {...restProps}
            error={errorMessage}
          />
        );
      } }
    </Field>
  );
};

export interface ICheckboxProps extends FieldProps<boolean, FieldRenderProps<boolean>> {
}

export const Checkbox: React.FC<ICheckboxProps> = (props) => (
  <Field defaultValue={false} {...props}>
    { ({ input, ...restProps }) => {
      const { value, ...restInput } = input;

      return (
        <CheckboxBase
          {...restInput}
          {...restProps}
          value={!!input.value}
        />
      );
    } }
  </Field>
);

export interface ISelectProps extends FieldProps<string | string[], FieldRenderProps<string | string[]>> {
  options: ISelectOptions
}

export const Select: React.FC<ISelectProps> = ({
  label, isRequired, isCreatable, parse, name, ...restFieldProps
}) => {
  const fieldProps = { ...restFieldProps };
  const validator = useMemo(() => (
    isRequired ? createRequiredValidator(label) : () => undefined
  ), [label, isRequired]);

  fieldProps.parse = useCallback((value: any) => {
    if (parse) {
      return parse(value, name);
    }

    return value === '' ? null : value;
  }, [parse, name]);

  return (
    <Field name={name} label={label} validate={validator} {...fieldProps}>
      { ({
        input,
        meta,
        options,
        ...restProps
      }) => {
        const errorMessage = meta.touched && (meta.dirty || meta.submitFailed) ? meta.error : '';

        return (
          <SelectBase
            {...input}
            {...restProps}
            options={options}
            isCreatable={isCreatable}
            error={errorMessage}
          />
        );
      } }
    </Field>
  );
};

export interface IDatepickerProps extends
  Omit<IDatepickerBaseProps, 'value' | 'name' | 'children' | 'onChange'>,
  FieldProps<string | Date, FieldRenderProps<string | Date>> {
}

export const Datepicker: React.FC<IDatepickerProps> = (props) => {
  const handleFormat = useCallback((value?: string | Date) => {
    if (!value) {
      return value;
    }

    return new Date(value);
  }, []);

  return (
    <Field
      format={handleFormat}
      {...props}
    >
      { ({
        input,
        meta,
        startDate,
        endDate,
        ...restProps
      }) => {
        const errorMessage = meta.touched && (meta.dirty || meta.submitFailed) ? meta.error : '';
        const selected = input.value ? new Date(input.value) : null;

        // TODO: Build-in ISO transformation directly to the datepicker
        const handleChange = useCallback((value: Date) => {
          if (!value) {
            return input.onChange(value);
          }

          return input.onChange(value.toISOString());
        }, [input.onChange]);

        return (
          <DatepickerBase
            {...restProps}
            selected={selected}
            startDate={startDate ? new Date(startDate) : undefined}
            endDate={endDate ? new Date(endDate) : undefined}
            error={errorMessage}
            onChange={handleChange}
          />
        );
      } }
    </Field>
  );
};

interface ITimeFieldProps extends FieldProps<number, FieldRenderProps<number>> {
}

export const TimeField: React.FC<ITimeFieldProps> = ({
  placeholder = 'HH:mm:ss', ...restFieldProps
}) => (
  <Field
    placeholder={placeholder}
    {...restFieldProps}
  >
    { ({ input, meta, ...restProps }) => (
      <DurationPickerBase
        {...input}
        {...restProps}
      />
    ) }
  </Field>
);

interface ICustomTimeInputProps {
  value: string
  onChange: (value: string) => void
}

const CustomTimeInput: React.FC<ICustomTimeInputProps> = ({ value, onChange }) => {
  const handleChangeInput = useCallback((newValue) => {
    const timeSpan = secondsToTimeSpan(newValue, TimeSpanFormat.HHmm);

    onChange(timeSpan);
  }, [onChange]);

  return (
    <DurationPickerBase
      value={convertTimeToSeconds(value, TimeSpanFormat.HHmm)}
      onChange={handleChangeInput}
    />
  );
};

export interface IDateTimePickerFieldProps extends FieldProps<string, FieldRenderProps<string>> {
}

export const DateTimePickerField: React.FC<IDateTimePickerFieldProps> = (props) => (
  <Field {...props}>
    {({
      input,
      meta,
      startDate,
      endDate,
      ...restProps
    }) => {
      const errorMessage = meta.touched && (meta.dirty || meta.submitFailed) ? meta.error : '';
      const selected = input.value ? new Date(input.value) : null;
      const handleChange = useCallback((value: Date | null) => {
        if (value && Number.isNaN(value.getTime())) {
          input.onChange(null);
        } else {
          const valueISO = value ? new Date(value).toISOString() : null;

          input.onChange(valueISO);
        }
      }, [input.onChange]);

      return (
        <DatepickerBase
          {...restProps}
          selected={selected}
          error={errorMessage}
          placeholderText="DD/MM/YYYY,hh:mm"
          dateFormat="MM/dd/yyyy,HH:mm"
          timeFormat="HH:mm"
          showTimeInput
          startDate={startDate ? new Date(startDate) : undefined}
          endDate={endDate ? new Date(endDate) : undefined}
          // @ts-ignore
          customTimeInput={<CustomTimeInput />}
          onChange={handleChange}
        />
      );
    } }
  </Field>
);

export interface IJSONEditorFieldProps extends FieldProps<string | undefined, FieldRenderProps<string | undefined>> {
}

export const JSONEditorField: React.FC<IJSONEditorFieldProps> = ({ label, isRequired, ...restFieldProps }) => {
  const handleFormat = useCallback((value) => {
    if (typeof value === 'object') {
      return convertDataToJSON(value);
    }

    return value;
  }, []);

  return (
    <Field
      label={label}
      format={handleFormat}
      {...restFieldProps}
    >
      { ({ input, meta, ...restProps }) => (
        <JSONEditorBase
          {...input}
          {...restProps}
        />
      )}
    </Field>
  );
};
