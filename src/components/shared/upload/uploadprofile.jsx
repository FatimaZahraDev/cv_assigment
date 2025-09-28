import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import useImageUpload from "@/hooks/useImageUpload";
import uploadService from "@/services/uploadService";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const UploadProfile = ({
  imageType = "profile_image",
  onUploadSuccess,
  initialImageUrl,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const { loading, uploadProfileImage, uploadCoverImage } = useImageUpload();

  const beforeUpload = (file) => {
    // Use the validation from uploadService
    const validation = uploadService.validateImageFile(file);
    return validation.isValid;
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      let result;

      if (imageType === "profile_image") {
        result = await uploadProfileImage(file, {
          onSuccess: (data) => {
            // Get the uploaded image URL from response
            const uploadedImageUrl = data?.data?.image_url || data?.data?.url;
            if (uploadedImageUrl) {
              setImageUrl(uploadedImageUrl);
            } else {
              // Fallback to base64 preview
              getBase64(file, (url) => setImageUrl(url));
            }

            if (onUploadSuccess) onUploadSuccess(data, imageType);
            onSuccess(data);
          },
          onError: (error) => {
            onError(error);
          },
        });
      } else if (imageType === "cover_image") {
        result = await uploadCoverImage(file, {
          onSuccess: (data) => {
            // Get the uploaded image URL from response
            const uploadedImageUrl = data?.data?.image_url || data?.data?.url;
            if (uploadedImageUrl) {
              setImageUrl(uploadedImageUrl);
            } else {
              // Fallback to base64 preview
              getBase64(file, (url) => setImageUrl(url));
            }

            if (onUploadSuccess) onUploadSuccess(data, imageType);
            onSuccess(data);
          },
          onError: (error) => {
            onError(error);
          },
        });
      }
    } catch (error) {
      onError(error);
    }
  };

  const uploadButton = (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src="/assets/img/placeholder.png"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%", // Optional if picture-circle
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "50%",
          padding: "5px",
          color: "#fff",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
      </div>
    </div>
  );

  return (
    <div>
      <Upload
        name={imageType}
        listType="picture-circle"
        className={className}
        showUploadList={false}
        customRequest={handleCustomUpload}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img
            src={imageUrl || "/assets/img/placeholder.png"}
            alt={imageType}
            style={{ width: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
};

export default UploadProfile;
