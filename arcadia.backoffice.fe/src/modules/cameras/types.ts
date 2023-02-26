import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum CameraStatus {
  online = 'online',
  offline = 'offline',
  unknown = 'unknown'
}

export enum CameraAction {
  remove,
  reset,
}

export interface ICamerasFiltersPropsPanelValues {
  id?: string
  machine?: string
  status?: CameraStatus[]
  cameraIp?: string
  recordingStatus?: boolean
  type?: boolean
  site?: boolean
}

export type SiteId = number;

interface ISite {
  id: SiteId
  createDate: string
  isDeleted: boolean
  name: string
  updateDate: string
}

export type CameraId = string;

export interface ICamera {
  id: CameraId
  type: string
  machine: string
  ip: string
  adminUrl: string
  adminUser: string
  adminPassword: string
  site: ISite
  comments: string
  status: CameraStatus
  isRecorded: true
  liveStreamUrl: string
  consoleUrl: string
  rtsp: string
}

export interface ICamerasFiltersPanelValues {
  id?: string
  machine?: string
  cameraIp?: string
  recordingStatus?: string
  type?: string
  site?: string
}

export interface IStream {
  id: string
  cameraId: CameraId
  server: string
  hlsUrl: string
  rtsp: string
}

export interface ISelectedCamera {
  id: CameraId
}

export type ICameras = ICamera[];

export type IStreams = IStream[];

export type ICamerasStreamsMatrix = IStreams[];

export interface IGetCamerasStreamsSuccess {
  streamAuthToken: string
  streams: ICamerasStreamsMatrix
}

export type ISelectedCameras = ISelectedCamera[];

export interface IGetCamerasStreamsRequest {
  site: string
  id: CameraId
}

export interface IGetCamerasStreams {
  site: string
  ids: ISelectedCameras
}

export interface IGetStreamsData {
  site: string
  id: CameraId
}

export interface IPostCamera {
  id: string
  type: string
  ip: string
  port: number
  adminPort: number
  adminUrl: string
  adminUser: string
  adminPassword: string
}

export interface IPostCameraRequestBody {
  site: string
  camera: IPostCamera
}

export interface IChangeRecordingRequestBody {
  id: CameraId
  isRecorded: boolean
  site: string
}

export interface IPostCameraResponseBody extends ICamera {
}

export interface IGetCamerasRequestFiltersParams extends ICommonRequestFiltersParams, ICamerasFiltersPanelValues {
  site?: string
}

export interface IGetCamerasStreamsResponseBody {
  total: number
  streams: IStream
}

export interface IGetRecordingResponseBody {
  url: string
}

export interface IGetStreamAuthTokenResponseBody {
  token: string
}

export interface IGetCamerasResponseBody {
  total: number
  cameras: ICameras
}

export interface ICameraActionRequestBody {
  site: string
  id: string
}

export interface ICameraDialogFormState {
  isOpen: boolean
  isLoading?: boolean
}

export interface ICamerasDialogWatchState {
  isOpen: boolean
  isLoading?: boolean
  streamAuthToken: string
  streams: ICamerasStreamsMatrix
}

export interface IGetCameraStream {
  camera: null | ICamera
}

export interface ICameraDialogStreamState {
  isOpen: boolean
  isLoading?: boolean
  camera: null | ICamera
  streamAuthToken: string
}

export interface ICameraDialogActionState {
  id: CameraId
  action: CameraAction
  isOpen: boolean
  isLoading?: boolean
}

export interface ICameraDialogChangeRecordingState {
  id: CameraId
  isOpen: boolean
  isRecorded: boolean
  isLoading: boolean
}

export interface ICameraDialogGetRecordingState {
  id: CameraId
  isOpen: boolean
  isLoading: boolean
}

export interface IGetRecordingRequestBody {
  id: CameraId
  site: string
  toDateTime: number
  fromDateTime: number
}

export interface ICamerasReducer extends IGetCamerasResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly selectedCameras: ISelectedCameras
  readonly dialogForm: ICameraDialogFormState
  readonly dialogWatch: ICamerasDialogWatchState
  readonly dialogStream: ICameraDialogStreamState
  readonly dialogAction: ICameraDialogActionState
  readonly dialogChangeRecording: ICameraDialogChangeRecordingState
  readonly dialogGetRecording: ICameraDialogGetRecordingState
}

export interface ICamerasSlice {
  camerasReducer: ICamerasReducer
}
