import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, ISpinnerStyleProps, ISpinnerStyles,
} from './styles/Spinner';

export interface ISpinnerProps extends Partial<ISpinnerStyleProps> {
  styles?: IStyleFunctionOrObject<ISpinnerStyleProps, ISpinnerStyles>;
}

const SpinnerBase: React.FC<ISpinnerProps> = ({ styles }) => {
  const classNames = getClassNames(styles);

  return (
    <svg
      className={classNames.spinner}
      viewBox="0 0 48 48"
    >
      <path className={classNames.spinnerItem} d="M37.263 13.435a1.643 1.643 0 1 0 0-3.285 1.643 1.643 0 0 0 0 3.285z" />
      <path className={classNames.spinnerItem} d="M42.83 27.45a2.19 2.19 0 1 0 0-4.38 2.19 2.19 0 0 0 0 4.38z" />
      <path className={classNames.spinnerItem} d="M37.26 41.46a2.74 2.74 0 1 0 0-5.48 2.74 2.74 0 0 0 0 5.48z" />
      <path className={classNames.spinnerItem} d="M23.797 47.584a3.287 3.287 0 1 0 0-6.574 3.287 3.287 0 0 0 0 6.574z" />
      <path
        className={classNames.spinnerItem}
        d="M7.624 36.01a3.832 3.832 0 0 0 0 5.423 3.832 3.832 0 0 0 5.422 0 3.832 3.832 0 0 0 0-5.422 3.816 3.816 0 0 0-5.422 0z"
      />
      <path className={classNames.spinnerItem} d="M4.752 29.644a4.382 4.382 0 1 0 0-8.764 4.382 4.382 0 0 0 0 8.764z" />
      <path className={classNames.spinnerItem} d="M10.332 16.723a4.932 4.932 0 1 0 0-9.863 4.932 4.932 0 0 0 0 9.863z" />
      <path className={classNames.spinnerItem} d="M23.8 11.698A5.48 5.48 0 1 0 23.8.74a5.48 5.48 0 0 0 0 10.958z" />
    </svg>
  );
};

export const Spinner = styled<ISpinnerProps, ISpinnerStyleProps, ISpinnerStyles>(
  SpinnerBase,
  getStyles,
);
