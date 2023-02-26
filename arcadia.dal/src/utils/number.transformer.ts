import { ValueTransformer } from 'typeorm';

export class NumberTransformer implements ValueTransformer {
  // eslint-disable-next-line class-methods-use-this
  public to(data?: number | string | null): number | string | null {
    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  public from(data?: string | number): number | null {
    const value = parseFloat(data as string);
    if (Number.isNaN(value)) {
      return null;
    }
    return value;
  }
}
