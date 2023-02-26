import React, { useEffect } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useAnimation, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ProgressIndicator, IProgressIndicatorProps } from '../ProgressIndicator/ProgressIndicator';
import { TextFit } from '../TextFit/TextFit';
import imgStacks from '../../assets/images/stacks.png';
import imgButtonRoundsReject from '../../assets/images/buttonRoundsReject.png';
import { Color } from '../../styles/constants';
import { usePrevious } from '../../hooks/usePrevious';
import { Button } from '../Button/Button';
import {
  getClassNames, getStyles, IRoundProgressIndicatorStyleProps, IRoundProgressIndicatorStyles,
} from './styles/RoundProgressIndicator';

export interface IRoundProgressIndicatorProps extends Omit<IProgressIndicatorProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IRoundProgressIndicatorStyleProps, IRoundProgressIndicatorStyles>;
  rounds: number;
  coins: number | null;
  stackSize: number;
  isPlaying: boolean;
  onCancelStacksClick?: () => void;
}

const RoundProgressIndicatorBase: React.FC<IRoundProgressIndicatorProps> = ({
  styles,
  rounds,
  coins,
  stackSize,
  isPlaying,
  onCancelStacksClick: cancelStacks,
  ...restProps
}) => {
  const { t } = useTranslation();
  const animationControls = useAnimation();
  const previousRounds = usePrevious(rounds) || 0;

  const isEmptyState = (!rounds && !coins) || coins === null;

  useEffect(() => {
    if (rounds > previousRounds) {
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
  }, [animationControls, previousRounds, rounds]);

  const classNames = getClassNames(styles);

  return (
    <ProgressIndicator
      {...restProps}
      progress={isEmptyState ? 1 : (coins || 0) / stackSize}
      circleColor={isEmptyState ? Color.progressIndicator.emptyCircleColor : Color.roundProgressIndicator.circleColor}
    >
      <div className={classNames.root}>
        <img
          className={classNames.stacksImg}
          src={imgStacks}
          alt=""
        />
        <TextFit
          className={classNames.rounds}
          mode="single"
          forceSingleModeWidth={false}
        >
          <motion.div animate={animationControls}>
            { `x${rounds}` }
          </motion.div>
        </TextFit>

        { !isPlaying || rounds === 0 ? (
          <TextFit
            className={classNames.yourStacks}
            mode="multi"
            forceSingleModeWidth={false}
          >
            {t('RoundProgressIndicator.YourStacks')}
          </TextFit>
        ) : (
          <Button
            className={classNames.rejectButton}
            normalImg={imgButtonRoundsReject}
            onClick={cancelStacks}
          />
        ) }
      </div>
    </ProgressIndicator>
  );
};

export const RoundProgressIndicator = React.memo(
  styled<
    IRoundProgressIndicatorProps,
    IRoundProgressIndicatorStyleProps,
    IRoundProgressIndicatorStyles
  >(
    RoundProgressIndicatorBase,
    getStyles,
  ),
);
