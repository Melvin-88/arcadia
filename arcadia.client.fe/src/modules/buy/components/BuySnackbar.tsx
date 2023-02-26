import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Snackbar } from '../../../components/Snackbar/Snackbar';
import { Button } from '../../../components/Button/Button';
import { TextFit } from '../../../components/TextFit/TextFit';
import { BuyCounter } from './BuyCounter/BuyCounter';
import { BuyConfirmButton } from './BuyConfirmButton/BuyConfirmButton';
import imgStacks from '../../../assets/images/stacks.png';
import imgVoucher from '../../../assets/images/voucher.png';
import imgChangeBetBtn from '../../../assets/images/buySnackbarChangeBetButton.png';
import imgAutoplaySetupBtn from '../../../assets/images/buySnackbarAutoplaySetupButton.png';
import { formatCurrency } from '../../../services/dataFormat';
import { buySelector } from '../state/selectors';
import {
  buyRounds,
  mergeBuy,
  setBuy,
  getVoucher,
  setVoucher,
} from '../state/actions';
import { mergeAutoplay } from '../../autoplay/state/actions';
import { mergeChangeBet } from '../../changeBet/state/actions';
import { SoundsController } from '../../../services/sounds/controller';
import { ButtonSound } from '../../../services/sounds/types';
import {
  getClassNames, getStyles, IBuySnackbarStyleProps, IBuySnackbarStyles,
} from './styles/BuySnackbar';

export interface IBuySnackbarProps {
  styles?: IStyleFunctionOrObject<IBuySnackbarStyleProps, IBuySnackbarStyles>;
  currency: string;
  betInCash: number;
  stackSize: number;
  stackBuyLimit: number;
  isReBuyFlow?: boolean;
}

const BuySnackbarBase: React.FC<IBuySnackbarProps> = ({
  styles, betInCash, currency, stackSize, stackBuyLimit, isReBuyFlow, ...restProps
}) => {
  const getVoucherPollingIntervalRef = useRef<number | undefined>();
  const { t } = useTranslation();
  const soundsController = SoundsController.getInstance();

  const { isOpen, rounds, voucher } = useSelector(buySelector);
  const { voucherId, expirationDate: voucherExpirationDate } = voucher;

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    if (isReBuyFlow) {
      dispatch(buyRounds({ rounds: -1 }));
    }

    dispatch(setBuy());
  }, [isReBuyFlow]);

  const handleChangeRounds = useCallback((value: number) => {
    dispatch(mergeBuy({ rounds: value }));
  }, []);

  const handleVoucherClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    dispatch(buyRounds({ rounds: 1, voucherId }));
  }, [soundsController, voucherId]);

  const handleAutoplaySetupClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    dispatch(mergeAutoplay({ isSnackbarOpen: true }));
  }, [soundsController]);

  const handleBuyClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(buyRounds({ rounds }));
  }, [rounds, soundsController]);

  const handleChangeBetClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    dispatch(mergeChangeBet({ isSnackbarOpen: true }));
  }, [soundsController]);

  const handleGetVoucher = useCallback(() => {
    dispatch(getVoucher());
  }, []);

  const isVoucherAvailable = useMemo(() => !!(
    voucherId && (!voucherExpirationDate || (voucherExpirationDate && new Date(voucherExpirationDate).getTime() > Date.now()))
  ), [voucherId, voucherExpirationDate]);

  useEffect(() => {
    clearInterval(getVoucherPollingIntervalRef.current);

    if (isOpen) {
      handleGetVoucher();

      const GET_VOUCHER_POLLING_INTERVAL = 5000;

      getVoucherPollingIntervalRef.current = window.setInterval(() => {
        handleGetVoucher();

        if (voucherExpirationDate && new Date(voucherExpirationDate).getTime() < Date.now()) {
          dispatch(setVoucher({ voucherId: null }));
          toast.info(t('BuySnackbar.VoucherExpired'));
        }
      }, GET_VOUCHER_POLLING_INTERVAL);
    }

    return () => {
      clearInterval(getVoucherPollingIntervalRef.current);
    };
  }, [isOpen, voucherExpirationDate, handleGetVoucher]);

  const classNames = getClassNames(styles, {
    isVoucherAvailable,
  });

  return (
    <Snackbar
      className={classNames.snackbar}
      headerContent={isReBuyFlow ? t('BuySnackbar.Rebuy') : t('BuySnackbar.Buy')}
      isOpen={isOpen}
      e2eSelector="buy-snackbar"
      onClose={handleClose}
      {...restProps}
    >
      <div className={classNames.mainInfo}>
        <img
          className={classNames.stackSizeIcon}
          src={imgStacks}
          alt="Stack icon"
        />
        <div>
          <div className={classNames.currentBet}>
            { `${t('BuySnackbar.CurrentBet')} ${formatCurrency(betInCash, { currency, minimumFractionDigits: 0 })}` }
          </div>
          { t('BuySnackbar.StackCoinSize', { stackSize, count: stackSize }) }
        </div>
      </div>
      <div className={classNames.roundsSettings}>
        <Button
          className={classNames.voucher}
          normalImg={imgVoucher}
          e2eSelector="voucher-button"
          onClick={handleVoucherClick}
        />
        <BuyCounter
          value={rounds}
          minValue={1}
          maxValue={stackBuyLimit}
          onChange={handleChangeRounds}
        />
        <Button
          className={classNames.autoplaySetupBtn}
          classNameContent={classNames.autoplaySetupBtnContent}
          normalImg={imgAutoplaySetupBtn}
          e2eSelector="autoplay-setup-button"
          onClick={handleAutoplaySetupClick}
        >
          <TextFit forceSingleModeWidth={false}>
            {t('BuySnackbar.AutoplaySetup')}
          </TextFit>
        </Button>
      </div>
      <div className={classNames.buySettings}>
        <BuyConfirmButton
          className={classNames.buyConfirmButton}
          coins={rounds * stackSize}
          price={rounds * betInCash}
          currency={currency}
          onClick={handleBuyClick}
        />
        <Button
          className={classNames.changeBetBtn}
          classNameContent={classNames.changeBetBtnContent}
          normalImg={imgChangeBetBtn}
          e2eSelector="change-bet-button"
          onClick={handleChangeBetClick}
        >
          <TextFit forceSingleModeWidth={false}>
            {t('BuySnackbar.ChangeBet')}
          </TextFit>
        </Button>
      </div>
    </Snackbar>
  );
};

export const BuySnackbar = React.memo(
  styled<
    IBuySnackbarProps,
    IBuySnackbarStyleProps,
    IBuySnackbarStyles
  >(
    BuySnackbarBase,
    getStyles,
  ),
);
