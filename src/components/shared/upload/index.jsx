import React from "react";
import FileUpload from "@/components/shared/fileupload";

/**
 * @deprecated Use FileUpload component directly instead
 * This component is kept for backward compatibility
 */
const CustomUpload = ({
  type = "dragger",
  onUploadSuccess = () => {},
  onUploadError = () => {},
  ...props
}) => {
  console.warn(
    "CustomUpload is deprecated. Use FileUpload component directly."
  );

  return (
    <FileUpload
      type={type}
      onUploadSuccess={onUploadSuccess}
      onUploadError={onUploadError}
      {...props}
    />
  );
};

export default CustomUpload;
