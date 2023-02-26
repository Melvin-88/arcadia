import React, { useMemo, useRef } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import imgProgressIndicatorBackground from '../../assets/images/progressIndicatorBackground.png';
import {
  getClassNames,
  getStyles,
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
} from './styles/ProgressIndicator';

export interface IProgressIndicatorProps extends IProgressIndicatorStyleProps {
  styles?: IStyleFunctionOrObject<IProgressIndicatorStyleProps, IProgressIndicatorStyles>;
  circleColor?: string;
  progress?: number;
}

const ProgressIndicatorBase: React.FC<IProgressIndicatorProps> = ({
  styles,
  className,
  classNameContent,
  progress = 0,
  circleColor,
  children,
}) => {
  const circleRef = useRef<SVGPathElement>(null);
  const circleTotalLength = circleRef.current?.getTotalLength() || 0;

  const circleStrokeDasharray = useMemo(() => (
    Math.max(circleTotalLength * progress, 0)
  ), [circleTotalLength, progress]);

  const classNames = getClassNames(styles, {
    className,
    classNameContent,
    circleColor,
    progress,
  });

  return (
    <div className={classNames.root}>
      <img
        className={classNames.progressIndicatorBackground}
        src={imgProgressIndicatorBackground}
        alt=""
      />
      <svg viewBox="0 0 100 100" className={classNames.progressCircle}>
        <path
          ref={circleRef}
          className={classNames.progressCirclePath}
          d="M8,50a42,42 0 1,0 84,0a42,42 0 1,0 -84,0"
          strokeDasharray={`${circleStrokeDasharray} ${circleTotalLength}`}
        />
      </svg>
      <div className={classNames.content}>
        { children }
      </div>
    </div>
  );
};

export const ProgressIndicator = styled<IProgressIndicatorProps, IProgressIndicatorStyleProps, IProgressIndicatorStyles>(
  ProgressIndicatorBase,
  getStyles,
);
