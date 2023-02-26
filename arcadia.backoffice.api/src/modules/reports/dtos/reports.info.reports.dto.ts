import { ReportTypes } from 'arcadia-dal';
import { IsEnum } from 'class-validator';

export class ReportsInfoReportsDto {
  @IsEnum(ReportTypes)
  public reportType: ReportTypes;
}
