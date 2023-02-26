import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { EventLog } from '../../schemas';
import { EventLogsResponse } from './eventLog.interface';
import { EventLogsGetDto } from './dto';

@Injectable()
export class EventLogService {
  constructor(
        @InjectModel(EventLog.name) private readonly eventLogModel: Model<EventLog>,
  ) {}

  private makeFilters(filters: EventLogsGetDto): Record<string, any> {
    const findObject: any = {};
    if (filters.source) {
      let sourceArr: string[] | string = filters.source;
      if (!Array.isArray(sourceArr)) {
        sourceArr = [sourceArr];
      }
      findObject.source = { $in: sourceArr };
    }
    if (filters.type) {
      findObject.type = filters.type;
    }
    if (filters.dateFrom || filters.dateTo) {
      findObject.createdDate = {};
      if (filters.dateFrom) {
        findObject.createdDate.$gte = moment(filters.dateFrom).unix();
      }
      if (filters.dateTo) {
        findObject.createdDate.$lte = moment(filters.dateTo).unix();
      }
    }
    return findObject;
  }

  public async getEventLogs(sessionId: number, filters: EventLogsGetDto): Promise<EventLogsResponse> {
    const limit = Number(filters.take) || 20;
    const offset = Number(filters.offset) || 0;
    const findObj = this.makeFilters(filters);
    const logs = await this.eventLogModel.find({ 'parameters.sessionId': sessionId, ...findObj }).limit(limit).skip(offset);
    const total = await this.eventLogModel.countDocuments({ 'parameters.sessionId': sessionId, ...findObj });

    return {
      logs: logs.map(l => ({
        source: l.source,
        type: l.type,
        parameters: l.parameters,
        createdDate: new Date(l.createdDate),
      })),
      total,
    };
  }
}