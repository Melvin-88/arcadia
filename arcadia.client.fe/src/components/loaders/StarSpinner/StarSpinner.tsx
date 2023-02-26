import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, IStarSpinnerStyleProps, IStarSpinnerStyles,
} from './styles/StarSpinner';

export interface IStarSpinnerProps {
  styles?: IStyleFunctionOrObject<IStarSpinnerStyleProps, IStarSpinnerStyles>;
  className?: string;
  e2eSelector?: string;
}

const StarSpinnerBase: React.FC<IStarSpinnerProps> = ({ styles, className, e2eSelector = 'spinner' }) => {
  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root} data-e2e-selector={e2eSelector}>
      <svg className={classNames.star}>
        <polygon
          points="29.8 0.3 22.8 21.8 0 21.8 18.5 35.2 11.5 56.7 29.8 43.4 48.2 56.7 41.2 35.1 59.6 21.8 36.8 21.8 "
        />
      </svg>
      <div className={classNames.circles} />
    </div>
  );
};

export const StarSpinner = styled<IStarSpinnerProps, IStarSpinnerStyleProps, IStarSpinnerStyles>(
  StarSpinnerBase,
  getStyles,
);
