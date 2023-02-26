import React from 'react';
import { DatepickerToField, dateSubtractDays } from 'arcadia-common-fe';

interface IReportDatepickerToFieldProps {
}

export const ReportDatepickerToField: React.FC<IReportDatepickerToFieldProps> = () => {
  const maxDate = dateSubtractDays(new Date(), '1');

  return (
    <DatepickerToField
      label="End Date"
      name="endDate"
      fromName="startDate"
      maxDate={maxDate}
      maxDaysRange={90}
      isRequired
    />
  );
};
