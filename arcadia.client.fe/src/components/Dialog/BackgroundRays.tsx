import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, IBackgroundRaysStyleProps, IBackgroundRaysStyles,
} from './styles/BackgroundRays';

interface IBackgroundRaysProps {
  styles?: IStyleFunctionOrObject<IBackgroundRaysStyleProps, IBackgroundRaysStyles>;
}

const BackgroundRaysBase: React.FC<IBackgroundRaysProps> = ({ styles }) => {
  const classNames = getClassNames(styles);

  return (
    <div className={classNames.root}>
      <div className={classNames.rays}>
        <div className={classNames.ray} />
        <div className={classNames.ray} />
        <div className={classNames.ray} />
      </div>
    </div>
  );
};

export const BackgroundRays = styled<IBackgroundRaysProps, IBackgroundRaysStyleProps, IBackgroundRaysStyles>(
  BackgroundRaysBase,
  getStyles,
);
