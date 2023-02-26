import { FieldValidator } from 'final-form';
import moment from 'moment';
import { convertTimeToSeconds, getDateDiffInDays } from '../../services';
import { TimeSpanFormat } from '../../types';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
const IP_ADDRESS_REGEXP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; // eslint-disable-line
const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_\-`]).{8,}$/;

const PASSWORD_ERROR_MESSAGE = `Password should pass next requirements: Minimum eight characters, at least one
  uppercase letter, one lowercase letter, one number and one special character
`;

export const dateDifferenceValidator = (fromName: string, toName: string) => (_value: Date | string, allValues: any) => {
  if (!allValues[fromName] || !allValues[toName]) {
    return undefined;
  }

  const dateFrom = moment(allValues[fromName]);
  const dateTo = moment(allValues[toName]);
  const duration = dateTo.diff(dateFrom, 'milliseconds');

  return duration < 0 ? 'Date To should be more than Date From' : undefined;
};

export const maxTimeframeValidator = (fromName: string, toName: string, maxPeriodMS: number) => (_value: Date | string, allValues: any) => {
  if (!allValues[fromName] || !allValues[toName]) {
    return undefined;
  }

  const dateFrom = moment(allValues[fromName]);
  const dateTo = moment(allValues[toName]);
  const duration = dateTo.diff(dateFrom, 'milliseconds');

  return duration > maxPeriodMS ? `Date/Time period should be less then ${maxPeriodMS / 60000} minutes` : undefined;
};

export const createFromToValidator = (fromKey: string, toKey: string) => (_value: number | string | undefined, allValues: any) => (
  allValues[fromKey] - allValues[toKey] > 0 ? 'Value To should be more than value From' : undefined
);

export const createDurationFromToValidator = (fromKey: string, toKey: string) => (_value: number | string | undefined, allValues: any) => (
  allValues[toKey] && (
    convertTimeToSeconds(allValues[fromKey], TimeSpanFormat.HHmmss) - convertTimeToSeconds(allValues[toKey], TimeSpanFormat.HHmmss) > 0
  ) ? 'Value To should be more than value From' : undefined
);

export const createRequiredValidator = (label: string) => (value: any) => (
  value ? undefined : `${label || 'Field'} is required.`
);

export const dateDiffValidatorByDays = (days: number, fromValue: Date | string | null) => (value: any) => {
  const dayDiff = getDateDiffInDays(fromValue, value);

  return (
    dayDiff < days ? undefined : `Can not select more than ${days} days range.`
  );
};

export const minDaysRangeValidator = (days: number, fromValue: Date | string | null) => (value: any) => {
  const dayDiff = getDateDiffInDays(fromValue, value);

  return (
    dayDiff >= days ? undefined : `Can not select less than ${days} day${days !== 1 ? 's' : ''} range.`
  );
};

export const notNegativeDigitValidator = (value?: string | number) => (
  !value || Number.parseFloat(value.toString()) >= 0 ? undefined : 'Should be positive or 0'
);

export const positiveDigitValidator = (value?: string | number) => (
  value && Number.parseFloat(value.toString()) > 0 ? undefined : 'Value should be more than 0'
);

export const createMinLengthValidator = (label: string, minLength: number) => (value: string) => (
  (value || '').length >= minLength ? undefined : `${label || 'Value'} length should be greater than ${minLength}`
);

export const composeValidators = (...validators: FieldValidator<string>[]) => (value: any, allValues: any) => {
  let error: string | undefined;

  validators.some((validator) => {
    error = validator(value, allValues);

    return error;
  });

  return error;
};

export const validateEmail = (value: string) => (EMAIL_REGEXP.test(value || '') ? undefined : 'Please make sure that email is correct');

export const validatePassword = (value: string) => (PASSWORD_REGEXP.test(value || '') ? undefined : PASSWORD_ERROR_MESSAGE);

export const validatePasswordConfirm = (value: string, allValues: any) => (
  allValues.password !== value ? 'Passwords should be equal' : undefined
);

export const validateIpAddress = (value: string | number | undefined) => (
  (IP_ADDRESS_REGEXP.test(String(value) || '') ? undefined : 'You have entered an invalid IP address!')
);
