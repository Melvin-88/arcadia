import React, { InputHTMLAttributes, useCallback } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import MaskedInput, { maskArray } from 'react-text-mask';
import { preventNonDigitKeyEvents, preventPasswordKeyEvents } from '../../../services';
import './styles/TextFieldBase.scss';

export interface ITextFieldBaseProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  className?: string
  classNameInputContainer?: string
  classNameLabel?: string
  classNameInput?: string
  withHintAllocatedSpace?: boolean
  label?: string
  // TODO: Any should be replaced by more concrete type after first priority tasks. Any usage was caused by DateTimePickers
  inputRef?: any
  helperText?: string
  error?: string
  mask?: maskArray | ((value: string) => maskArray)
  guide?: boolean
  placeholderChar?: string
  keepCharPositions?: boolean
  pipe?: (
    conformedValue: string,
    config: any // Any has been used because MaskInput use it internally in the Props type
  ) => false | string | { value: string; indexesOfPipedChars: number[] }
  showMask?: boolean
  rows?: number
}

export const TextFieldBase: React.FC<ITextFieldBaseProps> = ({
  className,
  classNameLabel,
  classNameInputContainer,
  classNameInput,
  withHintAllocatedSpace,
  id,
  inputRef,
  value,
  type: originalType,
  label,
  error,
  disabled,
  mask,
  helperText,
  autoComplete = 'off',
  onKeyDown = () => {},
  rows,
  ...restProps
}) => {
  const inputId = id || uuidv4();
  const type = originalType === 'password' ? 'text' : originalType;

  const classes = classNames(
    'text-field',
    { 'text-field--disabled': disabled },
    { 'text-field--error': error },
    { 'text-field--password-secure': originalType === 'password' && !!value },
    className,
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === 'number') {
      preventNonDigitKeyEvents(event);
    }
    if (originalType === 'password') {
      preventPasswordKeyEvents(event);
    }

    onKeyDown(event);
  }, [type, originalType]);

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (originalType === 'password') {
      event.preventDefault();

      return false;
    }

    return event;
  }, [originalType]);

  const commonProps = {
    id: inputId,
    mask,
    className: classNames('text-field__input', classNameInput),
    type,
    value: value || value === 0 ? value : '',
    disabled,
    autoComplete,
    onKeyDown: handleKeyDown,
    onContextMenu: handleContextMenu,
    ref: inputRef,
    ...restProps,
  };

  const InputComponent = type === 'number' || !mask ? 'input' : MaskedInput;

  return (
    <div className={classes}>
      { label && (
        <label
          htmlFor={inputId}
          className={classNames('text-field__label', classNameLabel)}
        >
          {label}
        </label>
      ) }
      <div className={classNames('text-field__container', classNameInputContainer)}>
        { rows ? (
          <textarea
            {...commonProps}
            className={classNames('text-field__input', 'text-field--textarea', classNameInput)}
            rows={rows}
          />
        ) : (
          <InputComponent {...commonProps} />
        ) }
        { (withHintAllocatedSpace || error || helperText) && (
          <div className="text-field__helper-text">{error || helperText}</div>
        ) }
        { originalType === 'password' && (
          <span className="text-field__preload-password-font">`</span>
        ) }
      </div>
    </div>
  );
};
