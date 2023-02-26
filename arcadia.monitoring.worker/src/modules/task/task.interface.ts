import { PerformanceIndicatorEntity, ViolatedThreshold } from 'arcadia-dal';

export interface AlertData {
    description: string;
    violatedThreshold: ViolatedThreshold;
    currentValue: number;
    indicator: PerformanceIndicatorEntity;
    machineSerial?: string;
    machineId?: number;
}
