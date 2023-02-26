import * as _ from 'lodash';

export function omitReportParams(params: Record<string, any>): Record<string, any> {
  return _.omit(params, ['startDate', 'endDate', 'take', 'offset', 'sortBy', 'sortOrder']);
}
