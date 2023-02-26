import { IsInt } from 'class-validator';

export class PlayerActionDto {
  @IsInt()
  public sessionId: number;
}
