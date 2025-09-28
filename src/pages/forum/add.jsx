import React, { useState, useEffect } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import CustomUpload from "@/components/shared/inputs/upload";
import CommunityCard from "@/components/shared/card/communitycard";
import FlatButton from "@/components/shared/button/flatbutton";
import SimpleFileUpload from "@/components/shared/fileupload/SimpleFileUpload";
 import { Form, Switch } from "antd";
import { useMutation } from "@/hooks/reactQuery";

const AddForum = ({ editData = null, onEditComplete }) => {
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const isEditMode = Boolean(editData && Object.keys(editData).length > 0);

  // Load editData when in edit mode - same logic as event module
  useEffect(() => {
    console.log("=== EDIT DATA CHANGED ===");
    console.log("Edit Data:", editData);
    console.log("Edit Data Keys:", editData ? Object.keys(editData) : "null");

    if (editData && Object.keys(editData).length > 0) {
      console.log("Loading edit data for post ID:", editData.id);

      // pre-fill form fields
      form.setFieldsValue({
        description: editData.description,
      });

      // Set anonymous toggle based on existing data
      setIsAnonymous(editData.is_anonymous || false);

      // Debug: Log the exact structure of attachments
      console.log("Edit Data Attachments:", editData.attachments);
      console.log("Edit Data Full:", editData);

      // pre-fill media
      setAttachments(editData.attachments || []);
      console.log("Set attachments to:", editData.attachments || []);
    } else {
      console.log("Clearing form - create mode or no edit data");
      // if it's "create", clear the form
      form.resetFields();
      setAttachments([]);
      setIsAnonymous(false);
    }
  }, [editData, form]);

  const { mutate: createForum, isPending: isCreating } = useMutation(
    "createForum",
    {
      useFormData: false,
      invalidateQueries: [{ queryKey: ["getForum"] }],
      onSuccess: async (data) => {
        if (data) {
          form.resetFields();
          setAttachments([]);
          setIsAnonymous(false);
          if (onEditComplete) onEditComplete();
        }
      },
    }
  );

  const { mutate: updateForum, isPending: isUpdating } = useMutation(
    "updateForum",
    {
      invalidateQueries: [{ queryKey: ["getForum"] }],
      useFormData: false,
      onSuccess: async (data) => {
        console.log("Update successful, response data:", data);
        if (data) {
          form.resetFields();
          setAttachments([]);
          setIsAnonymous(false);
          if (onEditComplete) onEditComplete();
        }
      },
    }
  );

const getAttachmentUrls = (item) => {
  const urls = [];
  if (typeof item === "string") {
    urls.push(item);
  } else if (item && typeof item === "object") {
    const urlFields = ["url", "file_url", "attachment_url", "path", "full_url"];
    urlFields.forEach((field) => {
      if (item[field]) urls.push(item[field]);
    });
    // Handle SimpleFileUpload response structure
    if (item.data?.data?.url) urls.push(item.data.data.url);
    if (item.data?.url) urls.push(item.data.url);
  }
  return urls;
};

// Normalize URL for consistent matching
const normalizeUrl = (url) =>
  typeof url === "string" ? url.trim().replace(/\/+$/, "") : "";

// Handle successful file upload
const handleFileUploadSuccess = (response) => {
  const newAttachment = {
    url: response.data.data.url,
    type: response.data.data.type,
  };
  setAttachments((prev) => [...prev, newAttachment]);
};

// Handle file removal
const handleFileRemove = (removedFile) => {
  const removedUrls = getAttachmentUrls(removedFile).map(normalizeUrl);

  setAttachments((prev) =>
    prev.filter((attachment) => {
      const attachmentUrls = getAttachmentUrls(attachment).map(normalizeUrl);
      return !attachmentUrls.some((url) => removedUrls.includes(url));
    })
  );
};

// Handle direct removal by index
const handleDirectRemove = (index) => {
  setAttachments((prev) => prev.filter((_, i) => i !== index));
};

// Form submission
const onFinish = (values) => {
  const attachmentUrls = attachments
    .map((attachment) =>
      getAttachmentUrls(attachment).find((url) => /^https?:\/\//.test(url))
    )
    .filter(Boolean);

  const finalData = {
    ...values,
    attachments: attachmentUrls.length > 0 ? attachmentUrls : [], // ✅ send [] if empty
    privacy: "public",
    is_anonymous: isAnonymous, // Add anonymous flag
  };

  if (isEditMode) {
    updateForum({ slug: editData.id, data: finalData });
  } else {
    createForum(finalData);
  }
};

  // Get current user info
  const currentUser = window?.user?.user;
  const displayName = isAnonymous ? "Anonymous" : (currentUser?.name || "Anonymous");
  const displayImage = isAnonymous ? "/assets/img/anonymous-avatar.png" : (currentUser?.profile_image || "/assets/img/inspection-1.png");

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <div className="forum-list mb-3">
        <div className="d-flex w-100">
          <div className="forum-profile">
            <img src={displayImage} alt={displayName} />
          </div>
          <div className="ms-3 w-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h1 className="font-18 color-white">{displayName}</h1>
              
              {/* Anonymous Toggle */}
              {/* <div className="d-flex align-items-center">
                <span className="color-white-500 me-2">Post anonymously</span>
                <Switch
                  checked={isAnonymous}
                  onChange={setIsAnonymous}
                  size="small"
                />
              </div> */}
            </div>
            
            <BaseInput
              type="textarea"
              name="description"
              placeholder="want to say something..."
              className="color-white-800"
              autoSize={{ minRows: 1, maxRows: 10 }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#ffffff80",
              }}
            />
            {/* Display uploaded images below the input field */}
            {attachments.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: "10px",
                    maxWidth: "300px",
                  }}
                >
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        border: "1px solid #434343",
                        borderRadius: "6px",
                        overflow: "hidden",
                        backgroundColor: "#1a1a1a",
                      }}
                    >
                      <div
                        style={{
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {attachment.type === "image" ||
                        (!attachment.type &&
                          (attachment.url ||
                            attachment.file_url ||
                            typeof attachment === "string")) ? (
                          <img
                            src={
                              attachment.url ||
                              attachment.file_url ||
                              attachment
                            }
                            alt={`Upload ${index + 1}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : attachment.type === "video" ? (
                          <video
                            src={
                              attachment.url ||
                              attachment.file_url ||
                              attachment
                            }
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src={
                              attachment.url ||
                              attachment.file_url ||
                              attachment
                            }
                            alt={`Upload ${index + 1}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          console.log(
                            "Direct remove button clicked for attachment:",
                            attachment,
                            "at index:",
                            index
                          );
                          // Use direct index-based removal for custom buttons (more reliable)
                          handleDirectRemove(index);
                        }}
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          background: "rgba(0,0,0,0.7)",
                          color: "#ff4d4f",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="add-photo-upload">
          <SimpleFileUpload
            type="dragger"
            initialFileList={attachments}
            onUploadSuccess={handleFileUploadSuccess}
            // onUploadError={handleFileUploadError}
            onFileRemove={handleFileRemove}
            maxSize={50}
            multiple={true}
            maxFiles={10} // Increased to allow multiple images
            title="Add Photos"
            img={<img src="/assets/img/upload-gellary.png" />}
            icon={false}
            className="add-photo"
            showPreview={true}
            accept="image/*,video/*" // Only allow images and videos for forum posts
            description=""
            apiEndpoint="forumFileUpload"
          />
          <div>
            <FlatButton
              title={
                isCreating || isUpdating
                  ? isEditMode
                    ? "Updating..."
                    : "Posting..."
                  : isEditMode
                  ? "Update Post"
                  : "Post"
              }
              htmlType="submit"
              className="post-button"
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default AddForum;