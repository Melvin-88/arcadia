import { ApiProperty } from '@nestjs/swagger';

export class SiteResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public name: string;
}

export class SitesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [SiteResponse] })
  public sites: SiteResponse[];
}
