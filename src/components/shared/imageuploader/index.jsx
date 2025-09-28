import React, { useRef, useState } from "react";
import { useMutation } from "@/hooks/reactQuery";

const ImageUploader = ({ value = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array(9).fill(null));

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    handleNewImages(files);
    e.target.value = null;
  };

  // Mutation for uploading images
  const { mutateAsync: uploadImage } = useMutation("allTypeFileUpload");

  const handleNewImages = async (files) => {
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("attachment", file); // ✅ required field
        const response = await uploadImage(formData);

        return {
          url: response?.data?.url || URL.createObjectURL(file),
          id: response?.data?.id,
          file,
        };
      })
    );

    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      for (
        let i = 0, j = 0;
        i < updatedImages.length && j < uploadedImages.length;
        i++
      ) {
        if (updatedImages[i] === null) {
          updatedImages[i] = uploadedImages[j];
          j++;
        }
      }
      if (onChange) {
        onChange(updatedImages.filter(Boolean));
      }
      return updatedImages;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      handleNewImages(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = (index) => {
    setImages((prevImages) => {
      const updated = [...prevImages];
      updated[index] = null;
      if (onChange) {
        onChange(updated.filter(Boolean));
      }
      return updated;
    });
  };

  return (
    <div className="row">
      {/* Upload Box */}
      <div className="col-12 col-md-6">
        <div
          className="upload-box-area"
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <div className="text-center">
            <div className="up-icon-img">
              <img
                src="/assets/img/upload-icon.png"
                alt="upload icon"
                style={{ width: "50px" }}
              />
            </div>
            <div className="pt-2">
              <p>Drag or Upload Cover Photo/video</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slots */}
      <div className="col-12 col-md-6">
        <div className="row">
          {images.map((img, index) => (
            <div className="col-4 mb-3" key={index}>
              <div
                className="upload-box-item image-slot"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {img ? (
                  <>
                    <img
                      src={img.url}
                      alt={`upload-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <img src="/assets/img/added-img.png" alt="placeholder" />
                )}
              </div>
            </div>
          ))}
          <p>For the cover picture we recommend using the landscape mode.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
