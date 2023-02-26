import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { OperatorApiClientService } from './operator.api.client.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import { AuthData } from './dto/authData';
import { BalanceData } from './dto/balanceData';
import { dataToAxiosResponse } from '../../util/dataToAxiosResponse';

jest.mock('../logger/logger.service');

describe('Operator Api Client Service (Unit)', () => {
  let operatorApiClientService: OperatorApiClientService;
  let httpService: HttpService;

  beforeAll(
    async () => {
      const moduleFixture = await makeTestModule();
      operatorApiClientService = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
      httpService = moduleFixture.get<HttpService>(HttpService);
    },
  );

  describe('authPlayer', () => {
    it('should return player data', async done => {
      const playerData: AuthData = {
        cid: '<cid>',
        playerToken: '<token>',
        bets: 5,
        wins: 5,
        lastSessionDate: new Date(),
      };
      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(dataToAxiosResponse(playerData)));
      operatorApiClientService.auth('<corr>', 42, '<sid>').subscribe(data => {
        expect(postSpy).toBeCalledWith('operator/42/auth', { authToken: '<sid>' },
          { headers: { correlation: '<corr>' } });
        expect(data).toMatchObject(playerData);
        done();
      });
    });
  });

  describe('playerBalance', () => {
    it('should return player balance', async () => {
      const playerBalance: BalanceData = {
        cid: '<cid>',
        balance: 322,
        currencyCode: 'USD',
      };
      const getSpy = jest.spyOn(httpService, 'get').mockReturnValue(of(dataToAxiosResponse(playerBalance)));
      const balance = await operatorApiClientService.balance('<corr>', 42, '<cid>', '<token>');
      expect(getSpy).toBeCalledWith('operator/42/balance', {
        params: {
          cid: '<cid>',
          playerToken: '<token>',
        },
        headers: { correlation: '<corr>' },
      });
      expect(balance).toMatchObject(playerBalance);
    });
  });

  describe('wager', () => {
    it('should return wager data', async () => {
      const wagerData = {
        cid: '<cid>',
        wager: '<wager>',
      };
      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(dataToAxiosResponse(wagerData)));
      const response = await operatorApiClientService.bet('<corr>', 42, '<cid>', 50);
      expect(postSpy).toBeCalledWith('operator/42/wager', { cid: '<cid>', amount: 50 },
        {
          headers: { correlation: '<corr>' },
        },
      );
      expect(response).toMatchObject(wagerData);
    });
  });

  describe('cancelWager', () => {
    it('should cancel wager', async done => {
      const responseData = {
        cid: '<cid>',
        status: '<status>',
      };
      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(dataToAxiosResponse(responseData)));
      operatorApiClientService.cancelBet('<corr>', 42, '<cid>').subscribe(data => {
        expect(postSpy).toBeCalledWith('operator/42/cancelWager', { cid: '<cid>' },
          {
            headers: { correlation: '<corr>' },
          },
        );
        expect(data).toMatchObject(responseData);
        done();
      });
    });
  });

  describe('payout', () => {
    it('should perform payout', async done => {
      const responseData = {
        cid: '<cid>',
        payout: 100,
      };
      const postSpy = jest.spyOn(httpService, 'post').mockReturnValue(of(dataToAxiosResponse(responseData)));
      operatorApiClientService.payout('<corr>', 42, '<cid>', responseData.payout).subscribe(data => {
        expect(postSpy).toBeCalledWith('operator/42/payout', { cid: '<cid>', amount: responseData.payout },
          {
            headers: { correlation: '<corr>' },
          },
        );
        expect(data).toMatchObject(responseData);
        done();
      });
    });
  });
});
