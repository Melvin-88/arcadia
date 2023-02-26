import { AlertSeverity, AlertType } from '../types/alerts';

export const alertSeverityLabelMap: { [key in AlertSeverity]: string } = {
  [AlertSeverity.high]: 'High',
  [AlertSeverity.medium]: 'Medium',
  [AlertSeverity.low]: 'Low',
};

export const alertTypeLabelMap: { [key in AlertType]: string } = {
  [AlertType.information]: 'Information',
  [AlertType.warning]: 'Warning',
  [AlertType.alert]: 'Alert',
  [AlertType.critical]: 'Critical',
};
