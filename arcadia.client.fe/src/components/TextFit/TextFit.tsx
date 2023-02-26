import React from 'react';
// @ts-ignore
import { Textfit as ReactTextFit } from 'react-textfit';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  ITextFitStyleProps, ITextFitStyles, getStyles, getClassNames,
} from './styles/TextFit';

interface ITextFitProps extends Partial<ITextFitStyleProps> {
  styles?: IStyleFunctionOrObject<ITextFitStyleProps, ITextFitStyles>;
  className?: string;
  mode?: 'single' | 'multi';
  forceSingleModeWidth?: boolean;
  min?: number;
  max?: number;
  throttle?: number;
  children?: React.ReactNode;
  onReady?: () => void;
}

const TextFitBase: React.FC<ITextFitProps> = ({ styles, className, ...restProps }) => {
  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <ReactTextFit
      className={classNames.root}
      {...restProps}
    />
  );
};

export const TextFit = React.memo(styled<ITextFitProps, ITextFitStyleProps, ITextFitStyles>(
  TextFitBase,
  getStyles,
));
