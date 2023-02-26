import { GroupStatus, OperatorStatus } from 'arcadia-dal';
import { Repository } from 'typeorm';

export function shouldReturnTokenMocks(spyTargets: any) {
// @ts-ignore
  jest.spyOn(spyTargets.operatorRepository, 'findOne').mockReturnValue(Promise.resolve({
    id: 1,
    status: OperatorStatus.ENABLED,
    configuration: {
      countryWhitelist: [],
    },
    blueRibbonId: '<brId>',
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.groupRepository, 'findOne').mockReturnValue(Promise.resolve({
    id: 1,
    denominator: 10,
    status: GroupStatus.IN_PLAY,
  }));
  // @ts-ignore
  jest.spyOn(spyTargets.machineRepository, 'getMachineForNewSession').mockResolvedValueOnce({
    id: 1,
  });
  // @ts-ignore
  jest.spyOn(spyTargets.operatorApiClientService, 'getBalance').mockResolvedValue({
    cid: '1',
    balance: 322,
    currencyCode: 'EUR',
  });
  // @ts-ignore
  jest.spyOn(spyTargets.playerRepository, 'findOne').mockReturnValue(Promise.resolve({
    cid: '1',
  }));
  jest.spyOn(spyTargets.operatorApiClientService, 'auth').mockResolvedValue({ cid: '1', playerToken: '<token>', currencyCode: 'EUR' });
}

export function operatorNotFoundMock(spyTargets: any) {
  jest.spyOn(spyTargets.operatorRepository, 'findOne').mockResolvedValue(null);
}

export function operatorAuthFailedMock(spyTargets: any) {
  jest.spyOn(spyTargets.operatorRepository, 'findOne').mockReturnValue(Promise.resolve({
    id: 1,
    status: OperatorStatus.ENABLED,
    configuration: {
      countryWhitelist: [],
    },
    blueRibbonId: '<brId>',
  }));
  jest.spyOn(spyTargets.operatorApiClientService, 'auth').mockRejectedValue({});
}
