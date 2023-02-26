import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import BuyConfirmBase from '../../../../assets/svg/buyConfirmButtonBase.svg';
import imgCoins from '../../../../assets/images/coinsBuyConfirmButton.png';
import imgBuy from '../../../../assets/images/buyConfirm.png';
import { formatCurrency } from '../../../../services/dataFormat';
import { Button } from '../../../../components/Button/Button';
import { TextFit } from '../../../../components/TextFit/TextFit';
import {
  getClassNames, IBuyConfirmButtonStyleProps, IBuyConfirmButtonStyles, getStyles,
} from './styles/BuyConfirmButton';

export interface IBuyConfirmButtonProps extends Partial<IBuyConfirmButtonStyleProps> {
  styles?: IStyleFunctionOrObject<IBuyConfirmButtonStyleProps, IBuyConfirmButtonStyles>;
  coins: number;
  price: number;
  currency: string;
  onClick: () => void;
}

const BuyConfirmButtonBase: React.FC<IBuyConfirmButtonProps> = ({
  styles, className, coins, currency, price, onClick,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <BuyConfirmBase className={classNames.rootImg} />
      <div className={classNames.content}>
        <div className={classNames.info}>
          <div className={classNames.coins}>
            { t('BuyConfirmButton.Coins', { coins, count: coins }) }
            <img
              className={classNames.coinsIcon}
              src={imgCoins}
              alt=""
            />
          </div>
          <div className={classNames.total}>
            {t('BuyConfirmButton.TotalAmount')}
          </div>
          <div className={classNames.price}>
            { formatCurrency(price, { currency, minimumFractionDigits: 0 }) }
          </div>
        </div>
        <Button
          className={classNames.buyBtn}
          classNameContent={classNames.buyBtnContent}
          normalImg={imgBuy}
          e2eSelector="buy-confirm-button"
          onClick={onClick}
        >
          <TextFit
            mode="single"
            forceSingleModeWidth={false}
          >
            {t('BuyConfirmButton.Buy')}
          </TextFit>
        </Button>
      </div>
    </div>
  );
};

export const BuyConfirmButton = React.memo(
  styled<
    IBuyConfirmButtonProps,
    IBuyConfirmButtonStyleProps,
    IBuyConfirmButtonStyles
  >(
    BuyConfirmButtonBase,
    getStyles,
  ),
);
