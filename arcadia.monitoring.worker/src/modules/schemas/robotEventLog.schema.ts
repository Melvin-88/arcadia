import {
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RobotEventLog extends Document {
  @Prop()
  public type: string;

  @Prop()
  public sessionId: number;

  @Prop()
  public machineSerial: string;

  @Prop(raw({}))
  public data: Record<string, any>;

  @Prop()
  public createdDate: number;
}

export const RobotEventLogSchema = SchemaFactory.createForClass(RobotEventLog);
