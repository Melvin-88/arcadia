import React from 'react';
import { Select, IFormFieldProps } from 'arcadia-common-fe';

const recordingStatusOptions = [
  { label: 'Online', value: 'true' },
  { label: 'Offline', value: 'false' },
];

export const RecordingStatusField: React.FC<IFormFieldProps> = ({ className }) => (
  <Select
    className={className}
    name="recordingStatus"
    label="Recording Status"
    isClearable
    options={recordingStatusOptions}
  />
);
