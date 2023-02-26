import React, { AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Spinner } from '../loaders/Spinner/Spinner';
import './styles/Button.scss';

type ButtonVariantUnion = 'filled' | 'outline';
export type ButtonColorUnion = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';

export const ButtonVariant : { [key in ButtonVariantUnion] : ButtonVariantUnion } = {
  filled: 'filled',
  outline: 'outline',
};

export const ButtonColor : { [key in ButtonColorUnion] : ButtonColorUnion } = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  quaternary: 'quaternary',
  quinary: 'quinary',
};

export interface IButtonProps extends AnchorHTMLAttributes<HTMLElement> {
  className?: string
  variant?: ButtonVariantUnion
  color?: ButtonColorUnion
  type?: 'submit' | 'button'
  fullWidth?: boolean
  isLoading?: boolean
  disabled?: boolean
  nativeLink?: boolean
  to?: string
}

export const Button: React.FC<IButtonProps> = ({
  className,
  variant = ButtonVariant.filled,
  color = ButtonColor.primary,
  type = 'button',
  fullWidth,
  isLoading,
  disabled,
  to,
  nativeLink,
  children,
  ...restProps
}) => {
  const generalProps = {
    ...restProps,
    className: classNames(
      `btn btn--${color}-${variant}`,
      {
        'btn--full-width': fullWidth,
        'btn--disabled': disabled || isLoading,
        'btn--is-loading': isLoading,
      },
      className,
    ),
  };

  const content = (
    <>
      { children }
      { isLoading && (
        <Spinner className="btn__spinner" />
      ) }
    </>
  );

  if (to) {
    if (nativeLink) {
      return (
        <a {...generalProps} href={to}>
          { content }
        </a>
      );
    }

    return (
      <Link {...generalProps} to={to}>
        { content }
      </Link>
    );
  }

  return (
    <button
      {...generalProps}
      type={type}
      disabled={disabled || isLoading}
    >
      { content }
    </button>
  );
};
