import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { PubSubClient } from '../../services/pubSubClient/client';
import { PubSubUserEventNotification } from '../../services/pubSubClient/constants';
import { changeOrientation } from '../../modules/app/actions';
import { Orientation } from '../../types/general';
import {
  getClassNames, getStyles, IAppLayoutStyleProps, IAppLayoutStyles,
} from './styles/AppLayout';

const pubSubClient = PubSubClient.getInstance();

export interface IAppLayoutProps extends Partial<IAppLayoutStyleProps> {
  styles?: IStyleFunctionOrObject<IAppLayoutStyleProps, IAppLayoutStyles>;
}

export const APP_CONTAINER_ID = 'app-container';

const MIN_RATIO = 0.58;
const SMALLEST_FONT_SIZE_PER_PX = 2.84 / 320;

const getOrientation = () => {
  if (window.innerWidth > window.innerHeight) {
    return Orientation.landscape;
  }

  return Orientation.portrait;
};

const calculateContentMaxWidth = (): number | null => {
  const ratio = window.innerWidth / window.innerHeight;

  return ratio > MIN_RATIO ? window.innerHeight * MIN_RATIO : null;
};

const AppLayoutBase: React.FC<IAppLayoutProps> = ({ styles, children }) => {
  const orientation = useRef<Orientation | null>(null);
  const [contentMaxWidth, setContentMaxWidth] = useState(() => calculateContentMaxWidth());

  const dispatch = useDispatch();

  const handleResize = useCallback(() => {
    const resizedOrientation = getOrientation();

    if (resizedOrientation !== orientation.current) {
      orientation.current = resizedOrientation;
      dispatch(changeOrientation({ orientation: resizedOrientation }));
    }

    const calculatedContentMaxWidth = calculateContentMaxWidth();

    const fontSize = SMALLEST_FONT_SIZE_PER_PX * (calculatedContentMaxWidth || window.innerWidth);

    document.documentElement.style.fontSize = `${fontSize}px`;

    setContentMaxWidth(calculatedContentMaxWidth);
  }, [setContentMaxWidth]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleFocus = useCallback(() => {
    pubSubClient.sendUserEventNotification({ type: PubSubUserEventNotification.regainedFocus });
  }, []);

  const handleBlur = useCallback(() => {
    pubSubClient.sendUserEventNotification({ type: PubSubUserEventNotification.lostFocus });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleContextMenu]);

  useEffect(() => {
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleFocus, handleBlur]);

  const classNames = getClassNames(styles, { contentMaxWidth });

  return (
    <div className={classNames.app}>
      <div id={APP_CONTAINER_ID} className={classNames.appMainContainer}>
        {children}
      </div>
    </div>
  );
};

export const AppLayout = styled<IAppLayoutProps, IAppLayoutStyleProps, IAppLayoutStyles>(
  AppLayoutBase,
  getStyles,
);
