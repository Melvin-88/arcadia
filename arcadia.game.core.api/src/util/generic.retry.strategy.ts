import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export const genericRetryStrategy: (
  maxAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[],
) => (attempts: Observable<any>) => Observable<number> = (
  maxAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes: number[] = []) => (attempts: Observable<any>) => attempts
  .pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      if (retryAttempt > maxAttempts
        || excludedStatusCodes.find(e => e === error.status || e === error?.response?.status)) {
        return throwError(error);
      }
      return timer(retryAttempt * scalingDuration);
    }),
  );
