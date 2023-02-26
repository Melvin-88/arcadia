import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  Link,
  CheckboxBase,
  useTableSortingWithRouting,
  useExpand,
} from 'arcadia-common-fe';
import { ICameras, CameraAction, CameraId } from '../../types';
import { CameraDetails } from './CameraDetails/CameraDetails';
import { CamerasStatus } from './CameraStatus/CameraStatus';
import { RecordStatus } from './RecordStatus/RecordStatus';
import {
  selectCamera,
  setCameraDialogAction,
  getStreamsData,
  setChangeRecordingDialog,
  setGetRecordingDialog,
  getLiveWatchLink,
} from '../../state/actions';
import { selectedCamerasSelector } from '../../state/selectors';
import { StreamDialog } from './StreamDialog/StreamDialog';
import { CAMERAS_ON_DISPLAY } from '../../constants';
import { CameraDialogAction } from './CameraDialogAction.tsx/CameraDialogAction';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { CameraDialogChangeRecording } from './CameraDialogChangeRecording/CameraDialogChangeRecording';
import { CameraDialogGetRecording } from './CameraDialogGetRecording/CameraDialogGetRecording';

interface ICamerasTableProps {
  isLoading: boolean
  total: number
  site: string
  offset: number
  cameras: ICameras
}

const headCells = [
  { key: 'status', label: 'Stream Status' },
  { key: 'id', label: 'Camera ID' },
  { key: 'site', label: 'Site' },
  { key: 'recordingStatus', label: 'Recording Status' },
  { key: 'type', label: 'Type' },
  { key: 'cameraIp', label: 'Camera IP' },
  { key: 'machine', label: 'Machine' },
];

export const CamerasTable: React.FC<ICamerasTableProps> = ({
  isLoading,
  total,
  cameras,
  site,
  offset,
}) => {
  const dispatch = useDispatch();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand<string>();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const selectedCameras = useSelector(selectedCamerasSelector);

  useEffect(() => {
    handleResetExpand();
  }, [cameras]);

  const handleSetDialogAction = useCallback((id: CameraId, action: CameraAction) => {
    dispatch(setCameraDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleOpenStream = useCallback((camera) => {
    dispatch(getLiveWatchLink({ camera }));
  }, []);

  const handleRemove = useCallback((id: CameraId) => {
    handleSetDialogAction(id, CameraAction.remove);
  }, [handleSetDialogAction]);

  const handleReset = useCallback((id: CameraId) => {
    handleSetDialogAction(id, CameraAction.reset);
  }, [handleSetDialogAction]);

  const handleGetCamerasStreams = useCallback((id: CameraId) => {
    dispatch(getStreamsData({
      site,
      id,
    }));
  }, [site]);

  const handleCamerasChangeRecording = useCallback((id: CameraId, isRecorded: boolean) => {
    dispatch(setChangeRecordingDialog({
      id,
      isRecorded,
      isOpen: true,
    }));
  }, []);

  const handleGetRecording = useCallback((id: CameraId) => {
    dispatch(setGetRecordingDialog({
      id,
      isOpen: true,
    }));
  }, []);

  const handleCameraCheck = useCallback((event, id) => {
    event.stopPropagation();
    dispatch(selectCamera({ id }));
  }, [selectedCameras]);

  const isCameraSelected = useCallback((camera) => (
    selectedCameras.some((item) => item.id === camera.id)
  ), [selectedCameras]);

  return (
    <>
      <Table
        isLoading={isLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
            <TableCell isContentWidth />
            <TableCell isContentWidth />
            <TableCell isContentWidth />
            { headCells.map(({ key, label }) => (
              <TableCell
                key={key}
                sortOrder={sortBy === key ? sortOrder : undefined}
                onClick={createSortHandler(key)}
              >
                { label }
              </TableCell>
            )) }
            <TableCell>Live watch link</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            cameras.map((camera, i) => (
              <TableRow
                key={camera.id}
                isExpand={isExpanded(camera.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="groups-table__details-cell" colSpan={9}>
                      <CameraDetails
                        {...camera}
                        onRemove={handleRemove}
                        onReset={handleReset}
                        onGetCamerasStreams={handleGetCamerasStreams}
                        onCamerasChangeRecording={handleCamerasChangeRecording}
                        onGetRecording={handleGetRecording}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(camera.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <CheckboxBase
                    value={isCameraSelected(camera)}
                    disabled={!isCameraSelected(camera) && selectedCameras.length >= CAMERAS_ON_DISPLAY}
                    onChange={(value, event) => handleCameraCheck(event, camera.id)}
                  />
                </TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(camera.id)} />
                </TableCell>
                <TableCell>
                  <CamerasStatus status={camera.status} />
                </TableCell>
                <TableCell>{camera.id}</TableCell>
                <TableCell>{camera.site?.name}</TableCell>
                <TableCell>
                  <RecordStatus status={camera.isRecorded} />
                </TableCell>
                <TableCell>{camera.type}</TableCell>
                <TableCell>{camera.ip}</TableCell>
                <TableCell>{camera.machine}</TableCell>
                <TableCell>
                  <Link
                    preventDefault
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenStream(camera);
                    }}
                  >
                    {camera.liveStreamUrl}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <StreamDialog />
      <HistoryDialog />
      <StreamDialog />
      <CameraDialogAction site={site} />
      <CameraDialogChangeRecording site={site} />
      <CameraDialogGetRecording site={site} />
    </>
  );
};
