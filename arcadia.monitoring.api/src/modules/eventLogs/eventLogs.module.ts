import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLog, EventLogSchema } from '../../schemas';
import { EventLogsController } from './eventLogs.controller';
import { EventLogService } from './eventLog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventLog.name, schema: EventLogSchema }]),
  ],
  exports: [],
  providers: [
    EventLogService,
  ],
  controllers: [
    EventLogsController,
  ],
})
export class EventLogsModule {}
