export class StreamResponse {
  public cameraId: string;
  public id: string;
  public server: string;
  public hlsUrl: string;
  public status: { isOn: boolean; isRecorded: boolean };
  public rtsp: string;
  public quality: string;
}

export class StreamsResponse {
  public total: number;
  public streams: StreamResponse[];
}
