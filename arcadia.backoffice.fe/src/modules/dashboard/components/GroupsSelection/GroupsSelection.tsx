import React from 'react';
import classnames from 'classnames';
import { Form } from 'arcadia-common-fe';
import { GroupIdField } from '../../../../components/fields/GroupIdField';
import './GroupsSelection.scss';

interface IGroupsSelectionProps<TValues> {
  className?: string
  filterValues?: TValues
  onSubmitForm: (values: Record<string, any>) => void
}

export const GroupsSelection: <TValues>(props: IGroupsSelectionProps<TValues>) => React.ReactElement = ({
  className,
  filterValues,
  onSubmitForm,
}) => (
  <div className={classnames('groups-selection', className)}>
    <div>Groups:</div>
    <div className="groups-selection__form">
      <Form
        onSubmit={onSubmitForm}
        initialValues={filterValues}
        render={({ handleSubmit, values }) => (
          <form className="cameras-command-bar__form" onSubmit={handleSubmit}>
            <GroupIdField
              label=""
              menuPlacement="auto"
              onMenuClose={() => onSubmitForm(values)}
            />
          </form>
        )}
      />
    </div>
  </div>
);
