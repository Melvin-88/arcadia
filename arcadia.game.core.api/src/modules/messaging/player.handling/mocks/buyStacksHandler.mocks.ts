import {MachineStatus, SessionStatus} from 'arcadia-dal';

export const buyStacksHandlerSessionMock = {
  id: 1,
  queue: { id: 2 },
  currency: 'EUR',
  currencyConversionRate: 1,
  group: { blueRibbonGameId: '<BRGameId>', denominator: 100, operator: { id: 2, blueRibbonId: '<BRId>' } },
  player: { cid: '<cid>' },
  machine: { serial: '<serial>' },
};

export function shouldThrowExceptionBuyUnexpected(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue({ status: SessionStatus.QUEUE });
}

export function shouldDisengageRebuyRejected(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue({ status: SessionStatus.RE_BUY });
}

export function shouldDisengageNotEnoughMoney(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue({ id: 1, currencyConversionRate: 1, status: SessionStatus.RE_BUY });
  jest.spyOn(spyTargets.operatorClient, 'balance').mockResolvedValue({ balance: 0 });
  jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ id: 1, status: MachineStatus.READY });
}

export function shouldHandleViewerSession(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOneOrFail').mockResolvedValue({ id: 1, currencyConversionRate: 1, status: SessionStatus.VIEWER });
  jest.spyOn(spyTargets.operatorClient, 'balance').mockResolvedValue({ balance: 32200 });
  jest.spyOn(spyTargets.jackpotClientService, 'getContribution').mockResolvedValue({ totalContributionAmount: 1 });
  jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ id: 1, status: MachineStatus.READY });
}
