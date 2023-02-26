import React, { useCallback } from 'react';
import { Form, DialogConfirmation, DialogSection } from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { maintenanceDialogMachineIdentificationSelector, maintenanceReducerSelector } from '../../../state/selectors';
import { MachineIDField } from '../../../../../components/fields/MachineIDField';
import QRCodeIcon from '../../../../../assets/svg/qrCode.svg';
import { IAlert } from '../../../types';
import {
  setMaintenanceDialogMachineIdentification, machineIdentificationSuccess, setMaintenanceDialogQRScan,
} from '../../../state/actions';
import './MaintenanceDialogMachineIdentification.scss';

export interface IMaintenanceDialogMachineIdentificationProps {
}

let submitForm = () => {};

export const MaintenanceDialogMachineIdentification: React.FC<IMaintenanceDialogMachineIdentificationProps> = () => {
  const dispatch = useDispatch();
  const { id, isOpen, action } = useSelector(maintenanceDialogMachineIdentificationSelector);
  const { alerts, machineId } = useSelector(maintenanceReducerSelector);

  const handleClose = useCallback(() => {
    dispatch(setMaintenanceDialogMachineIdentification());
  }, []);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleFormSubmit = useCallback((values: {machineId: number}) => {
    const currentAlert = alerts.find((alert: IAlert) => alert.id === id);

    if (currentAlert?.additionalInfo.machineId === values.machineId) {
      dispatch(machineIdentificationSuccess({
        id,
        action,
        isOpen: true,
      }));
    } else {
      toast.error('Machine IDs do not match!');
    }
  }, [action, id, alerts]);

  const handleScanQRCode = useCallback(() => {
    dispatch(setMaintenanceDialogQRScan({
      isOpen: true,
    }));
  }, []);

  return (
    <DialogConfirmation
      className="dialog-machine-identification"
      isOpen={isOpen}
      title="Enter Machine ID or scan QR Code"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
      submitText="Next"
    >
      <Form
        initialValues={{ machineId }}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="dialog-machine-identification__section">
                <div className="dialog-machine-identification__field-group">
                  <div className="dialog-machine-identification__field-container">
                    <div className="dialog-machine-identification__field-label">Machine ID</div>
                    <MachineIDField label="" isRequired />
                  </div>
                </div>

                <div className="dialog-machine-identification__field-group dialog-machine-identification__field-group--qr-code">
                  <QRCodeIcon
                    className="dialog-machine-identification__qr-code-icon"
                    role="button"
                    tabIndex={0}
                    onClick={handleScanQRCode}
                  />
                </div>
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
