import React from 'react';
import classNames from 'classnames';
import './styles/Overlay.scss';

export type OverlayColorUnion = 'primary' | 'secondary';

export const OverlayColor : { [key in OverlayColorUnion] : OverlayColorUnion } = {
  primary: 'primary',
  secondary: 'secondary',
};

export interface IOverlayProps {
  className?: string,
  color?: OverlayColorUnion,
  onClick?: () => void,
}

export const Overlay: React.FC<IOverlayProps> = ({
  className,
  color = OverlayColor.primary,
  children,
  onClick,
}) => (
  <div className="overlay">
    <div
      className={classNames(
        'overlay__backdrop',
        `overlay__backdrop--${color}`,
        className,
      )}
      role="presentation"
      onClick={onClick}
    />
    {children}
  </div>
);
