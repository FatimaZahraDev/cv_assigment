import React, { useState } from "react";
import { Card, Space, Typography, Divider } from "antd";
import FileUpload from "./index";

const { Title, Text } = Typography;

/**
 * Example component demonstrating FileUpload usage
 * This is for demonstration purposes only
 */
const FileUploadExample = () => {
  const [uploadResults, setUploadResults] = useState([]);

  const handleUploadSuccess = (response, type) => {
    console.log(`${type} upload successful:`, response);
    setUploadResults(prev => [...prev, {
      type,
      success: true,
      data: response,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleUploadError = (error, type) => {
    console.log(`${type} upload failed:`, error);
    setUploadResults(prev => [...prev, {
      type,
      success: false,
      error: error.message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2} style={{ color: "#fff" }}>
        FileUpload Component Examples
      </Title>
      
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Avatar Upload Example */}
        <Card 
          title="Profile Picture Upload (type='profile')" 
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #434343" }}
          headStyle={{ color: "#fff", borderBottom: "1px solid #434343" }}
          bodyStyle={{ backgroundColor: "#1a1a1a" }}
        >
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Text style={{ color: "#999" }}>
              Click on the avatar to upload a profile picture
            </Text>
            <FileUpload
              type="profile"
              defaultImage="/assets/img/default-avatar.png"
              onUploadSuccess={(response) => handleUploadSuccess(response, "Profile")}
              onUploadError={(error) => handleUploadError(error, "Profile")}
              maxSize={5}
              acceptedTypes={["image/*"]}
            />
          </Space>
        </Card>

        {/* Dragger Upload Example */}
        <Card 
          title="Media Upload (type='dragger')" 
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #434343" }}
          headStyle={{ color: "#fff", borderBottom: "1px solid #434343" }}
          bodyStyle={{ backgroundColor: "#1a1a1a" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text style={{ color: "#999" }}>
              Drag and drop or click to upload images and videos
            </Text>
            <FileUpload
              type="dragger"
              onUploadSuccess={(response) => handleUploadSuccess(response, "Media")}
              onUploadError={(error) => handleUploadError(error, "Media")}
              maxSize={50}
              acceptedTypes={["image/*", "video/*"]}
            />
          </Space>
        </Card>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <Card 
            title="Upload Results" 
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #434343" }}
            headStyle={{ color: "#fff", borderBottom: "1px solid #434343" }}
            bodyStyle={{ backgroundColor: "#1a1a1a" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {uploadResults.map((result, index) => (
                <div key={index} style={{ 
                  padding: "10px", 
                  backgroundColor: result.success ? "#1f4e1f" : "#4e1f1f",
                  borderRadius: "4px",
                  border: `1px solid ${result.success ? "#52c41a" : "#ff4d4f"}`
                }}>
                  <Text style={{ color: "#fff" }}>
                    <strong>{result.type}</strong> - {result.timestamp}
                  </Text>
                  <br />
                  <Text style={{ color: result.success ? "#52c41a" : "#ff4d4f" }}>
                    {result.success ? "✅ Success" : "❌ Failed"}
                  </Text>
                  {result.success && result.data && (
                    <div style={{ marginTop: "5px" }}>
                      <Text style={{ color: "#999", fontSize: "12px" }}>
                        Response: {JSON.stringify(result.data, null, 2)}
                      </Text>
                    </div>
                  )}
                  {!result.success && (
                    <div style={{ marginTop: "5px" }}>
                      <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                        Error: {result.error}
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default FileUploadExample;