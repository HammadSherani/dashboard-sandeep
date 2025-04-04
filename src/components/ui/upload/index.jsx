/* eslint-disable react/prop-types */
import { forwardRef, useRef, useState, useCallback, useEffect } from "react";
import classNames from "classnames";
import cloneDeep from "lodash/cloneDeep";
import FileItem from "./FileItem";
import Button from "../Button";
import CloseButton from "../CloseButton";
import { toast } from "react-toastify";

const filesToArray = (files) => Object.keys(files).map((key) => files[key]);

const Upload = forwardRef((props, ref) => {
  const {
    accept,
    beforeUpload,
    disabled = false,
    draggable = false,
    fileList = [],
    multiple,
    onChange,
    onFileRemove,
    showList = true,
    tip,
    uploadLimit,
    children,
    className,
    field,
    ...rest
  } = props;

  const fileInputField = useRef(null);
  const [files, setFiles] = useState(fileList);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (JSON.stringify(files) !== JSON.stringify(fileList)) {
      setFiles(fileList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  const triggerMessage = (msg = "") => {
    toast.error(msg || "Upload Failed");
  };

  const pushFile = (newFiles, file) => {
    if (newFiles) {
      for (const f of newFiles) {
        file.push(f);
      }
    }

    return file;
  };

  const addNewFiles = (newFiles) => {
    let file = cloneDeep(files);
    if (typeof uploadLimit === "number" && uploadLimit !== 0) {
      if (Object.keys(file).length >= uploadLimit) {
        if (uploadLimit === 1) {
          file.shift();
          file = pushFile(newFiles, file);
        }

        return filesToArray({ ...file });
      }
    }
    file = pushFile(newFiles, file);
    return filesToArray({ ...file });
  };

  const onNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    let result = true;

    if (beforeUpload) {
      result = beforeUpload(newFiles, files);

      if (result === false) {
        triggerMessage();
        return;
      }

      if (typeof result === "string" && result.length > 0) {
        triggerMessage(result);
        return;
      }
    }

    if (result) {
      const updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      onChange?.(updatedFiles, files);
    }
  };

  const removeFile = (fileIndex) => {
    const deletedFileList = files.filter((_, index) => index !== fileIndex);
    setFiles(deletedFileList);
    onFileRemove?.(deletedFileList);
  };

  const triggerUpload = (e) => {
    if (!disabled) {
      fileInputField.current?.click();
    }
    e.stopPropagation();
  };

  const renderChildren = () => {
    if (!draggable && !children) {
      return (
        <Button disabled={disabled} onClick={(e) => e.preventDefault()}>
          Upload
        </Button>
      );
    }

    if (draggable && !children) {
      return <span>Choose a file or drag and drop here</span>;
    }

    return children;
  };

  const handleDragLeave = useCallback(() => {
    if (draggable) {
      setDragOver(false);
    }
  }, [draggable]);

  const handleDragOver = useCallback(() => {
    if (draggable && !disabled) {
      setDragOver(true);
    }
  }, [draggable, disabled]);

  const handleDrop = useCallback(() => {
    if (draggable) {
      setDragOver(false);
    }
  }, [draggable]);

  const draggableProp = {
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  const draggableEventFeedbackClass = `border-blue-500`;

  const uploadClass = classNames(
    "upload",
    draggable && `upload-draggable`,
    draggable && !disabled && `hover:${draggableEventFeedbackClass}`,
    draggable && disabled && "disabled",
    dragOver && draggableEventFeedbackClass,
    className
  );

  const uploadInputClass = classNames("upload-input", draggable && `draggable`);

  return (
    <>
      <div
        ref={ref}
        className={uploadClass}
        {...(draggable ? draggableProp : { onClick: triggerUpload })}
        {...rest}
      >
        <input
          ref={fileInputField}
          className={uploadInputClass}
          type="file"
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          title=""
          value=""
          onChange={onNewFileUpload}
          {...field}
          {...rest}
        ></input>
        {renderChildren()}
      </div>
      {tip}
      {showList && (
        <div className="upload-file-list">
          {files.map((file, index) => (
            <FileItem key={file.name + index} file={file}>
              <CloseButton
                className="upload-file-remove"
                onClick={() => removeFile(index)}
              />
            </FileItem>
          ))}
        </div>
      )}
    </>
  );
});

Upload.displayName = "Upload";

export default Upload;
