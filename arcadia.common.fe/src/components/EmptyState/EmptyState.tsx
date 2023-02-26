import React from 'react';
import classNames from 'classnames';
import IconBox from '../../assets/svg/box.svg';
import './styles/EmptyState.scss';

export interface IEmptyStateProps {
  className?: string
}

export const EmptyState: React.FC<IEmptyStateProps> = ({
  className,
}) => (
  <div className={classNames(
    'empty-state',
    className,
  )}
  >
    <div className="empty-state__content">
      <IconBox className="empty-state__icon" />
      <h2 className="empty-state__title">No results found</h2>
      <p className="empty-state__description">Try adjusting your search or filter to find what you`re looking for.</p>
    </div>
  </div>
);
