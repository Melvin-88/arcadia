import {
  HttpException, HttpService, HttpStatus, Injectable,
} from '@nestjs/common';
import { ActivateMachineDto } from '../machines/dtos/activate.machine.dto';
import { ReassignMachineDto } from '../machines/dtos/reassign.machine.dto';

@Injectable()
export class GameCoreClientService {
  constructor(private readonly gameCoreApi: HttpService) {
  }

  public startMachine(machineId: number, data: ActivateMachineDto, correlationId: string): Promise<any> {
    return this.gameCoreApi.post(`/machine/${machineId}/start`, data,
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data);
  }

  public reassignMachine(
    machineId: number, data: ReassignMachineDto, correlationId: string,
  ): Promise<ReassignMachineDto> {
    return this.gameCoreApi.post<ReassignMachineDto>(`/machine/${machineId}/reassign`, data,
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data);
  }

  public machineReboot(machineId: number, correlationId: string): Promise<any> {
    return this.gameCoreApi.post(`/machine/${machineId}/reboot`, {},
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data)
      .catch(reason => {
        throw new HttpException(reason.response.data.data, reason.response.status);
      });
  }

  public groupSoftStop(groupId: number, correlationId: string, machineIds: number[] = []): Promise<any> {
    return this.gameCoreApi.post(`/group/${groupId}/softStop`, { machineIds },
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data)
      .catch(reason => {
        throw new HttpException(reason.response.data.data, reason.response.status);
      });
  }

  public groupHardStop(groupId: number, correlationId: string, machineIds?: number[]): Promise<any> {
    return this.gameCoreApi.post(`/group/${groupId}/hardStop`,
      machineIds?.length ? { machineIds } : undefined,
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data)
      .catch(reason => {
        throw new HttpException(reason.response?.data?.data || { message: 'Fatal' },
          reason.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public terminateSession(sessionId: number, correlationId: string): Promise<any> {
    return this.gameCoreApi.post(`/session/${sessionId}/terminate`, {},
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data)
      .catch(reason => {
        throw new HttpException(reason.response.data.data, reason.response.status);
      });
  }

  public getVideoToken(siteId: number): Promise<string> {
    return this.gameCoreApi.get(`/video/token/${siteId}`, {})
      .toPromise()
      .then(value => value.data.token)
      .catch(reason => {
        throw new HttpException(reason.response.data.data, reason.response.status);
      });
  }
}
