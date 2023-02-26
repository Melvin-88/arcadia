import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';

import {
  getClassNames,
  getStyles,
  ICardStyleProps,
  ICardStyles,
} from './styles/Card';

export interface ICardProps extends Partial<ICardStyleProps> {
  styles?: IStyleFunctionOrObject<ICardStyleProps, ICardStyles>;
  onClick?: () => void;
}

const CardBase: React.FC<ICardProps> = ({
  styles, className, children, onClick,
}) => {
  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root} role="presentation" onClick={onClick}>
      { children }
    </div>
  );
};

export const Card = styled<ICardProps, ICardStyleProps, ICardStyles>(
  CardBase,
  getStyles,
);
