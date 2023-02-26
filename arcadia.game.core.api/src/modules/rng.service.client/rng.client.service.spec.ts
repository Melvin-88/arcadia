import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { makeTestModule } from './mocks/beforeAll.mock';
import { RngClientService } from './rng.client.service';
import { dataToAxiosResponse } from '../../util/dataToAxiosResponse';

jest.mock('../logger/logger.service');

describe('RNG Client Service (Unit)', () => {
  let rngClientService: RngClientService;
  let httpClient: HttpService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    rngClientService = moduleFixture.get<RngClientService>(RngClientService);
    httpClient = moduleFixture.get<HttpService>(HttpService);
  });

  describe('seed', () => {
    it('should call rng service to get seed data', async () => {
      const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(dataToAxiosResponse({ status: 'ok', seed: { a: 2, b: 4 } })));
      const result = await rngClientService.seed(1, 5, '<rtp>', []);
      expect(result).toMatchObject([['a', 2], ['b', 4]]);
      expect(getSpy).toBeCalledWith('/seed',
        {
          params: {
            groupId: 1,
            minimal_hold: 5,
            rtp_segment: '<rtp>',
            chips_on_table: '[]',
          },
        });
    });
    it('should empty array on no need to seed', async () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(dataToAxiosResponse({ status: 'err', msg: 'No need to seed' })));
      const result = await rngClientService.seed(1, 5, '<rtp>', []);
      expect(result).toMatchObject([]);
    });
  });

  describe('rtp', () => {
    it('should return rtp data', async () => {
      const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(dataToAxiosResponse({ status: 'ok', rtp: { a: 2, b: 4 } })));
      const result = await rngClientService.rtp(1, '<rtp>', []);
      expect(result).toMatchObject([['a', 2], ['b', 4]]);
      expect(getSpy).toBeCalledWith('/rtp',
        {
          params: {
            groupId: 1,
            rtp_segment: '<rtp>',
            seed: '[]',
          },
        });
    });
  });

  describe('phantom', () => {
    it('should return phantom chip data', async () => {
      const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(dataToAxiosResponse({ status: 'ok', prize: '<prize>' })));
      const result = await rngClientService.phantom(1, '<rtp>');
      expect(result).toBe('<prize>');
      expect(getSpy).toBeCalledWith('/phantom', {
        params: {
          groupId: 1,
          rtp_segment: '<rtp>',
        },
      },
      );
    });
  });
});