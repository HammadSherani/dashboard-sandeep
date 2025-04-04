/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';

const BYTE = 1000;
const getKB = (bytes) => Math.round(bytes / BYTE);

const FileIcon = ({ children }) => {
  return <span className="text-4xl">{children}</span>;
};

const FileItem = (props) => {
  const { file, children } = props;
  const { type, name, size } = file;

  if (typeof file === 'string') {
    return (
      <div className="upload-file h-[200px]">
        <div className="flex justify-center h-full w-full p-2">
          <div className="h-full">
            <img className="h-full" src={file} alt={`file preview `} />
          </div>
        </div>
      </div>
    );
  }

  const renderThumbnail = () => {
    const isImageFile = type.split('/')[0] === 'image';

    if (isImageFile) {
      return <img className="upload-file-image" src={URL.createObjectURL(file)} alt={`file preview ${name}`} />;
    }

    if (type === 'application/zip') {
      return (
        <FileIcon>
          <Icon icon="hugeicons:zip-02" />
        </FileIcon>
      );
    }

    if (type === 'application/pdf') {
      return (
        <FileIcon>
          <Icon icon="teenyicons:pdf-outline" />
        </FileIcon>
      );
    }

    return (
      <FileIcon>
        <Icon icon="mdi:file-outline" />
      </FileIcon>
    );
  };

  return (
    <div className="upload-file">
      <div className="flex">
        <div className="upload-file-thumbnail">{renderThumbnail()}</div>
        <div className="upload-file-info">
          <h6 className="upload-file-name">{name}</h6>
          <span className="upload-file-size">{getKB(size)} kb</span>
        </div>
      </div>
      {children}
    </div>
  );
};

FileItem.displayName = 'UploadFileItem';

export default FileItem;
