import React from 'react';
import { styled, IStyleFunctionOrObject } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../services/dataFormat';
import {
  getClassNames, IGameFooterStyleProps, IGameFooterStyles, getStyles,
} from './styles/GameFooter';

export interface IGameFooterProps extends Partial<IGameFooterStyleProps> {
  styles?: IStyleFunctionOrObject<IGameFooterStyleProps, IGameFooterStyles>;
  currency: string;
  balance: number;
  bet: number;
}

const GameFooterBase: React.FC<IGameFooterProps> = ({
  styles, balance, bet, currency,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles);

  return (
    <div className={classNames.root}>
      <div>
        {`${t('GameFooter.Balance')} ${formatCurrency(balance, { currency })}`}
      </div>
      <div>
        {`${t('GameFooter.Bet')} ${formatCurrency(bet, { currency, minimumFractionDigits: 0 })}`}
      </div>
    </div>
  );
};

export const GameFooter = React.memo(
  styled<
    IGameFooterProps,
    IGameFooterStyleProps,
    IGameFooterStyles
  >(
    GameFooterBase,
    getStyles,
  ),
);
