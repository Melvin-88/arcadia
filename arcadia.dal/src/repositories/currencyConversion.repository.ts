import { EntityRepository, LessThanOrEqual, Repository } from 'typeorm';

import { CurrencyConversionEntity } from '../entities';

@EntityRepository(CurrencyConversionEntity)
export class CurrencyConversionRepository extends Repository<CurrencyConversionEntity> {
  public getCurrencyConversion(currency: string): Promise<CurrencyConversionEntity> {
    return this.findOneOrFail({
      currency,
      effectiveFrom: LessThanOrEqual(new Date()),
      isDeleted: false,
    },
    { order: { effectiveFrom: 'DESC' } },
    );
  }
}
