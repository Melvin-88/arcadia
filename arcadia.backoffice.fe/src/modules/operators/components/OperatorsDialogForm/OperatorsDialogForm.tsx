import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Form,
  Accordion,
  JSONEditorField,
  TextField,
  PasswordField,
  useExpand,
  convertDataToJSON,
  DialogConfirmation,
  DialogSection,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { operatorDialogFormSelector } from '../../state/selectors';
import {
  IPostOperatorRequestBody, IPutOperatorRequestBody, IOperatorFormValues,
} from '../../types';
import {
  putOperator, postOperator, setOperatorDialogForm, uploadOperatorLogo, setOperatorLogo,
} from '../../state/actions';
import { LinkToGroup } from './LinkToGroup/LinkToGroup';
import { ImageUploader } from '../../../../components/ImageUpload/ImageUploader';
import { OperatorNameTextField } from '../../../../components/fields/OperatorNameTextField';
import { APIConnectorIDField } from '../../../../components/fields/APIConnectorIDField';
import { APIAccessTokenExpirationField } from '../../../../components/fields/APIAccessTokenExpirationField';
import { APIAccessTokenField } from '../../../../components/fields/APIAccessTokenField';
import './OperatorsDialogForm.scss';

export interface IOperatorsDialogFormProps {
}

let submitForm = () => {};

let changeFormField: <FieldName extends keyof IOperatorFormValues>(fieldName: FieldName, value?: IOperatorFormValues[FieldName]) => void;

export const OperatorsDialogForm: React.FC<IOperatorsDialogFormProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues, isUploadingLogo, logoUrl,
  } = useSelector(operatorDialogFormSelector);
  const { handleExpand, isExpanded } = useExpand({ isMulti: false });
  const isEdit = !!(initialValues?.id);

  const handleFormSubmit = useCallback((values: IOperatorFormValues) => {
    const newValues = { ...values };

    const requestData: IPostOperatorRequestBody | IPutOperatorRequestBody = {
      ...newValues,
      regulation: typeof values.regulation === 'string' ? JSON.parse(values.regulation) : values.regulation,
      configuration: typeof values.configuration === 'string' ? JSON.parse(values.configuration) : values.configuration,
    };

    if (isEdit) {
      dispatch(putOperator(requestData));
    } else {
      dispatch(postOperator(requestData));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setOperatorDialogForm());
  }, []);

  const handleUploadLogo = useCallback((image) => {
    dispatch(uploadOperatorLogo(image));
  }, [uploadOperatorLogo]);

  const handleRemoveImage = useCallback(() => {
    dispatch(setOperatorLogo(''));
  }, [uploadOperatorLogo]);

  const imageUrl = useMemo(() => (
    logoUrl || logoUrl === '' ? logoUrl : initialValues?.logoUrl
  ), [logoUrl, initialValues]);

  const formInitialValues = useMemo(() => ({
    ...initialValues,
    regulation: convertDataToJSON(initialValues?.regulation),
    configuration: convertDataToJSON(initialValues?.configuration),
  }), [initialValues]);

  useEffect(() => {
    if (changeFormField && logoUrl) {
      changeFormField('logoUrl', logoUrl);
    }
  }, [logoUrl]);

  return (
    <DialogConfirmation
      className="operators-dialog-form"
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} Operator`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={formInitialValues as IOperatorFormValues}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit, form }) => {
          submitForm = handleSubmit;
          changeFormField = form.change;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="operators-dialog-form__fields-groups">
                <div className="operators-dialog-form__fields-group">
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      Operator name
                    </div>
                    <OperatorNameTextField label="" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      API connector ID
                    </div>
                    <APIConnectorIDField className="operators-dialog-form__field" label="" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      API Access token
                    </div>
                    <APIAccessTokenField className="operators-dialog-form__field" label="" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      Voucher Portal Username
                    </div>
                    <TextField name="voucherPortalUsername" isRequired={!isEdit} />
                  </div>
                </div>

                <div className="operators-dialog-form__fields-group">
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      API Access token expiration
                    </div>
                    <APIAccessTokenExpirationField className="operators-dialog-form__field" label="" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      Link to groups
                    </div>
                    <LinkToGroup className="operators-dialog-form__field" label="" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      Blue Ribbon Operator ID
                    </div>
                    <TextField name="blueRibbonOperatorId" />
                  </div>
                  <div className="operators-dialog-form__fields-container">
                    <div className="operators-dialog-form__field-label">
                      Voucher Portal Password
                    </div>
                    <PasswordField
                      name="voucherPortalPassword"
                      label=""
                      isRequired={!isEdit}
                      withSymbolsValidation={!isEdit}
                    />
                  </div>
                </div>
                <Accordion
                  className="operators-dialog-form__accordion-regulation"
                  label="Regulation"
                  isExpanded={isExpanded('regulation')}
                  onChange={() => handleExpand('regulation')}
                >
                  <JSONEditorField
                    name="regulation"
                    placeholder="Operator (JSON)"
                    height="150px"
                  />
                </Accordion>
                <Accordion
                  className="operators-dialog-form__accordion-configuration"
                  label="Configuration"
                  isExpanded={isExpanded('configuration')}
                  onChange={() => handleExpand('configuration')}
                >
                  <JSONEditorField
                    name="configuration"
                    placeholder="Operator (JSON)"
                    height="150px"
                  />
                </Accordion>
              </DialogSection>
              <DialogSection>
                <ImageUploader
                  title="Operator Logo"
                  isUploading={isUploadingLogo}
                  url={imageUrl}
                  onUpload={handleUploadLogo}
                  onRemoveImage={handleRemoveImage}
                />
              </DialogSection>
              <DialogSection>
                <PasswordField
                  className="operators-dialog-form__password-field"
                  classNameInputContainer="operators-dialog-form__password-field-container"
                  classNameLabel="operators-dialog-form__password-field-label"
                  label="You must confirm changes with your password"
                  withSymbolsValidation={false}
                />
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
