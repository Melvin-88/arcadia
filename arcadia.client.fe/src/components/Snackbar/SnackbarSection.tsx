import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, ISnackbarSectionStyleProps, ISnackbarSectionStyles, getStyles,
} from './styles/SnackbarSection';

export interface ISnackbarSectionProps extends Partial<ISnackbarSectionStyleProps> {
  styles?: IStyleFunctionOrObject<ISnackbarSectionStyleProps, ISnackbarSectionStyles>;
  children: React.ReactNode;
}

const SnackbarSectionBase: React.FC<ISnackbarSectionProps> = ({ styles, className, children }) => {
  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      { children }
    </div>
  );
};

export const SnackbarSection = React.memo(
  styled<
    ISnackbarSectionProps,
    ISnackbarSectionStyleProps,
    ISnackbarSectionStyles
  >(
    SnackbarSectionBase,
    getStyles,
  ),
);
