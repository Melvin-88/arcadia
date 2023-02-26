import { IsEnum } from 'class-validator';
import { RobotReportedStatus } from '../robot.reported.status';

export class Status {
  @IsEnum(RobotReportedStatus)
  public application: RobotReportedStatus;
}
