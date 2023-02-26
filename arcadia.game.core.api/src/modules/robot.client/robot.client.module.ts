import { Module } from '@nestjs/common';
import { RobotClientService } from './robot.client.service';

@Module({
  providers: [RobotClientService],
  exports: [RobotClientService],
})
export class RobotClientModule {

}