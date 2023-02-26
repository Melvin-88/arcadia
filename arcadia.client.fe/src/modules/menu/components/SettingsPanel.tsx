import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import debounce from 'lodash.debounce';
import { IPanelProps, Panel } from '../../../components/Panel/Panel';
import { VolumeSlider } from '../../../components/VolumeSlider/VolumeSlider';
import { PanelHeader } from '../../../components/Panel/PanelHeader';
import { mergeSoundsConfig } from '../../app/actions';
import { soundsConfigSelector } from '../../app/selectors';
import IconVolume from '../../../assets/svg/volume.svg';
import IconGear from '../../../assets/svg/gear.svg';
import {
  getClassNames, getStyles, ISettingsPanelStyleProps, ISettingsPanelStyles,
} from './styles/SettingsPanel';

export interface ISettingsPanelProps extends Omit<IPanelProps, 'styles'> {
  styles?: IStyleFunctionOrObject<ISettingsPanelStyleProps, ISettingsPanelStyles>;
  onClose: () => void;
}

const SettingsPanelBase: React.FC<ISettingsPanelProps> = ({ styles, onClose, ...restProps }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const {
    machineSoundsVolume, isMachineSoundsMuted, gameSoundsVolume, isGameSoundsMuted,
  } = useSelector(soundsConfigSelector);

  const handleChangeMachineSoundsVolume = useCallback(debounce((value: number) => {
    dispatch(mergeSoundsConfig({
      machineSoundsVolume: value,
    }));
  }, 75), []);

  const handleSwitchMuteMachineSounds = useCallback((isMuted: boolean) => {
    dispatch(mergeSoundsConfig({
      isMachineSoundsMuted: isMuted,
    }));
  }, []);

  const handleChangeGameSoundsVolume = useCallback(debounce((value: number) => {
    dispatch(mergeSoundsConfig({
      gameSoundsVolume: value,
    }));
  }, 75), []);

  const handleSwitchMuteGameSounds = useCallback((isMuted: boolean) => {
    dispatch(mergeSoundsConfig({
      isGameSoundsMuted: isMuted,
    }));
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Panel
      onClose={onClose}
      {...restProps}
    >
      <PanelHeader
        Icon={IconGear}
        title={t('Menu.Titles.Settings')}
        onArrowClick={onClose}
      />
      <div className={classNames.settings}>
        <div className={classNames.settingsTitle}>
          <IconVolume className={classNames.volumeIcon} />
          {t('Menu.SettingsPanel.Sounds')}
        </div>
        <div className={classNames.sliderSection}>
          <div className={classNames.sliderTitle}>
            {t('Menu.SettingsPanel.MachineSounds')}
          </div>
          <VolumeSlider
            value={machineSoundsVolume}
            min={0}
            max={100}
            step={1}
            isMuted={isMachineSoundsMuted}
            onChange={handleChangeMachineSoundsVolume}
            onMuteChange={handleSwitchMuteMachineSounds}
          />
        </div>
        <div className={classNames.sliderSection}>
          <div className={classNames.sliderTitle}>
            {t('Menu.SettingsPanel.GameSounds')}
          </div>
          <VolumeSlider
            value={gameSoundsVolume}
            isMuted={isGameSoundsMuted}
            onChange={handleChangeGameSoundsVolume}
            onMuteChange={handleSwitchMuteGameSounds}
          />
        </div>
      </div>
    </Panel>
  );
};

export const SettingsPanel = styled<ISettingsPanelProps, ISettingsPanelStyleProps, ISettingsPanelStyles>(
  SettingsPanelBase,
  getStyles,
);
