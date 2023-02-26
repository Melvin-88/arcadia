import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector } from '../../modules/menu/state/selectors';
import { appStateSelector } from '../../modules/app/selectors';
import { GroupColorId } from '../../types/group';
import { MenuType } from '../../modules/menu/types';
import { setMenu } from '../../modules/menu/state/actions';
import { setQuitConfirmDialog } from '../../modules/app/actions';
import { Button } from '../Button/Button';
import { PubSubClient } from '../../services/pubSubClient/client';
import { PubSubUserEventNotification } from '../../services/pubSubClient/constants';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import { JackpotIndicator } from '../../modules/jackpot/components/JackpotIndicator/JackpotIndicator';
import { Ribbon } from '../Ribbon/Ribbon';
import imgHeaderBackground from '../../assets/images/headerBackground.jpg';
import imgBurgerBtn from '../../assets/images/burgerBtn.png';
import imgLobbyBtn from '../../assets/images/lobbyBtn.png';
import imgFortuneWheelPointer from '../../assets/images/fortuneWheelPointer.png';
import {
  getClassNames, getStyles, IHeaderStyleProps, IHeaderStyles,
} from './styles/Header';

const pubSubClient = PubSubClient.getInstance();
const soundsController = SoundsController.getInstance();

export interface IHeaderProps extends Partial<IHeaderStyleProps> {
  styles?: IStyleFunctionOrObject<IHeaderStyleProps, IHeaderStyles>;
  machineId: number;
  groupName: string;
  color: GroupColorId;
  currency: string;
  isWithJackpot?: boolean;
}

const HeaderBase: React.FC<IHeaderProps> = ({
  styles,
  className,
  groupName,
  color,
  currency,
  isWithJackpot,
  isFortuneWheelPointerVisible,
  isFortuneWheelPointerHighlighting,
}) => {
  const { openedMenu } = useSelector(menuSelector);
  const { homeUrl } = useSelector(appStateSelector);

  const dispatch = useDispatch();

  const handleBurgerClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    dispatch(setMenu({
      openedMenu: openedMenu ? null : MenuType.main,
    }));
    pubSubClient.sendUserEventNotification({ type: PubSubUserEventNotification.menuClicked });
  }, [openedMenu]);

  const handleHomeButtonClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    dispatch(setQuitConfirmDialog({ isOpen: true }));
  }, []);

  const classNames = getClassNames(styles, {
    className,
    isFortuneWheelPointerVisible,
    isFortuneWheelPointerHighlighting,
    isHomeButtonHidden: !homeUrl,
  });

  const fortuneWheelPointer = (
    <img
      className={classNames.fortuneWheelPointer}
      src={imgFortuneWheelPointer}
      alt="Fortune Wheel Pointer"
    />
  );

  return (
    <div className={classNames.root}>
      <img
        className={classNames.headerBackground}
        src={imgHeaderBackground}
        alt=""
      />
      <div className={classNames.content}>
        <Button
          className={classNames.burgerBtn}
          normalImg={imgBurgerBtn}
          e2eSelector="header-burger-button"
          onClick={handleBurgerClick}
        />
        <Ribbon
          className={classNames.ribbon}
          color={color}
        >
          { groupName }
        </Ribbon>
        {
          isWithJackpot ? (
            <JackpotIndicator
              className={classNames.jackpot}
              currency={currency}
            >
              { fortuneWheelPointer }
            </JackpotIndicator>
          ) : fortuneWheelPointer
        }
        <Button
          className={classNames.lobbyBtn}
          normalImg={imgLobbyBtn}
          e2eSelector="header-go-to-lobby-button"
          onClick={handleHomeButtonClick}
        />
      </div>
    </div>
  );
};

export const Header = React.memo(
  styled<
    IHeaderProps,
    IHeaderStyleProps,
    IHeaderStyles
  >(
    HeaderBase,
    getStyles,
  ),
);
