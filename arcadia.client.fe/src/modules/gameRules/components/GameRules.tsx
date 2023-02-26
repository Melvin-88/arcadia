import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation, Trans } from 'react-i18next';
import { gameRulesSelector } from '../state/selectors';
import { sessionSelector } from '../../app/selectors';
import { GAME_RULES_CAROUSEL_SETTINGS, gameRulesScreens } from '../constants';
import { Dialog } from '../../../components/Dialog/Dialog';
import { Carousel } from '../../../components/Carousel/Carousel';
import { Ribbon } from '../../../components/Ribbon/Ribbon';
import { setGameRules } from '../state/actions';
import {
  getClassNames,
  getStyles,
  IGameRulesStyleProps,
  IGameRulesStyles,
} from './styles/GameRules.styles';

interface IGameRulesProps {
  styles?: IStyleFunctionOrObject<IGameRulesStyleProps, IGameRulesStyles>;
}

export const GameRulesBase: React.FC<IGameRulesProps> = ({ styles }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpened } = useSelector(gameRulesSelector);
  const { groupColor } = useSelector(sessionSelector);

  const handleClose = useCallback(() => {
    dispatch(
      setGameRules({
        isOpened: false,
      }),
    );
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Dialog classNameCard={classNames.card} isOpen={isOpened} onClose={handleClose}>
      <Ribbon color={groupColor}>{t('GameRules.Title')}</Ribbon>
      <Carousel progressBar {...GAME_RULES_CAROUSEL_SETTINGS}>
        {gameRulesScreens.map(({
          id, title, image, content,
        }) => (
          <div key={id}>
            <div className={classNames.wrapper}>
              <h5 className={classNames.title}>
                {t(title)}
              </h5>
              {image && (
                <img className={classNames.image} src={image} alt={`${title} screen`} />
              )}
              <div className={classNames.content}>
                <Trans
                  i18nKey={content}
                  components={{
                    paragraph: <p />, highlighted: <span />, list: <ul />, item: <li />,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </Dialog>
  );
};

export const GameRules = styled<IGameRulesProps, IGameRulesStyleProps, IGameRulesStyles>(GameRulesBase, getStyles);
