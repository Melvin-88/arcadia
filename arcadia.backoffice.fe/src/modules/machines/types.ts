import { ICommonRequestFiltersParams } from 'arcadia-common-fe';

export enum MachineStatus {
  ready = 'ready',
  inPlay = 'in-play',
  seeding = 'seeding',
  preparing = 'preparing',
  shuttingDown = 'shutting-down',
  stopped = 'stopped',
  offline = 'offline',
  onHold = 'onHold',
  error = 'error',
}

export enum QueueStatus {
  inPlay = 'in-play',
  ready = 'ready',
  drying = 'drying',
  stopped = 'stopped',
}

export enum MachineAction {
  dry,
  shutdown,
  remove,
  reboot,
}

export type MachineId = number;

export interface IMachine {
  id: MachineId
  status: MachineStatus
  queueStatus: QueueStatus
  name: string
  groupName: string
  siteName: string
  viewers: number
  inQueue: number
  uptime: number | null
  serial: string
  cameraID: string
  controllerIP: string | null
  location: string
  videoLink: string
  lastDiagnosticDate: string | null
  configuration: {
    brand: string
    model: string
    dispensers: {}
    video_crop_margins: {
      top: number
      bottom: number
      left: number
      right: number
    }
  },
  chipsOnTable: {}
}

export type IMachines = IMachine[];

export interface IMachinesFiltersPanelValues {
  id?: MachineId
  status?: MachineStatus[]
  name?: string | string[]
  groupName?: string | string[]
  site?: string | string[]
  viewers?: number
  inQueue?: number
  uptime?: number
  videoLink?: string
}

export interface IGetMachinesRequestFiltersParams extends ICommonRequestFiltersParams, IMachinesFiltersPanelValues {
}

export interface IGetMachinesResponseBody {
  total: number
  machines: IMachines
}

export interface IMachineActionRequestBody {
  id: MachineId
}

export interface IActivateRequestBody {
  id: MachineId
  resetTableState: boolean
  resetDispensers: boolean
}

export interface IMachineReassignRequestBody {
  id: MachineId
  groupId: number
  rtpSegment: string
}

export interface IMachineRebootRequestBody {
  id: MachineId
}

export interface IMachineDialogActionState {
  id: MachineId | null
  action: MachineAction
  isOpen: boolean
  isLoading?: boolean
}

export interface IMachineDialogActivateState {
  id: MachineId | null
  isOpen: boolean
  isLoading?: boolean
}

export interface IMachineDialogReassignState {
  id: MachineId | null
  isOpen: boolean
  isLoading: boolean
}

export interface IMachinesSlice {
  machinesReducer: IMachinesReducer
}

export interface IPostMachineRequestBody extends IMachine {
  password: string
}

export interface IPutMachineRequestBody extends IMachine {
  password: string
}

export interface IMachineDialogFormState {
  isOpen: boolean
  isLoading?: boolean
  initialValues?: IMachine
}

export interface IMachinesReducer extends IGetMachinesResponseBody {
  readonly isLoading: boolean
  readonly isExporting: boolean
  readonly dialogForm: IMachineDialogFormState
  readonly dialogAction: IMachineDialogActionState
  readonly dialogActivate: IMachineDialogActivateState
  readonly dialogReassign: IMachineDialogReassignState
}
