import { DeleteResult } from 'arcadia-dal';

export abstract class AbstractReportStrategy {
  public abstract processData(payload: any): Promise<void>;

  public abstract removeEmptyRecords(paramsHash: string): Promise<DeleteResult>;

  protected abstract getDataStream(payload: any);
}
