import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, ButtonColor, ButtonVariant, joinArrayBySymbol, valueOrEmptyStub,
} from 'arcadia-common-fe';
import { AdministrationUserStatus, IUser, UserId } from '../../../types';
import { permissionsSelector } from '../../../../auth/selectors';
import './AdministrationDetails.scss';

interface IAdministrationDetailsProps extends IUser {
  onEdit: (id: UserId) => void
  onEnable: (id: UserId) => void
  onDisable: (id: UserId) => void
  onRemove: (id: UserId) => void
  onUserActions: (id: UserId) => void
  onEditPassword: (id: UserId) => void
  onOpenHistory: (id: UserId) => void
}

export const AdministrationDetails: React.FC<IAdministrationDetailsProps> = React.memo(({
  id,
  status,
  firstName,
  lastName,
  phone1,
  phone2,
  email,
  permittedModules,
  onEdit,
  onEnable,
  onDisable,
  onRemove,
  onUserActions,
  onEditPassword,
  onOpenHistory,
}) => {
  const { permissionsEntities } = useSelector(permissionsSelector);

  const permittedModulesNames = useMemo(() => (
    permittedModules?.reduce((accumulator: string[], key) => {
      const newAccumulator = [...accumulator];

      if (permissionsEntities[key]?.name) {
        newAccumulator.push(permissionsEntities[key].name);
      }

      return newAccumulator;
    }, [])
  ), [permittedModules, permissionsEntities]);

  return (
    <div className="administration-details">
      <div className="administration-details__description">
        <div className="administration-details__info-bar">
          <div className="administration-details__info-row">
            <div className="administration-details__term">First Name</div>
            <b className="administration-details__value">{valueOrEmptyStub(firstName)}</b>
          </div>
          <div className="administration-details__info-row">
            <div className="administration-details__term">Last Name</div>
            <b className="administration-details__value">{valueOrEmptyStub(lastName)}</b>
          </div>
        </div>
        <div className="administration-details__info-bar">
          <div className="administration-details__info-row">
            <div className="administration-details__term">Phone 1</div>
            <b className="administration-details__value">{valueOrEmptyStub(phone1)}</b>
          </div>
          <div className="administration-details__info-row">
            <div className="administration-details__term">Phone 2</div>
            <b className="administration-details__value">{valueOrEmptyStub(phone2)}</b>
          </div>
        </div>
        <div className="administration-details__info-bar">
          <div className="administration-details__info-row">
            <div className="administration-details__term">Email</div>
            <b className="administration-details__value">{valueOrEmptyStub(email)}</b>
          </div>
          <div className="administration-details__info-row">
            <div className="administration-details__term">Permitted modules</div>
            <b className="administration-details__value">{valueOrEmptyStub(joinArrayBySymbol(permittedModulesNames))}</b>
          </div>
        </div>
      </div>

      <div className="administration-details__controls">
        <div className="administration-details__controls-machine">
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            disabled={status === AdministrationUserStatus.disabled}
            onClick={() => onEdit(id)}
          >
            Edit
          </Button>
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            disabled={status === AdministrationUserStatus.disabled}
            onClick={() => onEditPassword(id)}
          >
            Edit Password
          </Button>
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            disabled={status === AdministrationUserStatus.enabled}
            onClick={() => onEnable(id)}
          >
            Enable
          </Button>
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            disabled={status === AdministrationUserStatus.disabled}
            onClick={() => onDisable(id)}
          >
            Disable
          </Button>
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            disabled={status === AdministrationUserStatus.enabled}
            onClick={() => onRemove(id)}
          >
            Remove
          </Button>
          <Button
            className="administration-details__btn"
            color={ButtonColor.quinary}
            onClick={() => onUserActions(id)}
          >
            User Actions
          </Button>
        </div>

        <div>
          <Button
            variant={ButtonVariant.outline}
            onClick={() => onOpenHistory(id)}
          >
            History
          </Button>
        </div>
      </div>
    </div>
  );
});
