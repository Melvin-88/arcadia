import React, { useCallback, useRef } from 'react';
import { Spinner } from 'arcadia-common-fe';
import DownloadIcon from '../../assets/svg/download.svg';
import DismissIcon from '../../assets/svg/dismiss.svg';
import './ImageUploader.scss';

interface IImageUploaderProps {
  title?: string
  url?: string | null
  isUploading: boolean
  onUpload: (file: File) => void
  onRemoveImage: () => void
}

export const ImageUploader: React.FC<IImageUploaderProps> = ({
  title = 'Add image',
  url,
  isUploading,
  onUpload,
  onRemoveImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(event.target.files[0]);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const renderUploaderContent = useCallback(() => {
    if (url) {
      return (
        <>
          <div className="image-uploader__preview" style={{ backgroundImage: `url(${url})` }} />
          <div className="image-uploader__dismiss">
            <DismissIcon className="image-uploader__dismiss-icon" onClick={onRemoveImage} />
          </div>
        </>
      );
    }

    if (isUploading) {
      return <Spinner />;
    }

    return <DownloadIcon className="image-uploader__download-icon" />;
  }, [url, isUploading]);

  return (
    <div className="image-uploader">
      <div>{title}</div>
      <div className="image-uploader__container">
        <div className="image-uploader__btn">
          <input
            className="image-uploader__input"
            type="file"
            accept="image/jpeg, image/png"
            ref={inputRef}
            onChange={handleFilesSelect}
          />
          { renderUploaderContent() }
        </div>
      </div>
    </div>
  );
};
