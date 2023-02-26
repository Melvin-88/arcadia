import React, { useCallback } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import IconArrow from '../../assets/svg/arrowLeft.svg';
import './Accordion.scss';

interface IAccordionProps {
  className?: string
  label: React.ReactNode
  isExpanded: boolean
  onChange: (value: boolean) => void
}

export const Accordion: React.FC<IAccordionProps> = ({
  className,
  label,
  isExpanded,
  children,
  onChange,
}) => {
  const handleOnChange = useCallback(() => (
    onChange(!isExpanded)
  ), [onChange, isExpanded]);

  return (
    <div className={classNames('accordion', className)}>
      <div
        className="accordion__header"
        role="button"
        tabIndex={0}
        onClick={handleOnChange}
      >
        {label}
        <IconArrow className={classNames('accordion__icon', { 'accordion__icon--expanded': isExpanded })} />
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="accordion__children">
              {children}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
