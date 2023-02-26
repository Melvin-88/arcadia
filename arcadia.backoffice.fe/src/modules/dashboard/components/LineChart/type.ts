export type ILineChartItem = { [key in string]: null | string | number };

export type ILineChartItems = ILineChartItem[];

export interface IDataKey {
  key: string
  color: string
}

export type IDataKeys = IDataKey[];
