import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export class MachineStartResponseDto {
  @ApiResponseProperty()
  machineId: number;

  @ApiPropertyOptional()
  correlationId?: string;
}