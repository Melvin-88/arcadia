import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import { FormApi } from 'final-form';
import { IFormFieldProps } from '../../types';
import { useSearchParams } from '../../hooks';
import { Form } from '../forms';
import { Button } from '../Button/Button';
import { ExportButton } from '../ExportButton/ExportButton';
import './ModuleFilters.scss';

export interface IModuleFiltersProps<TValues> {
  className?: string
  total: number
  isExportDisabled: boolean
  isExporting?: boolean
  isAutoSubmitOnReset?: boolean
  resetText?: string
  submitText?: string
  initialValues?: TValues
  children?: React.ReactElement<IFormFieldProps> | React.ReactElement<IFormFieldProps>[]
  onFiltersSubmit: (data: TValues | {}) => void
  onReset?: () => void
  onExport: () => void
}

export const ModuleFilters: <TValues>(props: IModuleFiltersProps<TValues>) => React.ReactElement = ({
  className,
  total,
  isExportDisabled,
  isExporting,
  isAutoSubmitOnReset = true,
  resetText = 'Reset',
  submitText = 'Filter',
  children,
  onFiltersSubmit,
  onExport,
  onReset,
  ...restProps
}) => {
  const formApiRef = useRef<FormApi | null>(null);
  const { sortBy, sortOrder } = useSearchParams();

  const handleReset = useCallback(() => {
    if (formApiRef.current) {
      formApiRef.current.reset({});
    }

    if (isAutoSubmitOnReset) {
      onFiltersSubmit({
        sortBy,
        sortOrder,
      });
    }

    if (onReset) {
      onReset();
    }
  }, [formApiRef.current, sortBy, sortOrder, isAutoSubmitOnReset, onFiltersSubmit, onReset]);

  return (
    <Form
      onSubmit={onFiltersSubmit}
      {...restProps}
      render={({
        submitting,
        handleSubmit,
        form,
        values,
      }) => {
        formApiRef.current = form;

        return (
          <form
            className={classNames('module-filters', className)}
            onSubmit={handleSubmit}
          >
            {children && React.Children.map(children, (child: React.ReactElement<IFormFieldProps>) => (
              React.cloneElement(child, {
                className: `module-filters__field ${child.props.className}`,
                formValues: values,
              })
            ))}
            <div className="module-filters__controls">
              <Button
                className="module-filters__btn"
                color="tertiary"
                type="submit"
                disabled={submitting}
              >
                { submitText }
              </Button>
              <Button
                className="module-filters__btn"
                color="primary"
                disabled={submitting}
                onClick={handleReset}
              >
                { resetText }
              </Button>
              <ExportButton
                className="module-filters__btn module-filters__btn--export"
                disabled={total <= 0 || isExportDisabled}
                isLoading={isExporting}
                onClick={onExport}
              />
            </div>
          </form>
        );
      }}
    />
  );
};
