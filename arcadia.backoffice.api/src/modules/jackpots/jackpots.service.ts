/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { JackpotsResponse } from './jackpots.interface';
import { CreateJackpotDto, EditJackpotDto } from './jackpots.dto';

@Injectable()
export class JackpotsService {
  constructor() {}

  public async getJackpots(filters: any): Promise<JackpotsResponse> {
    // TODO: get

    return null;
  }

  public async createJackpot(data: CreateJackpotDto, contextId: number): Promise<void> {
    // TODO: create
  }

  public async editJackpot(data: EditJackpotDto, contextId: number): Promise<void> {
    // TODO: edit
  }

  public async activateJackpot(id: string, password: string, contextId: number): Promise<void> {
    // TODO: activate
    // TODO: Maybe add guard that would check if user provided correct password
  }

  public async stopJackpot(id: string, password: string, contextId: number): Promise<void> {
    // TODO: stop
    // TODO: Maybe add guard that would check if user provided correct password
  }
}
