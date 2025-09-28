import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import useImageUpload from "@/hooks/useImageUpload";
import uploadService from "@/services/uploadService";

const { Dragger } = Upload;

const UploadCover = ({ onUploadSuccess, initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const { loading, uploadCoverImage } = useImageUpload();

  const beforeUpload = (file) => {
    // Use the validation from uploadService
    const validation = uploadService.validateImageFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB for cover images
      allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
    });

    if (!validation.isValid) {
      message.error(validation.error);
      return false;
    }

    return true;
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      const result = await uploadCoverImage(file, {
        onSuccess: (data) => {
          console.log("Upload Response: ", data);
          // Get the uploaded image URL from response
          const uploadedImageUrl =
            data?.url || data?.data?.url || data?.data?.data?.url;
          if (uploadedImageUrl) {
            setImageUrl(uploadedImageUrl);
          } else {
            console.warn("Image URL not found in response");
          }

          if (onUploadSuccess) onUploadSuccess(data, "cover_image");
        },
        onError: (error) => {
          onError(error);
        },
        showSuccessMessage: true,
      });
    } catch (error) {
      onError(error);
    }
  };

  const handleChange = (info) => {
    const { status } = info.file;
    if (status === "done") {
    } else if (status === "error") {
    }
  };

  return (
    <div className="upload-cover-container">
      <Dragger
        name="cover_image"
        customRequest={handleCustomUpload}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={false}
        accept="image/*"
        style={{
          background: imageUrl ? `url(${imageUrl}) center/cover` : "#181717",
          borderRadius: "6px",
          minHeight: "200px",
          position: "relative",
        }}
      >
        {console.log("imageUrl", imageUrl)}
        {imageUrl ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              borderRadius: "6px",
            }}
          ></div>
        ) : (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: "48px", color: "#999" }} />
            </p>
            <p
              className="ant-upload-text"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#666",
                margin: "16px 0 8px 0",
              }}
            >
              Click or drag cover image to upload
            </p>
            <p
              className="ant-upload-hint"
              style={{
                fontSize: "14px",
                color: "#999",
                margin: 0,
              }}
            >
              Support for JPG, PNG up to 5MB
            </p>
          </div>
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div className="ant-spin ant-spin-spinning">
                <span className="ant-spin-dot ant-spin-dot-spin">
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                </span>
              </div>
              <span style={{ color: "#666", fontSize: "14px" }}>
                Uploading...
              </span>
            </div>
          </div>
        )}
      </Dragger>
    </div>
  );
};

export default UploadCover;
