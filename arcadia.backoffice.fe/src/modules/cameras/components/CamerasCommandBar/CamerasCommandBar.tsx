import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, FormSpy, ITEMS_PER_PAGE, useHistoryPush, useSearchParams, CommandBar, ICommandBarItems, AddIcon,
} from 'arcadia-common-fe';
import WatchIcon from '../../../../assets/svg/eyeRegular.svg';
import { getCamerasStreams, setCameraDialogForm } from '../../state/actions';
import { selectedCamerasSelector } from '../../state/selectors';
import { CamerasSiteNameField } from '../../../../components/fields/CamerasSiteNameField';
import './CamerasCommandBar.scss';

export const CamerasCommandBar = () => {
  const dispatch = useDispatch();
  const selectedCameras = useSelector(selectedCamerasSelector);
  const searchParams = useSearchParams();
  const { handleHistoryPush } = useHistoryPush();

  const handleAdd = useCallback(() => {
    dispatch(setCameraDialogForm({
      isOpen: true,
    }));
  }, []);

  const handleWatch = useCallback(() => {
    if (searchParams.site) {
      dispatch(getCamerasStreams({
        site: String(searchParams.site),
        ids: selectedCameras,
      }));
    }
  }, [selectedCameras]);

  const items: ICommandBarItems = useMemo(() => [
    { text: 'Add', Icon: AddIcon, onClick: handleAdd },
    {
      text: 'Watch', Icon: WatchIcon, disabled: !selectedCameras.length, onClick: handleWatch,
    },
  ], [handleAdd, handleWatch, selectedCameras]);

  const handleSubmitForm = useCallback(({ values: { siteName } }) => {
    if (siteName) {
      handleHistoryPush({ site: siteName, take: ITEMS_PER_PAGE });
    }
  }, [handleHistoryPush]);

  return (
    <CommandBar
      leftContent={(
        <Form
          onSubmit={handleSubmitForm}
          initialValues={{ siteName: searchParams.site }}
          render={({ handleSubmit }) => (
            <form className="cameras-command-bar__form" onSubmit={handleSubmit}>
              <FormSpy
                onChange={handleSubmitForm}
              />
              Site
              <CamerasSiteNameField
                className="cameras-command-bar__site-name-field"
                isMulti={false}
                isCreatable={false}
                label=""
              />
            </form>
          )}
        />
      )}
      items={items}
    />
  );
};
