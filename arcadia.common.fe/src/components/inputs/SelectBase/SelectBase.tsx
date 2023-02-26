import React, { CSSProperties, useCallback, useMemo } from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import classNames from 'classnames';
import { CheckboxBase } from '../CheckboxBase/CheckboxBase';
import './styles/SelectBase.scss';

export interface ISelectOption<TValue = string> {
  label: string
  value: TValue
}

export interface ISelectOptions<TValue = string> extends Array<ISelectOption<TValue>> {}

export interface ISelectBaseProps {
  className?: string
  classNameSelect?: string
  withHintAllocatedSpace?: boolean
  label?: string
  error?: string
  helperText?: string
  isMulti?: boolean
  dropdownWidthAuto?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  isCreatable?: boolean
  options: ISelectOptions
  value?: string | string[] | undefined
  onChange: (value: string | string[] | undefined) => void
}

// TODO: Remove this temporary solution after relative issue fix - https://github.com/JedWatson/react-select/issues/3754 BEGIN
const customStyles = {
  menuPortal: (styles: CSSProperties) => ({ ...styles, zIndex: 2 }),
  input: (base: CSSProperties) => ({
    ...base,
    padding: 0,
    margin: 0,
  }),
};

const DropdownIndicator = () => (
  <div className="select__dropdown-arrow" />
);
// TODO: any should be replaced with proper type after first priority tasks
const MultiValue = ({ data }: any) => (
  data && <div className="select__multi-value">{data.label}</div>
);
// TODO: any should be replaced with proper type after first priority tasks
const MenuList = ({
  isMulti, options, getValue, selectOption, selectProps,
}: any) => {
  const { inputValue } = selectProps;
  const filteredOptions = useMemo(() => options.filter(
    (item: { value: string | number, label: string }) => (inputValue ? item.label.indexOf(inputValue) !== -1 : item),
  ), [inputValue, options]);

  if (!filteredOptions.length) {
    return <div>No Items</div>;
  }

  return (
    filteredOptions.length ? filteredOptions.map((option: any) => {
      const isSelected = getValue()?.indexOf(option) !== -1;

      return (
        <div
          key={option.value}
          className={classNames(
            'select__option',
            {
              'select__option--is-selected': isSelected,
              'select__option--multi': isMulti,
            },
          )}
          role="button"
          tabIndex={0}
          onClick={() => selectOption(option)}
        >
          {isMulti && <CheckboxBase className="select__option-checkbox" value={isSelected} />}
          {option.label}
        </div>
      );
    }) : <div>No Items</div>
  );
};

export const SelectBase: React.FC<ISelectBaseProps> = ({
  className,
  classNameSelect,
  label,
  value,
  options = [],
  error,
  helperText,
  isMulti = false,
  dropdownWidthAuto = true,
  withHintAllocatedSpace,
  isSearchable = true,
  isCreatable = false,
  isLoading,
  isDisabled,
  onChange,
  ...restProps
}) => {
  const currentValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((item) => options.find((option) => option.value === item));
    }

    return value ? options.find((option) => option.value === value) : null;
  }, [value, options]);

  const handleChange = useCallback((optionValue: any) => {
    if (Array.isArray(optionValue)) {
      const preparedOptionValue = optionValue.map((item) => item.value);

      onChange(preparedOptionValue);
    } else {
      onChange(optionValue ? optionValue.value : optionValue);
    }
  }, [onChange]);

  const SelectComponent: typeof React.Component = isCreatable ? CreatableSelect : ReactSelect;

  return (
    <div
      className={
        classNames(
          'select',
          { 'select--helper-message': helperText },
          { 'select--error': error },
          className,
        )
      }
    >
      { label && (
        <div className="select__label">{ label }</div>
      ) }
      <SelectComponent
        {...restProps}
        styles={customStyles}
        className={classNames(
          'select__body',
          { 'select__body--dropdown-width-auto': dropdownWidthAuto },
          classNameSelect,
        )}
        classNamePrefix="select"
        options={options}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        isSearchable={isSearchable}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        value={currentValue}
        menuPortalTarget={document.body}
        components={{
          DropdownIndicator, MultiValue, MenuList,
        }}
        // @ts-ignore
        onChange={handleChange}
      />
      { (withHintAllocatedSpace || error || helperText) && <div className="select__helper-message">{ error || helperText }</div> }
    </div>
  );
};
