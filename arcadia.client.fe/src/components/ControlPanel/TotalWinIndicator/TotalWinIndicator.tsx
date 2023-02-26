import React, { useEffect } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { motion, useAnimation } from 'framer-motion';
import imgTotalWinIndicatorBackground from '../../../assets/images/totalWin.png';
import { formatCurrency } from '../../../services/dataFormat';
import { TextFit } from '../../TextFit/TextFit';
import { usePrevious } from '../../../hooks/usePrevious';
import {
  getClassNames, getStyles, ITotalWinIndicatorStyleProps, ITotalWinIndicatorStyles,
} from './styles/TotalWinIndicator';

export interface ITotalWinIndicatorProps extends Partial<ITotalWinIndicatorStyleProps> {
  styles?: IStyleFunctionOrObject<ITotalWinIndicatorStyleProps, ITotalWinIndicatorStyles>;
  totalWin: number;
  currency: string;
}

const TotalWinBase: React.FC<ITotalWinIndicatorProps> = ({
  styles,
  className,
  totalWin,
  currency,
}) => {
  const animationControls = useAnimation();

  const previousTotalWin = usePrevious(totalWin) || 0;

  useEffect(() => {
    if (totalWin > previousTotalWin) {
      animationControls.start({
        scale: 1,
        transition: {
          type: 'spring',
          velocity: 25,
          stiffness: 180,
          damping: 80,
        },
      });
    }
  }, [animationControls, previousTotalWin, totalWin]);

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <img
        className={classNames.totalWinIndicatorBackground}
        src={imgTotalWinIndicatorBackground}
        alt=""
      />
      <TextFit
        className={classNames.totalWinIndicatorContent}
        forceSingleModeWidth={false}
        mode="single"
      >
        <motion.div animate={animationControls}>
          { formatCurrency(totalWin, { currency }) }
        </motion.div>
      </TextFit>
    </div>
  );
};

export const TotalWinIndicator = React.memo(
  styled<
    ITotalWinIndicatorProps,
    ITotalWinIndicatorStyleProps,
    ITotalWinIndicatorStyles
  >(
    TotalWinBase,
    getStyles,
  ),
);
