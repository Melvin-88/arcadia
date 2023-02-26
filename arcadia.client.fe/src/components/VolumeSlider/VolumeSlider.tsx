import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Slider, ISliderProps } from '../Slider/Slider';
import { Button } from '../Button/Button';
import iconMute from '../../assets/images/buttonSoundSettingOff.png';
import iconUnmute from '../../assets/images/buttonSoundSettingOn.png';
import {
  getClassNames, getStyles, IVolumeSliderStyleProps, IVolumeSliderStyles,
} from './styles/VolumeSlider';

interface IVolumeSliderProps extends ISliderProps {
  styles?: IStyleFunctionOrObject<IVolumeSliderStyleProps, IVolumeSliderStyles>;
  isMuted: boolean;
  onMuteChange: (isMuted: boolean) => void;
}

const VolumeSliderBase: React.FC<IVolumeSliderProps> = ({
  styles,
  className,
  min = 0,
  max = 1,
  step = 0.01,
  isMuted,
  onMuteChange,
  ...restProps
}) => {
  const handleSwitchMute = useCallback(() => {
    onMuteChange(!isMuted);
  }, [isMuted, onMuteChange]);

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <Button className={classNames.volumeIcon} normalImg={isMuted ? iconMute : iconUnmute} onClick={handleSwitchMute} />
      <Slider
        className={classNames.slider}
        min={min}
        max={max}
        step={step}
        {...restProps}
      />
    </div>
  );
};

export const VolumeSlider = styled<IVolumeSliderProps, IVolumeSliderStyleProps, IVolumeSliderStyles>(
  VolumeSliderBase,
  getStyles,
);
