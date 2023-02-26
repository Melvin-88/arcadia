import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { tutorialSelector } from '../state/selectors';
import { sessionSelector } from '../../app/selectors';
import { Dialog } from '../../../components/Dialog/Dialog';
import { Carousel } from '../../../components/Carousel/Carousel';
import { Ribbon } from '../../../components/Ribbon/Ribbon';
import { setTutorial } from '../state/actions';
import { TUTORIAL_CAROUSEL_SETTINGS, tutorialScreens } from '../constants';
import {
  getClassNames,
  getStyles,
  ITutorialStyleProps,
  ITutorialStyles,
} from './styles/Tutorial.styles';

interface ITutorialProps {
  styles?: IStyleFunctionOrObject<ITutorialStyleProps, ITutorialStyles>;
}

export const TutorialBase: React.FC<ITutorialProps> = ({ styles }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpened } = useSelector(tutorialSelector);
  const { groupColor } = useSelector(sessionSelector);

  const handleClose = useCallback(() => {
    dispatch(
      setTutorial({
        isOpened: false,
      }),
    );
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Dialog classNameCard={classNames.card} isOpen={isOpened} onClose={handleClose}>
      <Ribbon color={groupColor}>{t('Tutorial.Title')}</Ribbon>
      <Carousel {...TUTORIAL_CAROUSEL_SETTINGS}>
        {tutorialScreens.map(({ id, image, steps }) => (
          <div key={id} className={classNames.slide}>
            <div className={classNames.wrapper}>
              <img
                className={classNames.contentImage}
                src={image}
                alt="tutorial screen"
              />
              <div className={classNames.content}>
                {steps.map((step, index) => {
                  const num = index + 1;

                  return (
                    <p key={id + step}>
                      {num}
                      .&nbsp;
                      {t(step)}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </Dialog>
  );
};

export const Tutorial = styled<
  ITutorialProps,
  ITutorialStyleProps,
  ITutorialStyles
>(TutorialBase, getStyles);
