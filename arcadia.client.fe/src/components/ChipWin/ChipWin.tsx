import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Time } from '../../styles/constants';
import { IChip } from '../../types/chip';
import imgChipNotIdentified from '../../assets/images/chips/notIdentified.png';
import ChipLoader from '../../assets/svg/chipLoader.svg';
import { Chip } from '../Chip/Chip';
import { TextFit } from '../TextFit/TextFit';
import { formatCurrency } from '../../services/dataFormat';
import { PHANTOM_CHIP_TYPE } from '../../constants';
import {
  getClassNames, getStyles, IChipWinStyleProps, IChipWinStyles,
} from './styles/ChipWin';

export interface IChipWinProps extends Partial<IChipWinStyleProps> {
  styles?: IStyleFunctionOrObject<IChipWinStyleProps, IChipWinStyles>;
  chip?: IChip;
  currency: string;
}

const ChipWinBase: React.FC<IChipWinProps> = ({
  styles,
  className,
  chip,
  currency,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <div className={classNames.chipItem}>
        { chip ? (
          <Chip chip={chip} />
        ) : (
          <>
            <img
              className={classNames.chipNotIdentifiedIcon}
              src={imgChipNotIdentified}
              alt=""
            />
            <motion.div
              className={classNames.chipLoader}
              animate={{ rotate: 360 }}
              transition={{
                duration: Time.spinnerAnimationTime,
                ease: 'linear',
                loop: Infinity,
              }}
            >
              <ChipLoader />
            </motion.div>
          </>
        ) }
      </div>
      <div className={classNames.container}>
        { chip ? (
          <>
            <TextFit
              className={classNames.winLabel}
              mode="single"
              forceSingleModeWidth={false}
            >
              {t('ChipWin.YouWon')}
            </TextFit>
            <TextFit
              className={classNames.value}
              mode="single"
              forceSingleModeWidth={false}
            >
              {
                chip.type === PHANTOM_CHIP_TYPE
                  ? t('ChipWin.Phantom')
                  : formatCurrency(chip.currencyValue, { currency, minimumFractionDigits: 0 })
              }
            </TextFit>
          </>
        ) : (
          <TextFit
            className={classNames.identifyingLabel}
            mode="single"
            forceSingleModeWidth={false}
          >
            {t('ChipWin.Identifying')}
          </TextFit>
        ) }
      </div>
    </div>
  );
};

export const ChipWin = styled<IChipWinProps, IChipWinStyleProps, IChipWinStyles>(
  ChipWinBase,
  getStyles,
);
