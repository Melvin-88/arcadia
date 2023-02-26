import { IsArray, IsInt } from 'class-validator';

export class IdsDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}