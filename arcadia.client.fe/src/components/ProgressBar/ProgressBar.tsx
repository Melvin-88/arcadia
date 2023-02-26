import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames,
  getStyles,
  IProgressBarStyleProps,
  IProgressBarStyles,
} from './styles/ProgressBar';

export interface IProgressBarProps extends IProgressBarStyleProps {
  styles?: IStyleFunctionOrObject<IProgressBarStyleProps, IProgressBarStyles>;
}

const ProgressBarBase: React.FC<IProgressBarProps> = ({ styles, total, current }) => {
  const classNames = getClassNames(styles, { total, current });

  return (
    <div className={classNames.root}>
      <div className={classNames.bar} />
    </div>
  );
};

export const ProgressBar = styled<IProgressBarProps, IProgressBarStyleProps, IProgressBarStyles>(
  ProgressBarBase,
  getStyles,
);
