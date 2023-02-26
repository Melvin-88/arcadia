import { createAction } from '@reduxjs/toolkit';
import {
  IGetMachinesRequestFiltersParams,
  IGetMachinesResponseBody,
  IMachineDialogActionState,
  IMachineActionRequestBody,
  MachineAction,
  IPostMachineRequestBody,
  IPutMachineRequestBody,
  IMachineDialogFormState,
  IMachineDialogActivateState,
  IActivateRequestBody,
  IMachineDialogReassignState,
  IMachineReassignRequestBody,
} from '../types';

export interface IExecuteActionPayload extends IMachineActionRequestBody {
  action: MachineAction
}

export const postMachine = createAction<IPostMachineRequestBody>('MACHINES/POST_MACHINE');

export const getMachines = createAction<IGetMachinesRequestFiltersParams>('MACHINES/GET_MACHINES');
export const getMachinesSuccess = createAction<IGetMachinesResponseBody>('MACHINES/GET_MACHINES/SUCCESS');
export const getMachinesError = createAction('MACHINES/GET_MACHINES/ERROR');

export const putMachine = createAction<IPutMachineRequestBody>('MACHINES/PUT_MACHINE');

export const setMachinesDialogForm = createAction<Partial<IMachineDialogFormState> | undefined>('MACHINES/SET_DIALOG_FORM');
export const mergeMachinesDialogForm = createAction<Partial<IMachineDialogFormState> | undefined>('MACHINES/MERGE_DIALOG_FORM');

export const setMachinesDialogAction = createAction<Partial<IMachineDialogActionState> | undefined>('MACHINES/SET_DIALOG_ACTION');
export const mergeMachinesDialogAction = createAction<Partial<IMachineDialogActionState> | undefined>('MACHINES/MERGE_DIALOG_ACTION');
export const executeMachinesAction = createAction<IExecuteActionPayload>('MACHINES/EXECUTE_ACTION');

export const setDialogActivateMachine = createAction<Partial<IMachineDialogActivateState> | undefined>('MACHINES/SET_ACTIVATE_DIALOG');
export const mergeDialogActivateMachine = createAction<Partial<IMachineDialogActivateState> | undefined>('MACHINES/MERGE_ACTIVATE_DIALOG');
export const activateMachine = createAction<IActivateRequestBody>('MACHINES/ACTIVATE_MACHINE');

export const setDialogReassignMachine = createAction<Partial<IMachineDialogReassignState> | undefined>('MACHINES/SET_REASSIGN_DIALOG');
export const mergeDialogReassignMachine = createAction<Partial<IMachineDialogReassignState> | undefined>('MACHINES/MERGE_REASSIGN_DIALOG');
export const reassignMachine = createAction<IMachineReassignRequestBody>('MACHINES/REASSIGN');

export const exportMachines = createAction<IGetMachinesRequestFiltersParams>('MACHINES/EXPORT');
export const exportMachinesSuccess = createAction('MACHINES/EXPORT/SUCCESS');
export const exportMachinesError = createAction('MACHINES/EXPORT/ERROR');
