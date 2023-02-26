import { of } from 'rxjs';
import { dataToAxiosResponse } from '../../../util/dataToAxiosResponse';

export function shouldNotifyJackpotState(spyTargets: any): void {
  jest.spyOn(spyTargets.groupRepository, 'findOneOrFail').mockResolvedValue({
    operator: {
      blueRibbonId: '<brId>',
    },
    blueRibbonGameId: '<brGid>',
    sessions: [{
      currency: 'USD',
      player: {
        cid: '<cid>',
      },
    }],
  });
  jest.spyOn(spyTargets.httpService, 'request').mockReturnValue(of(dataToAxiosResponse({
    data: {
      potStateDetails: [{
        potsState: [{
          lastChangeTimestamp: 1602753025002,
          amountInCurrency: [{ currency: 'USD', amount: 150 }],
        }],
      }],
    },
  })));
}