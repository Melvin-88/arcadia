import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, Variant } from 'framer-motion';
import { toast } from 'react-toastify';
import { sessionSelector } from '../../selectors';
import { Card } from '../../../../components/Card/Card';
import { CloseButton } from '../../../../components/CloseButton/CloseButton';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { PrimaryButton } from '../../../../components/PrimaryButton/PrimaryButton';
import { Ribbon } from '../../../../components/Ribbon/Ribbon';
import { Time } from '../../../../styles/constants';
import slotMachine from '../../../../assets/images/slotMachine.png';
import { IShortestQueueProposal } from '../../types';
import { setShortestQueueProposal, useShortestQueueProposal } from '../../actions';
import {
  getClassNames,
  getStyles,
  IShortestQueueProposalStyleProps,
  IShortestQueueProposalStyles,
} from './styles/ShortestQueueProposal';

enum AnimationKeys {
  isVisible = 'isVisible',
  isHidden = 'isHidden',
}

const animationVariants: { [key in AnimationKeys]: Variant } = {
  [AnimationKeys.isVisible]: { x: 0, visibility: 'visible' },
  [AnimationKeys.isHidden]: { x: '100%', visibility: 'hidden' },
};

const transition = { ease: 'linear', duration: Time.defaultAnimationTime };

export interface IShortestQueueProposalProps {
  styles?: IStyleFunctionOrObject<IShortestQueueProposalStyleProps, IShortestQueueProposalStyles>;
  shortestQueueProposal: IShortestQueueProposal | null;
}

const ShortestQueueProposalBase: React.FC<IShortestQueueProposalProps> = ({
  styles,
  shortestQueueProposal,
}) => {
  const { t } = useTranslation();

  const { groupColor } = useSelector(sessionSelector);

  const dispatch = useDispatch();

  const { machineName, queuePosition } = shortestQueueProposal || {};

  const handlePlayClick = useCallback(() => {
    dispatch(useShortestQueueProposal());
    toast(t('ShortestQueueProposal.AcceptNotification'));
    dispatch(setShortestQueueProposal(null));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(setShortestQueueProposal(null));
  }, []);

  const classNames = getClassNames(styles);

  return (
    <AnimatePresence>
      {shortestQueueProposal !== null && (
        <motion.div
          className={classNames.root}
          variants={animationVariants}
          initial={AnimationKeys.isHidden}
          animate={AnimationKeys.isVisible}
          exit={AnimationKeys.isHidden}
          transition={transition}
        >
          <Card className={classNames.card}>
            <img src={slotMachine} className={classNames.machineImg} alt="machine" />
            <Ribbon
              className={classNames.ribbon}
              color={groupColor}
            >
              {machineName}
            </Ribbon>

            <div className={classNames.playImmediately}>{t('ShortestQueueProposal.PlayImmediately')}</div>

            <div className={classNames.queueInfoText}>
              {t('ShortestQueueProposal.PositionInQueue', { queueLength: queuePosition })}
            </div>
            <PrimaryButton className={classNames.playBtn} onClick={handlePlayClick}>
              <TextFit>{t('ShortestQueueProposal.ShortestQueue')}</TextFit>
            </PrimaryButton>
            <CloseButton className={classNames.closeBtn} onClick={handleClose} />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default styled<IShortestQueueProposalProps, IShortestQueueProposalStyleProps, IShortestQueueProposalStyles>(
  ShortestQueueProposalBase,
  getStyles,
);
