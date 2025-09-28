import React, { useState, useEffect } from "react";
import { Upload, message, Avatar, Button  } from "antd";
import {
  UserOutlined,
  PlusOutlined,
  InboxOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import apiClient from "@/services/apiClient";
import "./simple-upload.css";

const { Dragger } = Upload;

const SimpleFileUpload = ({
  type = "dragger",
  onUploadSuccess = () => {},
  onUploadError = () => {},
  onFileRemove = () => {},
  defaultImage = null,
  maxSize = 10,
  multiple = true, // Allow multiple files by default
  maxFiles = 5, // Maximum number of files
  initialFileList = [], // Initial files to display
  icon = true,
  img,
  title = "Click or drag files to upload",
  description = "Support for  images",
  showPreview = true, // New prop to control preview display
  apiEndpoint = "fileUpload", // New prop to specify which API endpoint to use
  fileKey = "file",
  rules // New prop to specify the file key name in FormData
}) => {
  const [previewFiles, setPreviewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Initialize preview files from initialFileList
  useEffect(() => {
    if (initialFileList && initialFileList.length > 0) {
      const initialPreviews = initialFileList.map((attachment, index) => {
        // Handle different attachment URL structures
        const getAttachmentUrl = (item) => {
          if (typeof item === "string") return item;
          if (typeof item === "object" && item !== null) {
            // Check all possible URL fields in order of preference
            return item.full_url || item.url || item.file_url || item.attachment_url || item.path;
          }
          return null;
        };

        const previewUrl = getAttachmentUrl(attachment);

        return {
          id: attachment.id || Date.now() + index,
          preview: previewUrl,
          type: attachment.type || 'image', // Default to image if type not specified
          name: attachment.name || `${attachment.type || 'file'}-${attachment.id || index}`,
          uploaded: true,
          uploadResponse: attachment,
          isExisting: true, // Mark as existing file
        };
      });
      setPreviewFiles(initialPreviews);
    } else {
      setPreviewFiles([]);
    }
  }, [initialFileList]);

  // Get file type
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "unknown";
  };

  // Create preview for a file
  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          id: Date.now() + Math.random(),
          file,
          preview: reader.result,
          type: getFileType(file),
          name: file.name,
          uploaded: false,
          isExisting: false,
        });
      };
    });
  };

  // Custom upload function
  const customUpload = async ({ file, onSuccess, onError }) => {
    console.log("Starting upload for file:", file.name);

    const fileType = getFileType(file);

    // Validate file type
    if (fileType === "unknown") {
      message.error("Please upload only images or videos!");
      onError(new Error("Invalid file type"));
      return;
    }

    // Validate file size
    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
     onError(new Error("File too large"));
      return;
    }

    // Check max files limit
    if (multiple && previewFiles.length >= maxFiles) {
      message.error(`Maximum ${maxFiles} files allowed!`);
      onError(new Error("Too many files"));
      return;
    }

    setUploading(true);

    try {
      // Create preview first
      const previewFile = await createPreview(file);

      if (multiple) {
        setPreviewFiles((prev) => [...prev, previewFile]);
      } else {
        setPreviewFiles([previewFile]);
      }

      // Create FormData with dynamic file key
      const formData = new FormData();
      formData.append(fileKey, file); // Use dynamic fileKey instead of hardcoded "file"
      formData.append("type", fileType);

      console.log("Uploading FormData with:", {
        fileName: file.name,
        type: fileType,
        fileKey: fileKey,
      });

      // Make API call directly
      const response = await apiClient.request(apiEndpoint, {
        data: formData,
        useFormData: true,
      });

      console.log("Upload successful:", response);

      // Update the preview file with upload success
      setPreviewFiles((prev) =>
        prev.map((pf) =>
          pf.id === previewFile.id
            ? { ...pf, uploaded: true, uploadResponse: response.data }
            : pf
        )
      );

      setUploading(false);

      onSuccess(response);
      onUploadSuccess(response);
    } catch (error) {
      console.error("Upload failed:", error);

      // Remove failed file from preview
      setPreviewFiles((prev) => prev.filter((pf) => pf.file !== file));

      setUploading(false);
      onError(error);
      onUploadError(error);
    }
  };

  // Remove file from preview
  const removeFile = (fileId) => {
    const fileToRemove = previewFiles.find((pf) => pf.id === fileId);
    setPreviewFiles((prev) => prev.filter((pf) => pf.id !== fileId));

    if (fileToRemove && fileToRemove.uploaded) {
      onFileRemove(fileToRemove.uploadResponse);
    }
  };

  const uploadProps = {
    name: fileKey, // Use dynamic fileKey instead of hardcoded "file"
    multiple: multiple,
    maxCount: multiple ? maxFiles : 1,
    accept: "image/*,video/*",
    customRequest: customUpload,
    showUploadList: false,
  };

  // Avatar type (single file only)
  if (type === "profile") {
    const singleFile = previewFiles[0];

    return (
      <div style={{ textAlign: "center" }}>
        <Upload {...{ ...uploadProps, multiple: false, maxCount: 1 }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            {singleFile ? (
              <Avatar size={120} src={singleFile.preview} />
            ) : defaultImage ? (
              <Avatar size={120} src={defaultImage} />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1a1a1a" }}
              />
            )}
            <div
              className="upload-hover-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                opacity: 0,
                color: "#fff",
              }}
            >
              <PlusOutlined />
              <div style={{ fontSize: "12px", marginTop: "4px" }}>Upload</div>
            </div>
            {uploading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #434343",
                    borderTop: "2px solid #ff4d4f",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
              </div>
            )}
          </div>
        </Upload>
      </div>
    );
  }

  // Dragger type (multiple files)
  return (
    <div>
   
       <Dragger
        {...uploadProps}
        style={{
          backgroundColor: "#1a1a1a",
          border: "2px dashed #434343",
          borderRadius: "8px",
        }}
      >
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "48px", color: "#666", marginBottom: "16px" }}>
            {icon && <InboxOutlined />}
            {img}
          </p>
          <p style={{ color: "#fff", fontSize: "16px", marginBottom: "8px" }}>
            {title}
          </p>
          <p style={{ color: "#999", fontSize: "14px" }}>{description}</p>
        </div>
        {uploading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                border: "2px solid #434343",
                borderTop: "2px solid #ff4d4f",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "8px",
              }}
            ></div>
            <div>Uploading...</div>
          </div>
        )}
      </Dragger>
   

      {/* Preview uploaded files */}
      {showPreview && previewFiles.length > 0 && (
        <div className="preview-uploaded-view" style={{ marginTop: "20px" }}>
          <h4 style={{ color: "#fff", marginBottom: "15px" }}>
            {previewFiles.some((f) => f.isExisting)
              ? "Existing & New Files"
              : "Uploaded Files"}{" "}
            ({previewFiles.length}/{maxFiles})
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {previewFiles.map((file) => (
              <div
                key={file.id}
                style={{
                  position: "relative",
                  border: "1px solid #434343",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                }}
              >
                {/* File preview */}
                <div
                  style={{
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {file.type === "image" ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : file.type === "video" ? (
                    <video
                      src={file.preview}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>

                {/* File info */}
                <div style={{ padding: "8px", borderTop: "1px solid #434343" }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "12px",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      color: file.uploaded ? "#52c41a" : "#ff4d4f",
                      fontSize: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {file.isExisting
                      ? "📁 Existing"
                      : file.uploaded
                      ? "✓ Uploaded"
                      : "⏳ Uploading..."}
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeFile(file.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    color: "#ff4d4f",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "none",
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    padding: 0,
                  }}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFileUpload;