import { ReportTypes } from '../../enums';

export interface ReportMessageDataInterface {
  reportType: ReportTypes,
  params: any,
  daysToCreate: string[],
}
