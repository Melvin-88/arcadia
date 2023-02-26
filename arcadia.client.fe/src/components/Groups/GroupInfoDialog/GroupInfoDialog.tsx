import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { Dialog, IDialogProps } from '../../Dialog/Dialog';
import { IChips } from '../../../types/chip';
import { Chip } from '../../Chip/Chip';
import { formatCurrency } from '../../../services/dataFormat';
import {
  getClassNames, getStyles, IGroupInfoDialogStyleProps, IGroupInfoDialogStyles,
} from './styles/GroupInfoDialog';

interface IGroupInfoDialogProps extends Partial<Omit<IDialogProps, 'styles'>> {
  styles?: IStyleFunctionOrObject<IGroupInfoDialogStyleProps, IGroupInfoDialogStyles>;
  isOpen: boolean;
  bet: string;
  currency: string;
  payTable: IChips;
}

const GroupInfoDialogBase: React.FC<IGroupInfoDialogProps> = ({
  styles,
  isOpen,
  bet,
  currency,
  payTable,
  onClose,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles);

  return (
    <Dialog title={t('GroupInfoDialog.Title')} isOpen={isOpen} onClose={onClose}>
      <div className={classNames.content}>
        <div className={classNames.mainInfo}>
          {t('GroupInfoDialog.Bet', { bet })}
        </div>
        <div className={classNames.chipsValueTitle}>{t('GroupInfoDialog.ChipsValue')}</div>
        {/* TODO: Create on component for chipList (here, menu) BEGIN */}
        <div className={classNames.regularChips}>
          {payTable.map((chip) => (
            <div key={chip.type} className={classNames.chipRegular}>
              <Chip className={classNames.chipRegularIcon} chip={chip} />
              <div className={classNames.separator}> - </div>
              {
                chip.type === 'phantom'
                  ? t('GroupInfoDialog.Phantom')
                  : formatCurrency(chip.currencyValue, { currency, minimumFractionDigits: 0 })
              }
            </div>
          ))}
        </div>
        {/* TODO: Create on component for chipList (here, menu) END */}
      </div>
    </Dialog>
  );
};

export const GroupInfoDialog = styled<IGroupInfoDialogProps, IGroupInfoDialogStyleProps, IGroupInfoDialogStyles>(
  GroupInfoDialogBase,
  getStyles,
);
