export enum TimeSpanFormat {
  'mm' = 'mm',
  'mmss' = 'mm:ss',
  'HHmm' = 'HH:mm',
  'HHmmss' = 'HH:mm:ss',
}

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export interface ISortData {
  sortBy?: string
  sortOrder?: SortOrder
}

export interface ICommonRequestFiltersParams extends ISortData {
  take?: number
  offset?: number
}

export enum BinaryBoolean {
  true = '1',
  false = '0',
}
