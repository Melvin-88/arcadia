import React, { useCallback, useState, MouseEvent } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { TextFit } from '../../TextFit/TextFit';
import { Card } from '../../Card/Card';
import { GroupInfoDialog } from '../GroupInfoDialog/GroupInfoDialog';
import { Button } from '../../Button/Button';
import { PrimaryButton } from '../../PrimaryButton/PrimaryButton';
import { Ribbon } from '../../Ribbon/Ribbon';
import { GroupId, IGroup } from '../../../types/group';
import { useJackpot } from '../../../modules/jackpot/hooks';
import { formatCurrency } from '../../../services/dataFormat';
import jackpot from '../../../assets/images/jackpotMini.png';
import imgQueue from '../../../assets/images/queue.png';
import infoIcon from '../../../assets/images/info.png';
import slotMachine from '../../../assets/images/slotMachine.png';
import imgStacks from '../../../assets/images/stacks.png';
import {
  getClassNames,
  getStyles,
  IGroupCardStyleProps,
  IGroupCardStyles,
} from './styles/GroupCard';

export interface IGroupCardProps {
  styles?: IStyleFunctionOrObject<IGroupCardStyleProps, IGroupCardStyles>;
  group: IGroup;
  onCardClick: (groupId: GroupId) => void;
}

const GroupCardBase: React.FC<IGroupCardProps> = ({ styles, group, onCardClick }) => {
  const { t } = useTranslation();

  const {
    groupId, betInCash, groupName, queueLength, jackpotGameId, currency, color, payTable,
  } = group;

  const betInCashFormatted = formatCurrency(betInCash, { currency, minimumFractionDigits: 0 });

  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  const handleCloseGroupInfo = useCallback(() => setIsGroupInfoOpen(false), [setIsGroupInfoOpen]);

  const handleShowGroupInfo = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setIsGroupInfoOpen(true);
  }, [setIsGroupInfoOpen]);

  const handleCardClick = useCallback(() => {
    onCardClick(groupId);
  }, [groupId, onCardClick]);

  const { getFormattedPotSize } = useJackpot();
  const formattedPotAmount = getFormattedPotSize(jackpotGameId, currency);

  const classNames = getClassNames(styles, { color });

  return (
    <>
      <Card className={classNames.root} onClick={handleCardClick}>
        <div className={classNames.queue}>
          <img src={imgQueue} className={classNames.imgQueue} alt="queue" />
          <TextFit className={classNames.queueSize}>{queueLength}</TextFit>
        </div>

        <Button className={classNames.infoButton} normalImg={infoIcon} onClick={handleShowGroupInfo} />

        <img src={slotMachine} className={classNames.machineImg} alt="machine" />
        <Ribbon
          className={classNames.ribbon}
          color={color}
        >
          {groupName}
        </Ribbon>

        <div className={classNames.jackpot}>
          {jackpotGameId && (
            <>
              <img src={jackpot} className={classNames.jackpotBackground} alt="jackpot" />
              <TextFit className={classNames.jackpotContent}>
                {formattedPotAmount}
              </TextFit>
            </>
          )}
        </div>

        <div className={classNames.stack}>
          <img src={imgStacks} className={classNames.imgStack} alt="stack" />
          <div className={classNames.stackBetTitle}>
            {t('GroupCard.Bet')}
          </div>
          <div className={classNames.stackBet}>
            {betInCashFormatted}
          </div>
        </div>
        <div className={classNames.queueInfoText}>
          {t('GroupCard.PositionInQueue', { queueLength })}
        </div>
        <PrimaryButton className={classNames.playBtn}>
          <TextFit>{t('GroupCard.Play')}</TextFit>
        </PrimaryButton>
      </Card>
      <GroupInfoDialog
        bet={betInCashFormatted}
        currency={currency}
        payTable={payTable}
        isOpen={isGroupInfoOpen}
        onClose={handleCloseGroupInfo}
      />
    </>
  );
};

export default styled<IGroupCardProps, IGroupCardStyleProps, IGroupCardStyles>(
  GroupCardBase,
  getStyles,
);
