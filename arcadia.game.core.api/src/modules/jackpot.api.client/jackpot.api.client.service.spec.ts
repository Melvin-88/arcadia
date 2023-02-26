import {HttpService, NotAcceptableException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {
    connectionNames,
    JwtTokenRepository,
    getRepositoryToken,
    CurrencyConversionRepository,
    GroupRepository,
    PlayerRepository,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import { makeTestModule } from './mocks/beforeAll.mock';
import { shouldSetTokenFromApi, shouldSetTokenFromDb } from './mocks/authorize.mocks';
import { JackpotApiClientService } from './jackpot.api.client.service';
import { WorkerClientService } from '../worker.client/worker.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { fundingDetailsMock, placeBetDataMock, shouldPlaceBet } from './mocks/placeBet.mocks';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import * as jwt from 'jsonwebtoken';
import { shouldCallLoginAnonymous } from './mocks/loginAnonymous.mocks';
import * as moment from 'moment';
import { shouldCallLoginPlayer } from './mocks/loginPlayer.mocks';
import {
    shouldPerformPayout,
    shouldThrowExceptionActiveSessionNotFound,
    shouldThrowExceptionPlayerNotFound
} from './mocks/jackpotWinCallback.mocks';

jest.mock('../logger/logger.service');
jest.mock('../config/config.service');

type CacheType = ReturnType<typeof CacheManager.caching>;

describe('Jackpot Api Client Service (Unit)', () => {
  let jackpotApiClientService: JackpotApiClientService;
  let httpService: HttpService;
  let jwtTokenRepository: JwtTokenRepository;
  let workerPublisher: WorkerClientService;
  let cacheManager: CacheType;
  let currencyConversionRepository: CurrencyConversionRepository;
  let groupRepository: GroupRepository;
  let playerPublisher: PlayerClientService;
  let playerRepository: PlayerRepository;
  let operatorClient: OperatorApiClientService;

  beforeAll(
    async () => {
      const moduleFixture = await makeTestModule();
      jackpotApiClientService = moduleFixture.get<JackpotApiClientService>(JackpotApiClientService);
      httpService = moduleFixture.get<HttpService>(HttpService);
      jwtTokenRepository = moduleFixture.get<JwtTokenRepository>(getRepositoryToken(JwtTokenRepository, connectionNames.DATA));
      workerPublisher = moduleFixture.get<WorkerClientService>(WorkerClientService);
      cacheManager = moduleFixture.get<CacheType>(REDIS_CACHE);
      currencyConversionRepository = moduleFixture.get<CurrencyConversionRepository>(getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA));
      groupRepository = moduleFixture.get<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA));
      playerPublisher = moduleFixture.get<PlayerClientService>(PlayerClientService);
      operatorClient = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
      playerRepository = moduleFixture.get<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA));
    },
  );

  describe('authorize', () => {
    it('should set api token from db if there is none locally', async () => {
      shouldSetTokenFromDb({ jwtTokenRepository, cacheManager });
      const spyHttpRequest = jest.spyOn(httpService, 'request');
      await jackpotApiClientService.authorize();
      expect(spyHttpRequest).toBeCalledTimes(0);
    });
    it('should set api token and save to db from api response', async () => {
      shouldSetTokenFromApi({ jwtTokenRepository, httpService, cacheManager });
      const spyWorkerPublisher = jest.spyOn(workerPublisher, 'stopJackpotReloginTimeout');
      await jackpotApiClientService.authorize();
      expect(spyWorkerPublisher).toBeCalled();
    });
  });

  describe('contribute', () => {
      it('should call placeBet method and bet on operator side', async () => {
          shouldPlaceBet({ httpService, cacheManager, operatorClient });
          const spyHttpRequest = jest.spyOn(httpService, 'request');
          // @ts-ignore
          await jackpotApiClientService.contribute(placeBetDataMock);
          expect(spyHttpRequest).toBeCalledWith(expect.objectContaining({
              method: 'POST',
              url: '/bet/async/placeBet',
              data: {
                  operatorId: placeBetDataMock.operator.blueRibbonId,
                  playerDetails: {
                      playerId: placeBetDataMock.player.cid,
                  },
                  wagerDetails: {
                      amount: placeBetDataMock.round.bet,
                      currencySymbol: placeBetDataMock.session.currency,
                  },
                  gameDetails: {
                      gameId: placeBetDataMock.group.blueRibbonGameId,
                  },
                  jackpotContributionDetails: {
                      totalContributionAmount: fundingDetailsMock.jackpotContributionValue,
                      fundingDetails: {
                          operatorContributionAmount: 0,
                          playerContributionAmount: fundingDetailsMock.jackpotContributionValue,
                      },
                  },
              },
          }));
      });
  });

  describe('jackpotWinCallback', () => {
      it('should throw exception if player is not found', async () => {
          shouldThrowExceptionPlayerNotFound({ playerRepository });
          try {
              // @ts-ignore
              await jackpotApiClientService.jackpotWinCallback({ winnerDetails: { playerCurrency: 'USD', amountInCurrency: null, playerId: '<cid>' } });
              expect(true).toBe(false);
          } catch (e) {
              expect(e).toBeInstanceOf(NotFoundException);
          }
      });
      it('should throw exception if active session not found', async () => {
          shouldThrowExceptionActiveSessionNotFound({ playerRepository });
          try {
              // @ts-ignore
              await jackpotApiClientService.jackpotWinCallback({ winnerDetails: { playerCurrency: 'USD', amountInCurrency: null, playerId: '<cid>' } });
              expect(true).toBe(false);
          } catch (e) {
              expect(e).toBeInstanceOf(NotAcceptableException);
          }
      });
      it('should perform payout and notify player of new balance', async () => {
          shouldPerformPayout({ playerRepository, operatorClient });
          const notifyBalanceSpy = jest.spyOn(playerPublisher, 'notifyBalance');
          const payoutSpy = jest.spyOn(operatorClient, 'payout');
          // @ts-ignore
          await jackpotApiClientService.jackpotWinCallback({ winnerDetails: { playerCurrency: 'USD', amountInCurrency: [{ currency: 'USD', amount: '100', rate: '1' }], playerId: '<cid>' } });
          expect(payoutSpy).toBeCalledWith(expect.any(String), '<connId>', '<cid>', 100, null, '42', null, false);
          expect(notifyBalanceSpy).toBeCalledWith(2, { valueInCash: 500 });
      });
  });

  describe('loginAnonymous', () => {
     it('should throw exception if token is invalid', async () => {
         const invalidToken = jwt.sign({ playerId: 1, exp: moment().subtract(2, 'h').unix() }, '<authSecret>');
         try {
             await jackpotApiClientService.loginAnonymous(invalidToken);
             expect(true).toBe(false);
         } catch (e) {
             expect(e).toBeInstanceOf(UnauthorizedException);
         }
     });
     it('should call login anonymous method', async () => {
         shouldCallLoginAnonymous({ httpService });
         const spyHttpRequest = jest.spyOn(httpService, 'put');
         const token = jwt.sign({ playerId: 1 }, '<authSecret>');
         const result = await jackpotApiClientService.loginAnonymous(token);
         expect(result).toEqual({ test: 'test' });
         expect(spyHttpRequest).toBeCalledWith('<url>/auth/login/anonymous', {
             authenticationData: {
                 authenticationKey: '<authKey>',
                 authenticationSecret: '<authSecret>',
             },
         });
     })
  });

    describe('loginPlayer', () => {
        it('should throw exception if token is invalid', async () => {
            const invalidToken = jwt.sign({ playerId: 1, exp: moment().subtract(2, 'h').unix() }, '<authSecret>');
            try {
                await jackpotApiClientService.loginPlayer(invalidToken);
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
            }
        });
        it('should call login player method', async () => {
            shouldCallLoginPlayer({ httpService });
            const spyHttpRequest = jest.spyOn(httpService, 'put');
            const token = jwt.sign({ playerId: 1 }, '<authSecret>');
            const result = await jackpotApiClientService.loginPlayer(token);
            expect(result).toEqual({ test: 'test', playerId: 1 });
            expect(spyHttpRequest).toBeCalledWith('<url>/auth/login/player', {
                authenticationData: {
                    authenticationKey: '<authKey>',
                    authenticationSecret: '<authSecret>',
                    playerId: 1,
                },
            });
        })
    });
});
