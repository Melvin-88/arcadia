export interface PerformanceIndicatorInterface {
  id: number;
  status: string;
  segment: string;
  segmentSubset: Record<string, any>;
  mode: string;
  metric: string;
  dimension: string;
  targetValue: number;
  currentValue: number;
  alertLowThreshold: number;
  alertHighThreshold: number;
  cutoffLowThreshold: number;
  cutoffHighThreshold: number;
}
