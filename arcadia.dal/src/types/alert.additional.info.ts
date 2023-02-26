import { ViolatedThreshold } from '../enums';
import { PerformanceIndicatorSubsegment } from './performance.indicator.subsegment';

export interface AlertAdditionalInfo {
    maintenanceRequired?: boolean;
    maintenanceType?: string;
    machineId?: number;
    machineSerial?: string;
    machineName?: string;
    chipType?: number;
    dispenserName?: string;
    violatedThreshold?: ViolatedThreshold;
    indicatorId?: number;
    metric?: string;
    segment?: string;
    subsegment?: PerformanceIndicatorSubsegment;
    attribution?: string;
    dimensionId?: number;
    dimensionName?: string;
    value?: number;
}