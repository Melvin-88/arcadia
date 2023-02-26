import React, { useMemo } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IPanelProps, Panel } from '../../../components/Panel/Panel';
import IconMoney from '../../../assets/svg/money.svg';
import { PanelHeader } from '../../../components/Panel/PanelHeader';
import { Chip } from '../../../components/Chip/Chip';
import { sessionSelector } from '../../app/selectors';
import { formatCurrency } from '../../../services/dataFormat';
import IconInfo from '../../../assets/svg/rules.svg';
import { IChip, IChips } from '../../../types/chip';
import { PHANTOM_CHIP_TYPE } from '../../../constants';
import {
  getClassNames, getStyles, IPayTablePanelStyleProps, IPayTablePanelStyles,
} from './styles/PayTablePanel';

export interface IPayTablePanelProps extends Omit<IPanelProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IPayTablePanelStyleProps, IPayTablePanelStyles>;
  onClose: () => void;
}

const PayTablePanelBase: React.FC<IPayTablePanelProps> = ({
  styles, onClose, ...restProps
}) => {
  const { t } = useTranslation();

  const { payTable, currency } = useSelector(sessionSelector);

  const { phantomChip, regularChips } = useMemo(() => (
    payTable.reduce((accumulator: { phantomChip: IChip | null; regularChips: IChips }, chip) => {
      if (chip.type === PHANTOM_CHIP_TYPE) {
        return {
          ...accumulator,
          phantomChip: chip,
        };
      }

      return {
        ...accumulator,
        regularChips: [...accumulator.regularChips, chip],
      };
    }, { phantomChip: null, regularChips: [] })
  ), [payTable]);

  const classNames = getClassNames(styles);

  return (
    <Panel
      className={classNames.panel}
      onClose={onClose}
      {...restProps}
    >
      <PanelHeader
        Icon={IconMoney}
        title={t('Menu.Titles.PayTable')}
        onArrowClick={onClose}
      />
      <div className={classNames.title}>{t('Menu.PayTablePanel.Chips')}</div>
      <div className={classNames.regularChips}>
        { regularChips.map((chip) => (
          <div
            key={`${chip.type} ${chip.currencyValue} ${chip.iconId}`}
            className={classNames.chipRegular}
          >
            <Chip
              className={classNames.chipRegularIcon}
              chip={chip}
            />
            <div className={classNames.separator}>
              -
            </div>
            <div className={classNames.chipRegularValue}>
              {t('Menu.PayTablePanel.Equal')}
              &nbsp;
              { formatCurrency(chip.currencyValue, { currency, minimumFractionDigits: 0 }) }
            </div>
          </div>
        ))}
      </div>
      { phantomChip && (
        <div className={classNames.chipPhantom}>
          <Chip
            className={classNames.chipPhantomIcon}
            chip={phantomChip}
          />
          <div className={classNames.separator}>
            -
          </div>
          {t('Menu.PayTablePanel.PhantomChip')}
        </div>
      ) }
      <div className={classNames.info}>
        <IconInfo className={classNames.infoIcon} />
        <div className={classNames.infoText}>
          {t('Menu.PayTablePanel.PhantomChipInfo')}
        </div>
      </div>
    </Panel>
  );
};

export const PayTablePanel = styled<IPayTablePanelProps, IPayTablePanelStyleProps, IPayTablePanelStyles>(
  PayTablePanelBase,
  getStyles,
);
