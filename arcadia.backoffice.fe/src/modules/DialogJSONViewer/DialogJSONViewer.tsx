import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  Form,
  Button,
  ButtonColor,
  Dialog,
  IDialogProps,
  JSONEditorField,
} from 'arcadia-common-fe';
import { setDialogJSONViewer } from './actions';
import { dialogJSONViewerSelector } from './selectors';
import './DialogJSONViewer.scss';

interface IDialogJSONViewerProps extends Partial<IDialogProps> {
}

let submitForm = () => {};

export const DialogJSONViewer: React.FC<IDialogJSONViewerProps> = ({
  className, title = 'JSON', ...restProps
}) => {
  const {
    isOpen, isLoading, isEditing, JSON, onSubmit,
  } = useSelector(dialogJSONViewerSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setDialogJSONViewer());
  }, []);

  const handleFormSubmit = useCallback((values: {json: string}) => {
    onSubmit(values.json);
  }, [onSubmit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  return (
    <Dialog
      className={classNames('dialog-json-viewer', className)}
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={isEditing && (
        <>
          <Button
            className="dialog-json-viewer__btn"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="dialog-json-viewer__btn"
            isLoading={isLoading}
            color={ButtonColor.secondary}
            onClick={handleSubmitClick}
          >
            Save Changes
          </Button>
        </>
      )}
      {...restProps}
    >
      <Form
        initialValues={{ json: JSON }}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form className="dialog-json-viewer__form" onSubmit={handleSubmit}>
              <JSONEditorField
                name="json"
                height="250px"
                readOnly={!isEditing}
              />
            </form>
          );
        }}
      />
    </Dialog>
  );
};
