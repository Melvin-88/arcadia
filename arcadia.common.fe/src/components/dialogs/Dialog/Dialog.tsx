import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import IconClose from '../../../assets/svg/close.svg';
import { Overlay } from '../../Overlay/Overlay';
import './styles/Dialog.scss';

export type DialogTypeUnion = 'default' | 'wide';

export const DialogType : { [key in DialogTypeUnion] : DialogTypeUnion } = {
  default: 'default',
  wide: 'wide',
};

export interface IDialogProps {
  className?: string
  footerClassNames?: string
  dialogType?: DialogTypeUnion
  title: string
  footer?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const Dialog: React.FC<IDialogProps> = ({
  className,
  footerClassNames,
  dialogType = DialogType.default,
  isOpen,
  title,
  footer,
  children,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleKeydown = useCallback((event) => {
    if (isOpen && onClose && event.keyCode === 27) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown, false);

    return () => {
      document.removeEventListener('keydown', handleKeydown, false);
    };
  }, []);

  return ReactDOM.createPortal((
    <Overlay>
      <div
        className={classNames(
          'dialog',
          `dialog--${dialogType}`,
          className,
        )}
        role="dialog"
      >
        <div className="dialog__header">
          <h3>{title}</h3>
          <button className="dialog__header-btn" onClick={onClose}>
            <IconClose className="dialog__header-btn-icon" />
          </button>
        </div>
        <div className={`dialog__body--${dialogType}`}>
          { children }
        </div>
        { footer && (
          <div className={classNames(`dialog__footer--${dialogType}`, footerClassNames)}>
            { footer }
          </div>
        ) }
      </div>
    </Overlay>
  ), document.body);
};
