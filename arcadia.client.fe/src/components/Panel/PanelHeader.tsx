import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import IconArrow from '../../assets/svg/arrowRight.svg.svg';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import {
  getClassNames, getStyles, IPanelHeaderStyleProps, IPanelHeaderStyles,
} from './styles/PanelHeader';

export interface IPanelHeaderProps {
  styles?: IStyleFunctionOrObject<IPanelHeaderStyleProps, IPanelHeaderStyles>;
  Icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  title: string;
  onArrowClick: () => void;
}

const PanelHeaderBase: React.FC<IPanelHeaderProps> = ({
  styles, Icon, title, onArrowClick,
}) => {
  const handleArrowClick = useCallback(() => {
    SoundsController.getInstance().playButtonSound(ButtonSound.secondary);
    onArrowClick();
  }, [onArrowClick]);

  const classNames = getClassNames(styles);

  return (
    <div className={classNames.panelHeader}>
      <IconArrow
        className={classNames.iconArrow}
        onClick={handleArrowClick}
      />
      { Icon && (
        <Icon className={classNames.titleIcon} />
      ) }
      { title }
    </div>
  );
};

export const PanelHeader = styled<IPanelHeaderProps, IPanelHeaderStyleProps, IPanelHeaderStyles>(
  PanelHeaderBase,
  getStyles,
);
