import { of } from 'rxjs';
import { dataToAxiosResponse } from '../../../util/dataToAxiosResponse';

export function shouldCallLoginAnonymous(spyTargets: any): void {
    jest.spyOn(spyTargets.httpService, 'put').mockReturnValue(of(dataToAxiosResponse({
         test: 'test',
    })));
}
