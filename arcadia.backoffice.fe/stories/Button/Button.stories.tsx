import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';
import {
  Button, ButtonColor, ButtonVariant, IButtonProps,
} from 'arcadia-common-fe';
import './styles/Button.stories.scss';

export default {
  component: Button,
  title: 'Button',
};

const renderButtonWithProps: React.FC<IButtonProps> = ({ children, ...restProps }) => (
  <Button
    className={`button-story__btn ${text('className', '')}`}
    {...restProps}
  >
    {children}
  </Button>
);

const renderPrimaryFilledButton = (props?: IButtonProps) => renderButtonWithProps({
  children: 'Primary Filled',
  ...props,
});

const renderPrimaryOutlineButton = (props?: IButtonProps) => renderButtonWithProps({
  variant: ButtonVariant.outline,
  children: 'Primary Outline',
  ...props,
});

const renderSecondaryFilledButton = (props?: IButtonProps) => renderButtonWithProps({
  children: 'Secondary Filled',
  color: ButtonColor.secondary,
  ...props,
});

const renderSecondaryOutlineButton = (props?: IButtonProps) => renderButtonWithProps({
  variant: ButtonVariant.outline,
  color: ButtonColor.secondary,
  children: 'Secondary Outline',
  ...props,
});

const renderTertiaryFilledButton = (props?: IButtonProps) => renderButtonWithProps({
  children: 'Tertiary Filled',
  color: ButtonColor.tertiary,
  ...props,
});

const renderTertiaryOutlineButton = (props?: IButtonProps) => renderButtonWithProps({
  variant: ButtonVariant.outline,
  color: ButtonColor.tertiary,
  children: 'Tertiary Outline',
  ...props,
});

const renderQuaternaryFilledButton = (props?: IButtonProps) => renderButtonWithProps({
  children: 'Quaternary Filled',
  color: ButtonColor.quaternary,
  ...props,
});

const renderQuaternaryOutlineButton = (props?: IButtonProps) => renderButtonWithProps({
  variant: ButtonVariant.outline,
  color: ButtonColor.quaternary,
  children: 'Quaternary Outline',
  ...props,
});

const renderQuinaryFilledButton = (props?: IButtonProps) => renderButtonWithProps({
  children: 'Quinary Filled',
  color: ButtonColor.quinary,
  ...props,
});

const renderQuinaryOutlineButton = (props?: IButtonProps) => renderButtonWithProps({
  variant: ButtonVariant.outline,
  color: ButtonColor.quinary,
  children: 'Quinary Outline',
  ...props,
});

const renderAllWithProps = (props?: IButtonProps) => (
  <div className="button-story">
    { renderPrimaryFilledButton(props) }
    { renderSecondaryFilledButton(props) }
    { renderTertiaryFilledButton(props) }
    { renderQuaternaryFilledButton(props) }
    { renderQuinaryFilledButton(props) }
    <hr />
    { renderPrimaryOutlineButton(props) }
    { renderSecondaryOutlineButton(props) }
    { renderTertiaryOutlineButton(props) }
    { renderQuaternaryOutlineButton(props) }
    { renderQuinaryOutlineButton(props) }
  </div>
);

const variantSelectOptions = {
  [ButtonVariant.filled]: ButtonVariant.filled,
  [ButtonVariant.outline]: ButtonVariant.outline,
};

const colorSelectOptions = {
  [ButtonColor.primary]: ButtonColor.primary,
  [ButtonColor.secondary]: ButtonColor.secondary,
  [ButtonColor.tertiary]: ButtonColor.tertiary,
  [ButtonColor.tertiary]: ButtonColor.quaternary,
};

export const StandardAll = () => renderAllWithProps();

export const LoadingAll = () => renderAllWithProps({ isLoading: true });

export const DisabledAll = () => renderAllWithProps({ disabled: true });

export const Sandbox = () => renderButtonWithProps({
  variant: select('variant', variantSelectOptions, undefined),
  color: select('color', colorSelectOptions, undefined),
  isLoading: boolean('isLoading', false),
  fullWidth: boolean('fullWidth', false),
  disabled: boolean('disabled', false),
  children: text('text', 'Button Text'),
});
