import {
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EventLog extends Document {
  @Prop()
  public source: string;

  @Prop()
  public type: string;

  @Prop(raw({}))
  public parameters: Record<string, any>;

  @Prop()
  public createdDate: number;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
