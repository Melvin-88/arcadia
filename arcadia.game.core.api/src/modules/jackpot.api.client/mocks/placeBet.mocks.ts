import { of } from 'rxjs';
import { dataToAxiosResponse } from '../../../util/dataToAxiosResponse';
import {BusEventType} from "../../event.bus/bus.event.type";

export const placeBetDataMock = {
  type: BusEventType.JACKPOT_CONTRIBUTE,
  session: {
    currency: 'EUR',
    currencyConversionRate: 1,
  },
  operator: {
    blueRibbonId: '<brId>'
  },
  group: {
    blueRibbonGameId: '<brGid>',
  },
  player: {
    cid: '<cid>',
  },
  round: {
    bet: 42,
  },
  machine: {},
};

export const fundingDetailsMock = {
  playerContributionPercentage: 100,
  fundingContributionType: 'FIXED',
  jackpotContributionValue: 150,
  operatorContributionPercentage: 0,
};

export function shouldPlaceBet(spyTargets: any): void {
  jest.spyOn(spyTargets.cacheManager, 'get').mockReturnValue(Promise.resolve(true));
  jest.spyOn(spyTargets.httpService, 'request').mockReturnValueOnce(of(dataToAxiosResponse({
    data: {
      players: [{
        jackpotGameIds: ['<brGid>'],
      }],
    },
  })));
  jest.spyOn(spyTargets.httpService, 'request').mockReturnValueOnce(of(dataToAxiosResponse({
    data: {
      games: [{
        fundingDetails: fundingDetailsMock,
      }],
    },
  })));
  jest.spyOn(spyTargets.httpService, 'request').mockReturnValue(of(dataToAxiosResponse({})));
  jest.spyOn(spyTargets.operatorClient, 'bet').mockResolvedValue({ transactionId: '<tId>' });
}
