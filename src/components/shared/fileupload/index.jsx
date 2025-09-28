import React, { useState } from "react";
import { Upload, message, Avatar } from "antd";
import { UserOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { useMutation } from "@/hooks/reactQuery";
import PropTypes from "prop-types";
import "./fileupload.css";

const { Dragger } = Upload;

/**
 * FileUpload Component with Avatar and Dragger types
 */
const FileUpload = ({
  type = "dragger",
  onUploadSuccess = () => {},
  onUploadError = () => {},
  defaultImage = null,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*"],
  className = "",
  style = {},
  ...rest
}) => {
  const [previewUrl, setPreviewUrl] = useState(defaultImage);
  const [previewType, setPreviewType] = useState(null);
  const [uploading, setUploading] = useState(false);

  // File upload mutation
  const { mutate: uploadFile } = useMutation("fileUpload", {
    onSuccess: (response) => {
      setUploading(false);
      onUploadSuccess(response);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      setUploading(false);
      message.error("Upload failed. Please try again.");
      onUploadError(error);
    },
  });

  // Determine file type
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "unknown";
  };

  // Create preview URL
  const createPreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setPreviewType(getFileType(file));
      console.log("Preview created for file:", file.name);
    };
  };

  // Handle file selection (before upload)
  const handleBeforeUpload = (file) => {
    console.log("File selected:", file);

    const fileType = getFileType(file);

    // Validate file type
    if (fileType === "unknown") {
      message.error("Please upload only images or videos!");
      return false;
    }

    // Validate file size
    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`File must be smaller than ${maxSize}MB!`);
      return false;
    }

    // Create preview immediately
    createPreview(file);

    // Return false to prevent automatic upload
    // We'll handle upload manually
    return false;
  };

  // Manual upload function
  const handleManualUpload = (file) => {
    console.log("Starting manual upload for:", file.name);
    setUploading(true);

    const fileType = getFileType(file);

    // Create FormData with the required structure
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    console.log("FormData created:", { file: file.name, type: fileType });

    // Upload using the mutation
    uploadFile({ data: formData });
  };

  // Handle file change
  const handleChange = (info) => {
    console.log("Upload change:", info);

    const { file, fileList } = info;

    if (file.status === "done") {
      console.log("File upload completed");
    } else if (file.status === "error") {
      console.log("File upload failed");
    }
  };

  // Upload props
  const uploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: acceptedTypes.join(","),
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
    showUploadList: false,
    ...rest,
  };

  // Avatar type uploader
  if (type === "profile") {
    return (
      <div className={`file-upload-avatar ${className}`} style={style}>
        <Upload {...uploadProps}>
          <div className="avatar-upload-container">
            {previewUrl ? (
              <Avatar size={120} src={previewUrl} className="upload-avatar" />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="upload-avatar placeholder"
              />
            )}
            <div className="avatar-upload-overlay">
              <PlusOutlined />
              <div className="upload-text">Upload</div>
            </div>
            {uploading && (
              <div className="upload-loading">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </Upload>

        {/* Manual upload button when file is selected */}
        {previewUrl && !uploading && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput && fileInput.files[0]) {
                  handleManualUpload(fileInput.files[0]);
                }
              }}
              style={{
                background: "#ff4d4f",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Upload File
            </button>
          </div>
        )}
      </div>
    );
  }

  // Dragger type uploader
  return (
    <div className={`file-upload-dragger ${className}`} style={style}>
      <Dragger {...uploadProps} className="custom-dragger">
        {previewUrl ? (
          <div className="preview-container">
            {previewType === "image" ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : previewType === "video" ? (
              <video src={previewUrl} controls className="preview-video" />
            ) : null}
            <div className="preview-overlay">
              <PlusOutlined />
              <div>Click or drag to replace</div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">
              Support for images and videos up to {maxSize}MB
            </p>
          </div>
        )}
        {uploading && (
          <div className="upload-loading-overlay">
            <div className="spinner"></div>
            <div>Uploading...</div>
          </div>
        )}
      </Dragger>

      {/* Manual upload button when file is selected */}
      {previewUrl && !uploading && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]');
              if (fileInput && fileInput.files[0]) {
                handleManualUpload(fileInput.files[0]);
              }
            }}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Upload File
          </button>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  type: PropTypes.oneOf(["profile", "dragger"]),
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  defaultImage: PropTypes.string,
  maxSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FileUpload;
