import { of } from 'rxjs';
import { dataToAxiosResponse } from '../../../util/dataToAxiosResponse';

export function shouldSetTokenFromDb(spyTargets: any) {
  // @ts-ignore
  jest.spyOn(spyTargets.jwtTokenRepository, 'findOne').mockReturnValue(Promise.resolve({ token: '<db-token>' }));
  jest.spyOn(spyTargets.cacheManager, 'get').mockResolvedValue(true);
  jest.spyOn(spyTargets.jwtTokenRepository.manager, 'transaction').mockImplementation(async (cb: Function) => {
    await cb({ getCustomRepository: () => spyTargets.jwtTokenRepository });
  });
}

export function shouldSetTokenFromApi(spyTargets: any) {
  jest.spyOn(spyTargets.jwtTokenRepository, 'findOne').mockReturnValue(Promise.resolve(null));
  jest.spyOn(spyTargets.cacheManager, 'get').mockResolvedValue(true);
  jest.spyOn(spyTargets.jwtTokenRepository.manager, 'transaction').mockImplementation(async (cb: Function) => {
    await cb({ getCustomRepository: () => spyTargets.jwtTokenRepository, save: () => {} });
  });
  jest.spyOn(spyTargets.httpService, 'request').mockReturnValue(of(dataToAxiosResponse({
    data: {
      userJWT: '<api-token>',
    },
  })));
}