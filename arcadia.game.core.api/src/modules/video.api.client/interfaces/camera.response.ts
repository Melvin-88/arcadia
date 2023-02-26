export class CameraResponse {
  public id: string;
  public type: string;
  public machine?: string;
  public ip: string;
  public adminUrl: string;
  public adminUser: string;
  public adminPassword: string;
  public site: string;
  public location: string;
  public comments: string;
  public status: string;
  public isRecorded?: boolean;
  public liveStreamUrl: string;
  public consoleUrl: string;
  public rtsp: string;
}

export class CamerasResponse {
  public total: number;
  public cameras: CameraResponse[];
}
