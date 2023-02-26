import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import { queueSelector } from '../../queue/selectors';
import { appStateSelector, sessionSelector, soundsConfigSelector } from '../../app/selectors';
import { gameSelector } from '../state/selectors';
import { usePrevious } from '../../../hooks/usePrevious';
import { VideoStream } from '../../../components/VideoStream/VideoStream';
import { ResultDialog } from './ResultDialog/ResultDialog';
import { BuySnackbar } from '../../buy/components/BuySnackbar';
import { AutoplaySetupSnackbar } from '../../autoplay/components/AutoplaySetupSnackbar';
import { BetBehindSnackbar } from '../../betBehind/components/BetBehindSnackbar/BetBehindSnackbar';
import { ChangeBetSnackbar } from '../../changeBet/components/ChangeBetSnackbar';
import { CancelStacksConfirmDialog } from '../../../components/CancelStacksConfirmDialog/CancelStacksConfirmDialog';
import { Header } from '../../../components/Header/Header';
import {
  IdleTimeoutIndicator,
  IIdleTimeoutIndicatorProps,
} from '../../../components/IdleTimeoutIndicator/IdleTimeoutIndicator';
import { QueueBar } from '../../queue/components/QueueBar/QueueBar';
import { RoundProgressIndicator } from '../../../components/RoundProgressIndicator/RoundProgressIndicator';
import { ChipsBar } from '../../../components/ChipsBar/ChipsBar';
import { ControlPanel } from '../../../components/ControlPanel/ControlPanel';
import { GameFooter } from '../../../components/GameFooter/GameFooter';
import { jackpotSelector } from '../../jackpot/state/selectors';
import { QueueLeaveConfirmDialog } from '../../queue/components/QueueLeaveConfirmDialog/QueueLeaveConfirmDialog';
import { autoplaySelector } from '../../autoplay/state/selectors';
import { ControlPanelState } from '../../../components/ControlPanel/constants';
import {
  mergePhantomChipWinQueueItem,
  removePhantomChipWinQueueItem,
  setCancelStacksDialog,
  setIdleTimeoutStartTimestamp,
} from '../state/actions';
import { FortuneWheel } from '../../../components/FortuneWheel/FortuneWheel';
import { SlotMachine } from '../../../components/SlotMachine/SlotMachine';
import { PhantomWidgetType, SessionStatus } from '../../../types/session';
import {
  isAutoplaySessionStatus, isBetBehindSessionStatus, isPlayingSessionStatus,
} from '../../../services/general';
import { ChipWin } from '../../../components/ChipWin/ChipWin';
import { BetBehindRoundProgressIndicator } from '../../../components/BetBehindRoundProgressIndicator/BetBehindRoundProgressIndicator';
import { IPhantomChipWin } from '../types';
import { PHANTOM_CHIP_SCATTER_ROUND_VALUE } from '../../../constants';
import { mergeOverlay } from '../../overlay/state/actions';
import { setRounds } from '../../app/actions';
import { RoundType } from '../../../types/round';
import { ScatterRoundProgressIndicator } from '../../../components/ScatterRoundProgressIndicator/ScatterRoundProgressIndicator';
import { getRoundsProgressIndicatorCoins } from './helpers';
import {
  ChipWinAnimationKeys,
  chipWinAnimationVariants,
  getClassNames,
  getStyles,
  IGameStyleProps,
  IGameStyles,
} from './styles/Game.styles';

interface IGameProps extends RouteComponentProps<{ roomId: string }>, Partial<IGameStyleProps> {
  styles?: IStyleFunctionOrObject<IGameStyleProps, IGameStyles>;
}

const GameBase: React.FC<IGameProps> = ({ styles }) => {
  const { t } = useTranslation();

  const phantomWidgetSpinningCompleteTimeoutRef = useRef<number | undefined>();

  const dispatch = useDispatch();
  const { queueToken } = useSelector(appStateSelector);
  const { isAllSoundsMuted, isMachineSoundsMuted, machineSoundsVolume } = useSelector(soundsConfigSelector);
  const { queue, viewers } = useSelector(queueSelector);
  const { config: autoplayConfig } = useSelector(autoplaySelector);
  const { activeGameId } = useSelector(jackpotSelector);

  const {
    stackSize,
    sessionId,
    stackBuyLimit,
    streamAuthToken,
    videoServiceEnv,
    video,
    machineId,
    rounds,
    currency,
    payTable,
    idleTimeoutSec,
    graceTimeoutSec,
    phantomWidgetAnimationDurationMS,
    betInCash,
    groupName,
    sessionStatus,
    wheel,
    slotConfig,
    scatterType: phantomWidgetType,
    groupColor,
  } = useSelector(sessionSelector);
  const {
    activeRound, idleTimeoutStartTimestamp, coins, balance, totalWin, isDetectingDroppedChips, chipWinQueue, phantomChipWinQueue,
  } = useSelector(gameSelector);

  const previousTotalWin = usePrevious(totalWin) || 0;

  const [isFortuneWheelPointerVisible, setIsFortuneWheelPointerVisible] = useState(false);
  const [isFortuneWheelWinHighlighted, setIsFortuneWheelWinHighlighted] = useState(false);

  const preprocessedTotalWin = useMemo(() => {
    const phantomChipsQueueTotalWinSubtract = phantomChipWinQueue.reduce((accumulator, item) => (
      accumulator + (item.isSubtractedFromTotalWin ? Math.max(item.value, 0) : 0)
    ), 0);

    return Math.max(totalWin - phantomChipsQueueTotalWinSubtract, previousTotalWin);
  }, [totalWin, phantomChipWinQueue]);

  const { tiltMode } = autoplayConfig;

  const isAutoplayEnabled = isAutoplaySessionStatus(sessionStatus);

  const isPlaying = isPlayingSessionStatus(sessionStatus);
  const isBetBehindSession = isBetBehindSessionStatus(sessionStatus);
  let controlPanelState = ControlPanelState.viewing;

  if (isPlaying) {
    controlPanelState = ControlPanelState.playing;
  } else if (sessionStatus === SessionStatus.viewerBetBehind) {
    controlPanelState = ControlPanelState.viewingBetBehind;
  } else if (sessionStatus === SessionStatus.queueBetBehind) {
    controlPanelState = ControlPanelState.inQueueBetBehind;
  } else if (sessionStatus === SessionStatus.queue) {
    controlPanelState = ControlPanelState.inQueue;
  }

  const timerData = useMemo<Omit<IIdleTimeoutIndicatorProps, 'styles'> | null>(() => {
    if (!idleTimeoutSec && !graceTimeoutSec) {
      return null;
    }

    let graceTimeoutMessage = t('Game.Timer.LetsPlay');

    if (sessionStatus === SessionStatus.playing) {
      graceTimeoutMessage = t('Game.Timer.LastCoin');
    } else if (sessionStatus === SessionStatus.reBuy) {
      graceTimeoutMessage = t('Game.Timer.SecondsLeftToRebuy', { graceTimeoutSec });
    }

    return {
      idleTimeoutSec,
      graceTimeoutSec,
      idleTimeoutStartTimestamp,
      onGraceTimeoutStart: () => toast.warn(graceTimeoutMessage, { autoClose: 3000 }),
      onTimeOver: () => dispatch(setIdleTimeoutStartTimestamp({ timestamp: null })),
    };
  }, [sessionStatus, idleTimeoutSec, graceTimeoutSec, idleTimeoutStartTimestamp]);

  const handleFortuneWheelSpinningStart = useCallback(() => {
    setIsFortuneWheelPointerVisible(true);
  }, [setIsFortuneWheelPointerVisible]);

  const handlePhantomWidgetSpinningComplete = useCallback(({ id, value }: IPhantomChipWin) => {
    setIsFortuneWheelWinHighlighted(true);

    phantomWidgetSpinningCompleteTimeoutRef.current = window.setTimeout(() => {
      if (value === PHANTOM_CHIP_SCATTER_ROUND_VALUE) {
        dispatch(mergeOverlay({ isScatterRoundWonVisible: true }));
      } else {
        dispatch(mergePhantomChipWinQueueItem({
          id,
          data: {
            isSubtractedFromTotalWin: false,
          },
        }));
      }
    }, phantomWidgetAnimationDurationMS / 9);
  }, [setIsFortuneWheelWinHighlighted]);

  const handlePhantomWidgetRefreshStart = useCallback(() => {
    setIsFortuneWheelPointerVisible(false);
    setIsFortuneWheelWinHighlighted(false);
  }, [setIsFortuneWheelPointerVisible, setIsFortuneWheelWinHighlighted]);

  const handlePhantomWidgetAnimationComplete = useCallback(({ id, value }: IPhantomChipWin) => {
    dispatch(removePhantomChipWinQueueItem({ id }));

    if (value === PHANTOM_CHIP_SCATTER_ROUND_VALUE) {
      // TODO: Extra round counter increasing to the saga after demo
      dispatch(setRounds({ rounds: rounds + 1 }));
    }
  }, [rounds]);

  const handleCancelStacksClick = useCallback(() => {
    dispatch(setCancelStacksDialog({ isOpen: true }));
  }, []);

  const firstPhantomWinQueueItem = phantomChipWinQueue[0] || null;

  const classNames = getClassNames(styles, {
    activeRoundType: activeRound?.type,
    isBetBehindSession,
    isFortuneWheelActive: !!firstPhantomWinQueueItem,
    phantomWidgetTransitionDurationMS: phantomWidgetAnimationDurationMS / 15,
  });

  const renderPhantomWidget = useCallback(() => {
    const defaultWidgetProps = {
      currency,
      values: wheel,
      winData: firstPhantomWinQueueItem,
      animationTimeMS: phantomWidgetAnimationDurationMS,
      onSpinningComplete: handlePhantomWidgetSpinningComplete,
      onRefreshStart: handlePhantomWidgetRefreshStart,
      onAnimationComplete: handlePhantomWidgetAnimationComplete,
    };

    switch (phantomWidgetType) {
      case PhantomWidgetType.wheel:
        return (
          <FortuneWheel
            {...defaultWidgetProps}
            className={classNames.fortuneWheel}
            onSpinningStart={handleFortuneWheelSpinningStart}
          />
        );
      case PhantomWidgetType.slot:
        return (
          <SlotMachine
            {...defaultWidgetProps}
            className={classNames.slotMachine}
            slotConfig={slotConfig}
          />
        );
      default:
        return null;
    }
  }, [
    wheel,
    slotConfig,
    firstPhantomWinQueueItem,
    handleFortuneWheelSpinningStart,
    handlePhantomWidgetSpinningComplete,
    handlePhantomWidgetRefreshStart,
    handlePhantomWidgetAnimationComplete,
  ]);

  useEffect(() => () => {
    clearTimeout(phantomWidgetSpinningCompleteTimeoutRef.current);
  }, []);

  return (
    <div className={classNames.root}>
      <Header
        className={classNames.header}
        machineId={machineId}
        groupName={groupName}
        color={groupColor}
        currency={currency}
        isWithJackpot={!!activeGameId}
        isFortuneWheelPointerVisible={isFortuneWheelPointerVisible}
        isFortuneWheelPointerHighlighting={isFortuneWheelWinHighlighted}
      />
      <div className={classNames.container}>
        <div className={classNames.videoContainer}>
          { video && (
            <VideoStream
              sessionStatus={sessionStatus}
              className={classNames.videoStream}
              authToken={streamAuthToken}
              serviceEnv={videoServiceEnv}
              wss={video.serverUrl}
              rtsp={video.highQualityRTSP}
              hlsStreamSrc={video.hlsUrlHighQuality}
              volume={isAllSoundsMuted || isMachineSoundsMuted ? 0 : machineSoundsVolume}
            />
          ) }
          <div className={classNames.gameInfoLeft}>
            { timerData && (
              <IdleTimeoutIndicator
                {...timerData}
                className={classNames.timerIndicator}
              />
            ) }
            <QueueBar
              className={classNames.queueBar}
              isPlaying={isPlaying}
              currentUserQueueToken={queueToken}
              queue={queue}
              viewersCount={viewers}
            />
          </div>
          <div className={classNames.gameInfoRight}>
            <div className={classNames.roundProgressIndicatorContainer}>
              <RoundProgressIndicator
                className={classNames.roundProgressIndicator}
                rounds={rounds}
                coins={getRoundsProgressIndicatorCoins({
                  sessionStatus,
                  activeRound,
                  stackSize,
                  coins,
                })}
                stackSize={stackSize}
                isPlaying={isPlaying}
                onCancelStacksClick={handleCancelStacksClick}
              />
              { isBetBehindSession && (
                <BetBehindRoundProgressIndicator
                  className={classNames.secondaryRoundProgressIndicator}
                  coins={activeRound?.type === RoundType.betBehind ? coins : 0}
                  stackSize={stackSize}
                />
              ) }
              { activeRound?.type === RoundType.scatter && (
                <ScatterRoundProgressIndicator
                  className={classNames.secondaryRoundProgressIndicator}
                  coins={coins}
                  stackSize={stackSize}
                />
              ) }
            </div>
            { !!payTable.length && (
              <div className={classNames.chipsBarWrapper}>
                <ChipsBar
                  className={classNames.chipsBar}
                  payTable={payTable}
                  currency={currency}
                />
              </div>
            ) }
          </div>
          <AnimatePresence>
            { isDetectingDroppedChips && (
              <motion.div
                key="chipDetector"
                className={classNames.chipWin}
                variants={chipWinAnimationVariants}
                initial={ChipWinAnimationKeys.initial}
                animate={ChipWinAnimationKeys.fadeIn}
                exit={ChipWinAnimationKeys.chipDetectionExit}
              >
                <ChipWin currency={currency} />
              </motion.div>
            ) }
            { chipWinQueue.map(({ id, ...chip }) => (
              <motion.div
                key={id}
                className={classNames.chipWin}
                variants={chipWinAnimationVariants}
                initial={ChipWinAnimationKeys.initial}
                animate={ChipWinAnimationKeys.fadeIn}
                exit={ChipWinAnimationKeys.exit}
              >
                <ChipWin chip={chip} currency={currency} />
              </motion.div>
            )) }
          </AnimatePresence>
        </div>
        {renderPhantomWidget()}
        <ControlPanel
          className={classNames.controlPanel}
          controlPanelState={controlPanelState}
          currency={currency}
          sessionId={sessionId}
          isAutoplayEnabled={isAutoplayEnabled}
          tiltMode={tiltMode}
          totalWin={preprocessedTotalWin}
        />
        <GameFooter balance={balance} bet={betInCash} currency={currency} />
      </div>

      <BuySnackbar
        stackSize={stackSize}
        betInCash={betInCash}
        currency={currency}
        stackBuyLimit={stackBuyLimit}
        isReBuyFlow={sessionStatus === SessionStatus.reBuy}
      />
      <AutoplaySetupSnackbar
        betInCash={betInCash}
        currency={currency}
        isPlayDisabled={sessionStatus !== SessionStatus.playing}
      />
      <BetBehindSnackbar
        betInCash={betInCash}
        currency={currency}
      />
      <ChangeBetSnackbar />
      { sessionStatus === SessionStatus.queue && <QueueLeaveConfirmDialog /> }
      { isPlaying && <CancelStacksConfirmDialog /> }
      <ResultDialog />
    </div>
  );
};

export default styled<IGameProps, IGameStyleProps, IGameStyles>(
  GameBase,
  getStyles,
);
