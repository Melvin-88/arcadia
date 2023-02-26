import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import imgBasement1 from '../../../../../assets/images/queue/currentUser/basement1.png';
import imgBasement2 from '../../../../../assets/images/queue/currentUser/basement2.png';
import imgFigure from '../../../../../assets/images/queue/currentUser/figure.png';
import {
  getClassNames, getStyles, ICurrentPlayerStyleProps, ICurrentPlayerStyles,
} from './styles/CurrentPlayer';

export interface ICurrentPlayerProps extends Partial<ICurrentPlayerStyleProps> {
  styles?: IStyleFunctionOrObject<ICurrentPlayerStyleProps, ICurrentPlayerStyles>;
  isPositionExists?: boolean;
}

const CurrentPlayerBase: React.FC<ICurrentPlayerProps> = ({
  styles,
  className,
  isPositionExists,
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles, {
    className,
    isPositionExists: !!isPositionExists,
  });

  return (
    <div className={classNames.root}>
      <img
        className={classNames.imgBasement1}
        src={imgBasement1}
        alt=""
      />
      <img
        className={classNames.imgBasement2}
        src={imgBasement2}
        alt=""
      />
      <img
        className={classNames.imgFigure}
        src={imgFigure}
        alt=""
      />
      <div className={classNames.title}>
        {t('QueueBar.You')}
      </div>
    </div>
  );
};

export const CurrentPlayer = styled<ICurrentPlayerProps, ICurrentPlayerStyleProps, ICurrentPlayerStyles>(
  CurrentPlayerBase,
  getStyles,
);
