import React, { useCallback, useEffect } from 'react';
import {
  Form,
  FieldArray,
  FieldArrayRenderProps,
  Spinner,
  CheckboxBase,
  Checkbox,
  TextField,
  arrayMutators,
  PasswordField,
  DialogConfirmation,
  DialogSection,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { IUser, IPostAdministrationRequestBody, IPutAdministrationRequestBody } from '../../types';
import { postAdministration, putAdministration, setAdministrationDialogForm } from '../../state/actions';
import { administrationDialogFormSelector } from '../../state/selectors';
import { permissionsSelector } from '../../../auth/selectors';
import { UserPermissions } from '../../../auth/types';
import { EmailField } from '../../../../components/fields/EmailField';
import { PhoneField } from '../../../../components/fields/PhoneField';
import './AdministrationDialogForm.scss';

interface IPermissionsCheckboxGroupProps extends FieldArrayRenderProps<string, HTMLElement> {
  values?: { isAdmin?: boolean, permittedModules?: number[] }
  changeFormField?: (name: string, value?: any) => void
}

const PermissionsCheckboxGroup: React.FC<IPermissionsCheckboxGroupProps> = ({ fields, values, changeFormField }) => {
  const { isPermissionsLoading, permissionsIds, permissionsEntities } = useSelector(permissionsSelector);
  const { value } = fields;

  const handleChange = useCallback((checked: boolean, permissionId: string) => {
    if (checked) {
      fields.push(permissionId);
    } else {
      const index = value.indexOf(permissionId);

      fields.remove(index);
    }
  }, [fields]);

  if (isPermissionsLoading) {
    return (
      <Spinner className="administration-dialog-form__permissions-spinner" />
    );
  }

  useEffect(() => {
    const isCheckedAdminModule = Array.isArray(values?.permittedModules) && values?.permittedModules.some(
      (item) => item === UserPermissions.administration || item === UserPermissions.operators
    );

    if (value && !values?.isAdmin && isCheckedAdminModule && changeFormField) {
      const newValue = value.filter(
        (permission) => Number(permission) !== UserPermissions.administration && Number(permission) !== UserPermissions.operators,
      );

      changeFormField('permittedModules', newValue);
    }
  }, [values, changeFormField, value]);

  return (
    <div className="administration-dialog-form__permissions">
      <div className="administration-dialog-form__permissions-title">Permissions</div>
      <div className="administration-dialog-form__permissions-controls">
        {
          permissionsIds.map((permissionId) => {
            const permission = permissionsEntities[permissionId];
            const isDisabled = (
              Number(permissionId) === UserPermissions.administration || Number(permissionId) === UserPermissions.operators
            ) && !values?.isAdmin;

            return (
              <CheckboxBase
                key={permissionId}
                label={permission.name}
                disabled={isDisabled}
                value={value && value.indexOf(permissionId) !== -1}
                onChange={(checked) => handleChange(checked, permissionId)}
              />
            );
          })
        }
      </div>
    </div>
  );
};

export interface IAdministrationDialogFormProps {
}

let submitForm = () => {};
let changeFormField;

export const AdministrationDialogForm: React.FC<IAdministrationDialogFormProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues,
  } = useSelector(administrationDialogFormSelector);
  const isEdit = !!(initialValues && initialValues.id);

  const handleFormSubmit = useCallback((values: IPostAdministrationRequestBody | IPutAdministrationRequestBody) => {
    if (values.permittedModules?.length < 1) {
      toast.error('Please select at least one Permission');
    } else if (isEdit) {
      dispatch(putAdministration(values));
    } else {
      dispatch(postAdministration(values));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogForm());
  }, []);

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} User`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={initialValues as (IUser & { password: string })}
        mutators={{
          ...arrayMutators,
        }}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit, values, form }) => {
          submitForm = handleSubmit;
          changeFormField = form.change;

          return (
            <form className="administration-dialog-form" onSubmit={handleSubmit}>
              <DialogSection className="administration-dialog-form__fields-groups">
                <div className="administration-dialog-form__fields-group">
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      First Name
                    </div>
                    <TextField
                      className="administration-dialog-form__field"
                      name="firstName"
                      placeholder="First Name"
                      isRequired
                    />
                  </div>
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      Last Name
                    </div>
                    <TextField
                      className="administration-dialog-form__field"
                      name="lastName"
                      placeholder="Last Name"
                      isRequired
                    />
                  </div>
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      Email
                    </div>
                    <EmailField className="administration-dialog-form__field" name="email" label="" isRequired />
                  </div>
                  { !isEdit && (
                    <div className="administration-dialog-form__fields-container">
                      <div className="administration-dialog-form__field-label">
                        Password
                      </div>
                      <PasswordField
                        className="administration-dialog-form__field"
                        name="userPassword"
                        label=""
                      />
                    </div>
                  ) }
                </div>

                <div className="administration-dialog-form__fields-group">
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      Phone 1
                    </div>
                    <PhoneField
                      className="administration-dialog-form__field"
                      name="phone1"
                      label=""
                    />
                  </div>
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      Phone 2
                    </div>
                    <PhoneField
                      className="administration-dialog-form__field"
                      name="phone2"
                      validate={null}
                      label=""
                    />
                  </div>
                  <div className="administration-dialog-form__fields-container">
                    <div className="administration-dialog-form__field-label">
                      Is Admin
                    </div>
                    <div className="administration-dialog-form__field administration-dialog-form__field--checkbox">
                      <Checkbox
                        name="isAdmin"
                        label=""
                      />
                    </div>
                  </div>
                </div>
              </DialogSection>
              <DialogSection className="administration-dialog-form__permissions-group">
                <FieldArray
                  name="permittedModules"
                  label="Permissions"
                  component={PermissionsCheckboxGroup}
                  values={values}
                  changeFormField={changeFormField}
                />
              </DialogSection>
              <DialogSection>
                <PasswordField
                  className="administration-dialog-form__password-field"
                  classNameInputContainer="administration-dialog-form__password-field-container"
                  classNameLabel="administration-dialog-form__password-field-label"
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
