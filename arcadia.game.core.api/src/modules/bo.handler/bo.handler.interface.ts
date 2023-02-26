import { ApiProperty } from '@nestjs/swagger';

export class VideoApiTokenResponse {
    @ApiProperty()
    public token: string;
}
