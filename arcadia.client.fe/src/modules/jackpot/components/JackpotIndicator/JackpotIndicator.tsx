import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import imgJackpotIndicatorBackground from '../../../../assets/images/jackpot.png';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { Switch } from '../../../../components/Switch/Switch';
import { setJackpotIsOptInEnabled } from '../../state/actions';
import { jackpotSelector } from '../../state/selectors';
import { useJackpot } from '../../hooks';
import {
  getClassNames, getStyles, IJackpotIndicatorStyleProps, IJackpotIndicatorStyles,
} from './styles/JackpotIndicator';

export interface IJackpotIndicatorProps extends Partial<IJackpotIndicatorStyleProps> {
  styles?: IStyleFunctionOrObject<IJackpotIndicatorStyleProps, IJackpotIndicatorStyles>;
  currency: string;
  children: React.ReactNode;
}

const JackpotIndicatorBase: React.FC<IJackpotIndicatorProps> = ({
  styles,
  className,
  currency,
  children,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { activeGameId, isOptInEnabled, isActive } = useSelector(jackpotSelector);

  const { getFormattedPotSize } = useJackpot();
  const formattedPotAmount = getFormattedPotSize(activeGameId, currency);

  const handleIsOptInEnabledChange = useCallback((value: boolean) => {
    dispatch(setJackpotIsOptInEnabled({ gameId: activeGameId, isOptInEnabled: value }));
  }, [activeGameId]);

  const classNames = getClassNames(styles, { className, isOptInEnabled, isActive });

  return (
    <div className={classNames.root}>
      <img
        className={classNames.jackpotIndicatorBackground}
        src={imgJackpotIndicatorBackground}
        alt=""
      />
      <TextFit
        className={classNames.jackpotAmount}
        forceSingleModeWidth={false}
        mode="single"
      >
        {formattedPotAmount}
      </TextFit>
      <div className={classNames.switchContainer}>
        <Switch
          className={classNames.switch}
          value={isOptInEnabled}
          withLabel={false}
          onChange={handleIsOptInEnabledChange}
        />
        <TextFit className={classNames.switchTitle}>{t('JackpotIndicator.Activate')}</TextFit>
      </div>
      { children }
    </div>
  );
};

export const JackpotIndicator = React.memo(
  styled<
    IJackpotIndicatorProps,
    IJackpotIndicatorStyleProps,
    IJackpotIndicatorStyles
  >(
    JackpotIndicatorBase,
    getStyles,
  ),
);
