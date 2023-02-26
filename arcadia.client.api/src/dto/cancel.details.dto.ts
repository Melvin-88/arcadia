import { IsDefined, IsOptional, Length } from 'class-validator';

export class CancelDetailsDto {
  @IsOptional()
  @Length(1, 200)
  correlationId: string;

  @Length(1, 200)
  eventIdToCancel: string;

  @IsOptional()
  @Length(1, 200)
  betAmount: string;

  @IsOptional()
  @Length(1, 200)
  playerCurrency: string;

  @Length(1, 200)
  gameId: string;

  @Length(1, 200)
  playerId: string;

  @IsOptional()
  @IsDefined()
  playerContributedAmountInCurrency: { amount: string; currency: string; rate: string; }[];
}