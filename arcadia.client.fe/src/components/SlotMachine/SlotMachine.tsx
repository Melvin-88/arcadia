import React, { useEffect, useMemo } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { motion, useAnimation } from 'framer-motion';
import { usePrevious } from '../../hooks/usePrevious';
import { TextFit } from '../TextFit/TextFit';
import { PHANTOM_CHIP_SCATTER_ROUND_VALUE } from '../../constants';
import { formatCurrency } from '../../services/dataFormat';
import { SlotMachineSlotIcon, PhantomValue } from '../../types/phantomWidget';
import { SLOT_ITEMS_COUNT } from './constants';
import { preprocessData } from './helpers';
import { IPhantomChipWin } from '../../modules/game/types';
import imgSlotMachine from '../../assets/images/slotMachine/slotMachine.png';
import {
  ISlotMachineStyleProps, ISlotMachineStyles, getStyles, getClassNames,
} from './styles/SlotMachine';

export interface ISlotMachineProps extends Partial<ISlotMachineStyleProps> {
  styles?: IStyleFunctionOrObject<ISlotMachineStyleProps, ISlotMachineStyles>;
  currency: string;
  values: PhantomValue[];
  slotConfig: SlotMachineSlotIcon[];
  winData: IPhantomChipWin | null;
  animationTimeMS?: number;
  onSpinningStart?: (winData: IPhantomChipWin) => void;
  onSpinningComplete?: (winData: IPhantomChipWin) => void;
  onRefreshStart?: (winData: IPhantomChipWin) => void;
  onAnimationComplete?: (winData: IPhantomChipWin) => void;
}

const SlotMachineBase: React.FC<ISlotMachineProps> = ({
  styles,
  className,
  currency,
  values,
  slotConfig,
  winData,
  animationTimeMS = 4500,
  onSpinningStart = () => {},
  onSpinningComplete = () => {},
  onRefreshStart = () => {},
  onAnimationComplete = () => {},
}) => {
  const containerAnimationControls = useAnimation();
  const slotAnimationControls = useAnimation();
  const winAnimationControls = useAnimation();

  const previousWinData = usePrevious(winData);

  const { slots } = useMemo(() => (
    winData?.value
      ? preprocessData(values, slotConfig, winData?.value)
      : { slots: [] }
  ), [values, slotConfig, winData?.id]);

  const isRegularWin = winData?.value !== PHANTOM_CHIP_SCATTER_ROUND_VALUE;

  useEffect(() => {
    (async function animateSlots() {
      if (winData && previousWinData?.id !== winData?.id) {
        const animationTimeInSeconds = animationTimeMS / 1000;

        await slotAnimationControls.set({
          y: `-${(SLOT_ITEMS_COUNT - 1) * 100}%`,
        });
        await winAnimationControls.set({
          opacity: 0,
          scale: 0,
        });

        await containerAnimationControls.start({
          y: '80%',
          transition: {
            duration: animationTimeInSeconds * 0.1,
          },
        });

        onSpinningStart(winData);

        await slotAnimationControls.start({
          y: `-${(SLOT_ITEMS_COUNT / 2) * 100}%`,
          transition: {
            duration: animationTimeInSeconds * 0.14,
            ease: 'linear',
          },
        });

        await slotAnimationControls.start({
          y: '0%',
          transition: {
            duration: animationTimeInSeconds * 0.42,
            ease: 'easeOut',
          },
        });

        onSpinningComplete(winData);

        await slotAnimationControls.start({
          y: ['0%', '0%'],
          transition: {
            duration: animationTimeInSeconds * 0.1,
          },
        });

        await winAnimationControls.start({
          opacity: 1,
          scale: isRegularWin ? 1 : 0,
          transition: {
            duration: animationTimeInSeconds * 0.04,
          },
        });

        await slotAnimationControls.start({
          y: ['0%', '0%'],
          transition: {
            duration: animationTimeInSeconds * 0.1,
          },
        });

        onRefreshStart(winData);

        await containerAnimationControls.start({
          y: '-100%',
          transition: {
            duration: animationTimeInSeconds * 0.05,
          },
        });

        await containerAnimationControls.start({
          y: [null, '0%'],
          transition: {
            times: [0, 1],
            duration: animationTimeInSeconds * 0.05,
          },
        });

        await winAnimationControls.set({
          opacity: 0,
        });

        onAnimationComplete(winData);
      }
    }());
  }, [
    containerAnimationControls,
    slotAnimationControls,
    previousWinData,
    winData,
    animationTimeMS,
    onSpinningStart,
    onSpinningComplete,
    onRefreshStart,
    onAnimationComplete,
    isRegularWin,
  ]);

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <motion.div animate={containerAnimationControls}>
        <img
          className={classNames.slotMachineImg}
          src={imgSlotMachine}
          alt="slot machine"
        />
        {slots.map(({ id, items }, index) => (
          <div key={id} className={classNames.slot} style={{ left: `${index * 24.4 + 15.5}%` }}>
            <motion.div className={classNames.slotInner} animate={slotAnimationControls}>
              {items.map((item, idx) => {
                const isItemBlurry = idx !== SLOT_ITEMS_COUNT - 1 && idx > SLOT_ITEMS_COUNT * 0.3;

                return (
                  <div key={item.id} className={classNames.slotImgContainer}>
                    <img
                      className={`${classNames.slotImg} ${isItemBlurry ? classNames.blurImage : ''}`}
                      src={item.image}
                      alt=""
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        ))}
        {winData && isRegularWin && (
          <motion.div className={classNames.winLabelContainer} animate={winAnimationControls}>
            <TextFit className={classNames.winLabel}>
              {formatCurrency(winData.value, { currency })}
            </TextFit>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const SlotMachine = React.memo(styled<ISlotMachineProps, ISlotMachineStyleProps, ISlotMachineStyles>(
  SlotMachineBase,
  getStyles,
));
