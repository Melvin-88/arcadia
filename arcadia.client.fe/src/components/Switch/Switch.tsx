import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import {
  getClassNames, getStyles, ISwitchStyleProps, ISwitchStyles,
} from './styles/Switch';

export interface ISwitchProps extends Partial<ISwitchStyleProps> {
  styles?: IStyleFunctionOrObject<ISwitchStyleProps, ISwitchStyles>;
  withLabel?: boolean;
  onChange: (value: boolean) => void;
  e2eSelector?: string;
  e2eLabelOffSelector?: string;
  e2eLabelOnSelector?: string;
}

const SwitchBase: React.FC<ISwitchProps> = ({
  styles,
  className,
  value,
  withLabel = true,
  onChange,
  e2eSelector = 'switch',
  e2eLabelOffSelector = 'switch-label-on',
  e2eLabelOnSelector = 'switch-label-on',
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    SoundsController.getInstance().playButtonSound(ButtonSound.toggle);
    onChange(!value);
  }, [value, onChange]);

  const classNames = getClassNames(styles, {
    className,
    value,
  });

  return (
    <div
      className={classNames.root}
      role="switch"
      tabIndex={0}
      aria-checked={value}
      data-e2e-selector={e2eSelector}
      onClick={handleClick}
    >
      {withLabel && (
        <>
          <label className={classNames.labelOff} data-e2e-selector={e2eLabelOffSelector}>{t('Switch.Off')}</label>
          <label className={classNames.labelOn} data-e2e-selector={e2eLabelOnSelector}>{t('Switch.On')}</label>
        </>
      )}
    </div>
  );
};

export const Switch = React.memo(
  styled<
    ISwitchProps,
    ISwitchStyleProps,
    ISwitchStyles
  >(
    SwitchBase,
    getStyles,
  ),
);
