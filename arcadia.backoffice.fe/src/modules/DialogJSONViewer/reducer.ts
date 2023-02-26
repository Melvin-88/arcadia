import { createReducer } from '@reduxjs/toolkit';
import { mergeDialogJSONViewer, setDialogJSONViewer } from './actions';
import { IDialogJSONViewerReducer } from './types';

export const initialState: IDialogJSONViewerReducer = {
  isOpen: false,
  isEditing: false,
  isLoading: false,
  JSON: '{}',
  onSubmit: () => {},
};

export const dialogJSONViewerReducer = createReducer(initialState, (builder) => {
  builder.addCase(setDialogJSONViewer, (state, { payload }) => ({
    ...initialState,
    ...payload,
  }));
  builder.addCase(mergeDialogJSONViewer, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});
