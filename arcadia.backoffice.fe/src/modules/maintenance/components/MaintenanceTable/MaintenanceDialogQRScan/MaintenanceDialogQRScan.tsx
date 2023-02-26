import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Dialog, DialogSection } from 'arcadia-common-fe';
import { QRScan } from '../../../../../components/QRScan/QRScan';
import { maintenanceDialogScanQRCodeSelector } from '../../../state/selectors';
import { scanQRCodeSuccess, setMaintenanceDialogQRScan } from '../../../state/actions';

interface IMaintenanceDialogQRScanProps {
}

export const MaintenanceDialogQRScan: React.FC<IMaintenanceDialogQRScanProps> = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector(maintenanceDialogScanQRCodeSelector);

  const handleClose = useCallback(() => {
    dispatch(setMaintenanceDialogQRScan());
  }, []);

  const handleScan = useCallback((qrData: string) => {
    const machineId = Number(qrData);

    if (Number.isNaN(machineId)) {
      toast.error('This QR doesn’t contain Machine ID information. Please try again and make sure that you’re scanning proper QR.');
    } else {
      dispatch(scanQRCodeSuccess({ machineId }));
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Scan QR code"
    >
      <DialogSection>
        <QRScan onScan={handleScan} />
      </DialogSection>
    </Dialog>
  );
};
