import React, { useState } from "react";
import { Card, Row, Col, Typography, Space, Button } from "antd";
import UploadProfile from "@/components/shared/upload/uploadprofile";
import useImageUpload from "@/hooks/useImageUpload";
import uploadService from "@/services/uploadService";

const { Title, Text } = Typography;

/**
 * Example component demonstrating how to use the image upload functionality
 * for both profile and cover images using the allTypeFileUpload API
 */
const ImageUploadExample = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const { loading, uploadProgress } = useImageUpload();

  // Handle successful uploads
  const handleUploadSuccess = (data, imageType) => {
    console.log(`${imageType} uploaded successfully:`, data);
    
    // Extract the image URL from the response
    const imageUrl = data?.data?.image_url || data?.data?.url;
    
    if (imageType === "profile_image") {
      setProfileImageUrl(imageUrl);
    } else if (imageType === "cover_image") {
      setCoverImageUrl(imageUrl);
    }
  };

  // Example of using the upload service directly
  const handleDirectUpload = async (file, imageType) => {
    try {
      const result = await uploadService.uploadImage(imageType, file, {
        showSuccessNotification: true,
      });
      
      console.log("Direct upload result:", result);
      handleUploadSuccess(result, imageType);
    } catch (error) {
      console.error("Direct upload failed:", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>Image Upload Examples</Title>
      <Text type="secondary">
        Demonstrating the use of allTypeFileUpload API for both profile and cover images
      </Text>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {/* Profile Image Upload */}
        <Col xs={24} md={12}>
          <Card title="Profile Image Upload" bordered>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <UploadProfile
                imageType="profile_image"
                onUploadSuccess={handleUploadSuccess}
                initialImageUrl={profileImageUrl}
              />
              
              <div>
                <Text strong>Usage:</Text>
                <pre style={{ 
                  background: "#f5f5f5", 
                  padding: "12px", 
                  borderRadius: "4px",
                  fontSize: "12px",
                  overflow: "auto"
                }}>
{`<UploadProfile
  imageType="profile_image"
  onUploadSuccess={handleUploadSuccess}
  initialImageUrl={profileImageUrl}
/>`}
                </pre>
              </div>

              {profileImageUrl && (
                <div>
                  <Text strong>Uploaded URL:</Text>
                  <br />
                  <Text code>{profileImageUrl}</Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>

        {/* Cover Image Upload */}
        <Col xs={24} md={12}>
          <Card title="Cover Image Upload" bordered>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <UploadProfile
                imageType="cover_image"
                onUploadSuccess={handleUploadSuccess}
                initialImageUrl={coverImageUrl}
              />
              
              <div>
                <Text strong>Usage:</Text>
                <pre style={{ 
                  background: "#f5f5f5", 
                  padding: "12px", 
                  borderRadius: "4px",
                  fontSize: "12px",
                  overflow: "auto"
                }}>
{`<UploadProfile
  imageType="cover_image"
  onUploadSuccess={handleUploadSuccess}
  initialImageUrl={coverImageUrl}
/>`}
                </pre>
              </div>

              {coverImageUrl && (
                <div>
                  <Text strong>Uploaded URL:</Text>
                  <br />
                  <Text code>{coverImageUrl}</Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Direct API Usage Examples */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="Direct API Usage Examples" bordered>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={4}>Using the Upload Service Directly</Title>
                <pre style={{ 
                  background: "#f5f5f5", 
                  padding: "16px", 
                  borderRadius: "4px",
                  fontSize: "13px",
                  overflow: "auto"
                }}>
{`import uploadService from "@/services/uploadService";

// Upload profile image
const uploadProfileImage = async (file) => {
  try {
    const result = await uploadService.uploadProfileImage(file, {
      showSuccessNotification: true,
    });
    console.log("Profile image uploaded:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Upload cover image
const uploadCoverImage = async (file) => {
  try {
    const result = await uploadService.uploadCoverImage(file, {
      showSuccessNotification: true,
    });
    console.log("Cover image uploaded:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Generic upload method
const uploadImage = async (imageType, file) => {
  try {
    const result = await uploadService.uploadImage(imageType, file, {
      showSuccessNotification: true,
    });
    console.log("Image uploaded:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};`}
                </pre>
              </div>

              <div>
                <Title level={4}>Using the Custom Hook</Title>
                <pre style={{ 
                  background: "#f5f5f5", 
                  padding: "16px", 
                  borderRadius: "4px",
                  fontSize: "13px",
                  overflow: "auto"
                }}>
{`import useImageUpload from "@/hooks/useImageUpload";

const MyComponent = () => {
  const { loading, uploadProgress, uploadProfileImage, uploadCoverImage } = useImageUpload();

  const handleProfileUpload = async (file) => {
    const result = await uploadProfileImage(file, {
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.error("Error:", error),
      showSuccessMessage: true,
      validateFile: true,
    });
  };

  return (
    <div>
      {loading && <div>Uploading... {uploadProgress}%</div>}
      {/* Your upload UI here */}
    </div>
  );
};`}
                </pre>
              </div>

              <div>
                <Title level={4}>API Payload Structure</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Profile Image:</Text>
                    <pre style={{ 
                      background: "#f5f5f5", 
                      padding: "12px", 
                      borderRadius: "4px",
                      fontSize: "12px",
                      marginTop: "8px"
                    }}>
{`FormData:
Key: "profile_image"
Value: File (binary)`}
                    </pre>
                  </Col>
                  <Col span={12}>
                    <Text strong>Cover Image:</Text>
                    <pre style={{ 
                      background: "#f5f5f5", 
                      padding: "12px", 
                      borderRadius: "4px",
                      fontSize: "12px",
                      marginTop: "8px"
                    }}>
{`FormData:
Key: "cover_image"
Value: File (binary)`}
                    </pre>
                  </Col>
                </Row>
              </div>

              {loading && (
                <div style={{ 
                  padding: "16px", 
                  background: "#e6f7ff", 
                  border: "1px solid #91d5ff",
                  borderRadius: "4px"
                }}>
                  <Text>Upload in progress... {uploadProgress}%</Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageUploadExample;