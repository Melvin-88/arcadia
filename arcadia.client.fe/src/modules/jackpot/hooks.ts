import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GameId } from './types';
import { jackpotSelector } from './state/selectors';
import { formatCurrency } from '../../services/dataFormat';

// TODO: Implement optimizations
export function useJackpot() {
  const { t } = useTranslation();

  const { potStatesMap } = useSelector(jackpotSelector);

  const getPotSizeByGameId = useCallback((gameId: GameId) => (
    potStatesMap[gameId]?.valueInCash ?? null
  ), [potStatesMap]);

  const getFormattedPotSize = useCallback((gameId: GameId, currency: string) => {
    const potAmountInCash = getPotSizeByGameId(gameId);

    return potAmountInCash === null ? t('Jackpot.Loading') : formatCurrency(potAmountInCash, { currency, minimumFractionDigits: 0 });
  }, [potStatesMap]);

  return {
    getPotSizeByGameId,
    getFormattedPotSize,
  };
}
