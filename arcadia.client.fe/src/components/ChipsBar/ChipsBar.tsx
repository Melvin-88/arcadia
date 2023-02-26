import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { Chip } from '../Chip/Chip';
import { formatCurrency } from '../../services/dataFormat';
import { IChips } from '../../types/chip';
import { TextFit } from '../TextFit/TextFit';
import { PHANTOM_CHIP_TYPE } from '../../constants';
import { Collapsible } from '../Collapsible/Collapsible';
import chipBarCollapseImage from '../../assets/images/chips/phantom.png';
import {
  getClassNames, getStyles, IChipsBarStyleProps, IChipsBarStyles,
} from './styles/ChipsBar';

export interface IChipsBarProps extends Partial<IChipsBarStyleProps> {
  styles?: IStyleFunctionOrObject<IChipsBarStyleProps, IChipsBarStyles>;
  payTable: IChips;
  currency: string;
}

const ChipsBarBase: React.FC<IChipsBarProps> = ({
  styles,
  className,
  payTable,
  currency,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <Collapsible collapseImage={chipBarCollapseImage}>
      <div className={classNames.root}>
        { payTable.map((chip) => {
          const isPhantomChip = chip.type === PHANTOM_CHIP_TYPE;

          return (
            <div
              key={chip.type + chip.iconId + chip.currencyValue}
              className={classNames.chipItem}
            >
              <Chip
                className={isPhantomChip ? classNames.chipPhantomIcon : classNames.chipIcon}
                chip={chip}
              />
              { isPhantomChip ? (
                <TextFit
                  className={isPhantomChip ? classNames.chipPhantomValue : classNames.chipValue}
                  mode="multi"
                >
                  <div>
                    {t('ChipsBar.PhantomChip')}
                  </div>
                </TextFit>
              ) : (
                <TextFit
                  className={classNames.chipValue}
                  mode="single"
                  forceSingleModeWidth={false}
                >
                  <div>
                    { formatCurrency(chip.currencyValue, { currency, minimumFractionDigits: 0 }) }
                  </div>
                </TextFit>
              ) }
            </div>
          );
        }) }
      </div>
    </Collapsible>
  );
};

export const ChipsBar = React.memo(
  styled<
    IChipsBarProps,
    IChipsBarStyleProps,
    IChipsBarStyles
  >(
    ChipsBarBase,
    getStyles,
  ),
);
