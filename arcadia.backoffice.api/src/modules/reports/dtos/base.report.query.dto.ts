import { Transform } from 'class-transformer';
import {
  IsDefined, IsIn, IsNotEmpty, IsNumber, IsString, Matches,
} from 'class-validator';
import { IsValidReportDateRange } from './custom.validators/is.valid.report.date.range';

export class BaseReportQueryDto {
  @IsString()
  @IsDefined()
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
  public startDate: string;

  @IsString()
  @IsDefined()
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
  @IsValidReportDateRange()
  public endDate: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsDefined()
  public take: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsDefined()
  public offset: number;

  @IsString()
  @IsNotEmpty()
  public sortBy: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ASC', 'DESC'])
  public sortOrder: string;
}
