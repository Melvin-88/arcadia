import { IAppStoreSlice } from './types';

export const appStateSelector = ({ appReducer }: IAppStoreSlice) => appReducer;

export const sessionSelector = ({ appReducer }: IAppStoreSlice) => appReducer.session;

export const appLoaderSelector = ({ appReducer }: IAppStoreSlice) => appReducer.appLoader;

export const soundsConfigSelector = ({ appReducer }: IAppStoreSlice) => appReducer.soundsConfig;

export const resultDialogSelector = ({ appReducer }: IAppStoreSlice) => appReducer.resultDialog;

export const shortestQueueProposalSelector = ({ appReducer }: IAppStoreSlice) => appReducer.shortestQueueProposal;

export const isLostConnectionSelector = ({ appReducer }: IAppStoreSlice) => appReducer.isLostConnection;

export const quitConfirmDialogSelector = ({ appReducer }: IAppStoreSlice) => appReducer.quitConfirmDialog;
