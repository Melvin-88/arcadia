import i18next from 'i18next';
import { PHANTOM_CHIP_SCATTER_ROUND_VALUE } from '../../constants';
import { formatCurrency } from '../../services/dataFormat';
import { ISegment, ISegments } from './types';

const createSegment = (value: number, currency: string): ISegment => ({
  text: value === PHANTOM_CHIP_SCATTER_ROUND_VALUE ? i18next.t('FortuneWheel.Scatter') : formatCurrency(value, { currency }),
});

export const preprocessData = (values: number[], winValue: number, currency: string) => {
  const shuffledValues = [...values].sort(() => Math.random() - 0.5);

  const { segments } = shuffledValues
    .reduce((accumulator, value) => {
      if (!accumulator.isSingleWinValueSkipped && value === winValue) {
        return {
          ...accumulator,
          isSingleWinValueSkipped: true,
        };
      }

      return {
        ...accumulator,
        segments: [
          ...accumulator.segments,
          createSegment(value, currency),
        ],
      };
    }, {
      segments: [createSegment(winValue, currency)] as ISegments,
      isSingleWinValueSkipped: false,
    });

  return {
    segments,
  };
};
