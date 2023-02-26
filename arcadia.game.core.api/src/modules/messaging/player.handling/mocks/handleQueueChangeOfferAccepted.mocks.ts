import { SessionStatus } from 'arcadia-dal';

export const handleQueueChangedSessionMock = {
    id: 1,
    player: { cid: '<cid>' },
    machine: { serial: '<serial>' },
    group: { operator: {} },
    isDisconnected: false,
    offeredQueueId: 32,
    queue: { id: 31 },
    status: SessionStatus.QUEUE,
};

export const handleQueueChangedQueueMock = { id: 32, machine: { group: {} } };

export function shouldAssignNewQueue(spyTargets: any): void {
    // @ts-ignore
    jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue(handleQueueChangedSessionMock);
    jest.spyOn(spyTargets.queueRepository, 'findOneOrFail').mockResolvedValue(handleQueueChangedQueueMock);
}

export function shouldThrowExceptionNotQueueStatus(spyTargets: any): void {
    // @ts-ignore
    jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue({ ...handleQueueChangedSessionMock, status: SessionStatus.PLAYING });
}