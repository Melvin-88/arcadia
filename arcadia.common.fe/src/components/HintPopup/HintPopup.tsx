import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { InfoIcon } from '../../assets';
import './HintPopup.scss';

interface IHintPopupProps {
}

export const HintPopup: React.FC<IHintPopupProps> = React.memo(({ children }) => {
  const [showPopper, setShowPopper] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(buttonRef.current, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  const handleToggleIsOpen = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    setShowPopper(!showPopper);
  }, [showPopper, setShowPopper]);

  const handleClickOutside = useCallback((event: MouseEvent & { target: HTMLElement }) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopper(false);
    }
  }, [setShowPopper, popupRef.current]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="hint-popup" ref={popupRef}>
      <div
        className="hint-popup__icon"
        tabIndex={0}
        role="button"
        ref={buttonRef}
        onClick={handleToggleIsOpen}
      >
        <InfoIcon />
      </div>

      {showPopper && ReactDOM.createPortal(
        <div
          className="hint-popup__body"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="hint-popup__arrow" ref={setArrowElement} style={styles.arrow} />
          {children}
        </div>,
        document.body,
      )}
    </div>
  );
});
