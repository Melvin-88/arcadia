import React from 'react';
import {
  Button,
  CheckboxBase,
  TextField,
  Select,
  Datepicker,
  Checkbox,
  createRequiredValidator,
  Form,
  FormSpy,
  FieldArray,
  FieldArrayRenderProps,
  arrayMutators,
  PasswordField,
} from 'arcadia-common-fe';
import { action } from '@storybook/addon-actions';
import { options } from '../inputs/Select/constants';
import { EmailField } from '../../src/components/fields/EmailField';
import './Form.stories.scss';

export default {
  title: 'Form',
};

const permissions = ['Dashboard', 'Sessions', 'Players', 'Groups'];

// TODO: Should be review after first priority task BEGIN
const CheckboxGroup: React.FC<FieldArrayRenderProps<string, HTMLElement>> = ({ fields }) => {
  const { value } = fields;
  const toggle = (checked:boolean, option:string) => {
    if (checked) {
      fields.push(option);
    } else {
      const index = value.indexOf(option);

      fields.remove(index);
    }
  };

  return (
    <>
      <div className="form-story__checkbox-group-label">Permissions</div>
      {
        permissions.map((option: string) => (
          <CheckboxBase
            className="form-story__checkbox-group-item"
            key={option}
            label={option}
            value={value && value.indexOf(option) !== -1}
            onChange={(checked) => toggle(checked, option)}
          />
        ))
      }
    </>
  );
};
// TODO: Should be review after first priority task END

export const Sandbox = () => (
  <div className="form-story">
    <Form
      onSubmit={action('onSubmit')}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
      }) => (
        <form
          className="form-story__body"
          onSubmit={handleSubmit}
        >
          <FormSpy
            subscription={{ values: true }}
            onChange={action('onChange')}
          />
          <h2 className="form-story__title">Simple Form</h2>
          <Select
            className="form-story__field"
            name="state"
            label="State"
            isClearable
            validate={createRequiredValidator('State')}
            options={options}
          />
          <EmailField
            className="form-story__field"
          />
          <PasswordField
            className="form-story__field"
          />
          <TextField
            className="form-story__field"
            name="firstName"
            label="First Name"
            placeholder="First Name"
            validate={createRequiredValidator('First Name')}
          />
          <Datepicker
            className="form-story__field"
            name="date"
            label="Date"
            validate={createRequiredValidator('Date')}
          />
          <Checkbox
            name="agreement"
            label="I agree license agreement"
          />

          <br />

          <FieldArray
            name="permissions"
            label="Permissions"
            component={CheckboxGroup}
          />
          <div className="form-story__controls">
            <Button color="primary" onClick={form.reset} disabled={submitting || pristine}>Reset</Button>
            <Button color="secondary" type="submit" disabled={submitting || pristine}>Submit</Button>
          </div>
        </form>
      )}
    />
  </div>
);
