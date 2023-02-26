import React, { useCallback } from 'react';
import classNames from 'classnames';
import './styles/CheckboxBase.scss';

export interface ICheckboxBaseProps {
  className?: string
  value: boolean
  disabled?: boolean
  label?: string
  onChange?: (value: boolean, e: React.MouseEvent) => void
}

export const CheckboxBase: React.FC<ICheckboxBaseProps> = ({
  className,
  value,
  label,
  disabled = false,
  onChange = () => {},
}) => {
  const handleChange = useCallback((e) => {
    onChange(!value, e);
  }, [value, onChange]);

  return (
    <div
      className={classNames(
        'checkbox',
        { 'checkbox--checked': value },
        { 'checkbox--disabled': disabled },
        className,
      )}
      role="checkbox"
      aria-checked={value}
    >
      <div className="checkbox__container">
        { label && (
          <div
            className="checkbox__label"
            aria-label={`Toggle ${label}`}
            role="button"
            tabIndex={0}
            onClick={handleChange}
          >
            { label }
          </div>
        ) }
        <svg className="checkbox__checkmark-container" viewBox="0 0 20 20" onClick={handleChange}>
          <path
            className="checkbox__checkmark-bottom-pad"
            d="M 0 2 A 2 2 0 0 1 2 0 L 18 0 A 2 2 0 0 1 20 2 L 20 18 A 2 2 0 0 1 18 20 L 2 20 A 2 2 0 0 1 0 18 Z"
          />
          <path
            className="checkbox__checkmark-top-pad"
            d="M 0 2 A 2 2 0 0 1 2 0 L 18 0 A 2 2 0 0 1 20 2 L 20 18 A 2 2 0 0 1 18 20 L 2 20 A 2 2 0 0 1 0 18 Z"
          />
          <polyline className="checkbox__checkmark" points="4 11 8 15 16 6" />
        </svg>
      </div>
    </div>
  );
};
