import React, { useCallback } from 'react';
import classNames from 'classnames';
import QRReader from 'react-qr-reader';
import { toast } from 'react-toastify';
import './QRScan.scss';

interface IQRScanProps {
  className?: string
  onScan: (data: string) => void
}

export const QRScan: React.FC<IQRScanProps> = ({ className, onScan }) => {
  const handleScan = useCallback((data) => {
    if (data) {
      onScan(data);
    }
  }, [onScan]);

  const handleError = useCallback((err) => {
    toast.error(err);
  }, []);

  return (
    <QRReader
      className={classNames('qr-scan', className)}
      delay={300}
      onError={handleError}
      onScan={handleScan}
    />
  );
};
