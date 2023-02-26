import React from 'react';
import { DatepickerFromField, dateSubtractDays } from 'arcadia-common-fe';

interface IReportDatepickerFromFieldProps {
}

export const ReportDatepickerFromField: React.FC<IReportDatepickerFromFieldProps> = () => {
  const maxDate = dateSubtractDays(new Date(), '1');

  return (
    <DatepickerFromField
      label="Start Date"
      name="startDate"
      toName="endDate"
      maxDate={maxDate}
      isRequired
    />
  );
};
