import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { JackpotsController } from './jackpots.controller';
import { JackpotsService } from './jackpots.service';

@Module({
  imports: [
    LoggerModule,
  ],
  controllers: [JackpotsController],
  providers: [JackpotsService],
})
export class JackpotsModule {}
