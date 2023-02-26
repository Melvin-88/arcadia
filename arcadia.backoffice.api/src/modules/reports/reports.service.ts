import {
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ReportTypes,
  ReportsInfoResponse,
  connectionNames,
  ProcessedReportRepository,
  InjectRepository,
} from 'arcadia-dal';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(HttpService) private readonly monitoringApi: HttpService,
    @InjectRepository(ProcessedReportRepository, connectionNames.DATA)
    private readonly processedReportRepository: ProcessedReportRepository,
  ) {
  }

  public async getReport<DTO, RESPONSE>(filters: DTO, reportType: ReportTypes): Promise<RESPONSE> {
    try {
      const response = await this.monitoringApi.get(`/api/report/${reportType}`, {
        params: filters,
        timeout: 10000,
      }).toPromise();

      return response.data;
    } catch (e) {
      throw new InternalServerErrorException(e.message || 'Something went wrong!');
    }
  }

  public async getReportsInfo(reportType: ReportTypes, filters: any): Promise<ReportsInfoResponse> {
    return this.processedReportRepository.getReportsInfo(reportType, filters);
  }
}
