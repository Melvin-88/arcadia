import { ApiProperty } from '@nestjs/swagger';
import { SiteEntity } from 'arcadia-dal';

export class CameraResponse {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public type: string;

    @ApiProperty()
    public machine?: string;

    @ApiProperty()
    public ip: string;

    @ApiProperty()
    public adminUrl: string;

    @ApiProperty()
    public adminUser: string;

    @ApiProperty()
    public adminPassword: string;

    @ApiProperty({ type: SiteEntity })
    public site: SiteEntity;

    @ApiProperty()
    public comments: string;

    @ApiProperty()
    public status: string;

    @ApiProperty()
    public isRecorded?: boolean;

    @ApiProperty()
    public liveStreamUrl: string;

    @ApiProperty()
    public consoleUrl: string;

    @ApiProperty()
    public rtsp: string;
}

export class CamerasResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [CameraResponse] })
    public cameras: CameraResponse[];
}

export class StreamResponse {
    @ApiProperty()
    public cameraId: string;

    @ApiProperty()
    public id: string;

    @ApiProperty()
    public server: string;

    @ApiProperty()
    public hlsUrl: string;

    @ApiProperty()
    public status: { isOn: boolean; isRecorded: boolean };

    @ApiProperty()
    public rtsp: string;

    @ApiProperty()
    public quality: string;
}

export class StreamsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [StreamResponse] })
    public streams: StreamResponse[];
}

export class RecordingResponse {
    @ApiProperty()
    public url: string;
}

export class StreamAuthTokenResponse {
    @ApiProperty()
    public token: string;
}
