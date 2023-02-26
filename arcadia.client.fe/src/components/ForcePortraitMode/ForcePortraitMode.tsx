import React, { useCallback, useEffect, useState } from 'react';
import { Overlay } from '../Overlay/Overlay';
import iconForcePortraitMode from '../../assets/images/forcePortraitMode.png';
import { OverlayBackdropColor } from '../Overlay/styles/Overlay.styles';

// TODO: Request design and complete styles
// TODO: Should be removed after desktop resolution approve by customer

const checkPortrait = () => window.matchMedia('(orientation: portrait)').matches;

export const ForcePortraitMode: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(checkPortrait);

  const handleResize = useCallback(() => {
    setIsPortrait(checkPortrait());
  }, [setIsPortrait]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Overlay
      isVisible={!isPortrait}
      overlayBackdropColor={OverlayBackdropColor.primarySolid}
    >
      <img src={iconForcePortraitMode} alt="Please rotate your device to portrait" />
    </Overlay>
  );
};
