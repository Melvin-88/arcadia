export interface IDialogJSONViewer {
  isOpen: boolean
  isEditing: boolean
  isLoading: boolean
  JSON: string
  onSubmit: (json: string) => void
}

export interface IDialogJSONViewerReducer extends IDialogJSONViewer {
}

export interface IDialogJSONViewerSlice {
  dialogJSONViewerReducer: IDialogJSONViewerReducer
}
