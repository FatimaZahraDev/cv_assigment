import React, { useEffect, useState } from "react";
import BaseInput from "@/components/shared/inputs";
import SimpleFileUpload from "@/components/shared/fileupload/SimpleFileUpload";
import FlatButton from "@/components/shared/button/flatbutton";
import { Form, Tag } from "antd";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";
import Helper from "@/helpers";
import dayjs from "dayjs";

const CreateEvent = ({ onEventSuccess, initialData = {} }) => {
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);
  const isEditMode = Boolean(initialData && initialData);

  /* 🟣 ①  Load initialData every time modal opens for edit */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // pre‑fill form fields
      form.setFieldsValue({
        title: initialData.title,
        location: initialData.location,
        description: initialData.description,
        start_date: dayjs(initialData.start_date), // YYYY‑MM‑DD
        end_date: dayjs(initialData.end_date),
        start_time: dayjs(initialData.start_time, "HH:mm:ss"),
        end_time: dayjs(initialData.end_time, "HH:mm:ss"),
      });

      // pre‑fill media
      setAttachments(initialData.attachments || []);
    } else {
      // if it's "create", clear the form
      form.resetFields();
      setAttachments([]);
    }
  }, [initialData]);
  const { mutate: createEvent, isPending: isCreating } = useMutation(
    "createEvent",
    {
      useFormData: false,
      invalidateQueries: [{ queryKey: ["getEvent"] }],
      onSuccess: async (data) => {
        if (data) {
          onEventSuccess?.(data);
          form.resetFields();
          setAttachments([]);
        }
      },
    }
  );
  const { mutate: updateEvent, isPending: isUpdating } = useMutation(
    "updateEvent",

    {
      invalidateQueries: [{ queryKey: ["getEvent"] }],
      useFormData: false,
      onSuccess: async (data) => {
        if (data) {
          onEventSuccess?.(data);
          form.resetFields();
          setAttachments([]);
        }
      },
    }
  );

  const onFinish = (values) => {
    let transformedData = {
      ...values,
      start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
      start_time: dayjs(values.start_time).format("HH:mm:ss"),
      end_time: dayjs(values.end_time).format("HH:mm:ss"),
      attachments,
      latitude: 40.6972846,
      longitude: 74.1443128,
    };

    if (isEditMode) {
      updateEvent({ slug: initialData.id, data: transformedData });
    } else {
      createEvent(transformedData);
    }
  };

  // Handle successful file upload
  const handleFileUploadSuccess = (response) => {
    // Map the response to the required attachments format
    const newAttachment = {
      url: response.data.data.url,
      type: response.data.data.type,
    };

    // Add to attachments array
    setAttachments((prev) => {
      const updated = [...prev, newAttachment];
      return updated;
    });
  };

  // Handle file upload error
  const handleFileUploadError = (error) => {
    console.error("File upload failed:", error);
  };

  // Handle file removal
  const handleFileRemove = (removedFile) => {
    // Remove from attachments array
    setAttachments((prev) => {
      const updated = prev.filter(
        (attachment) => attachment.url !== removedFile.url
      );
      return updated;
    });
  };

  return (
    <Form
      layout="vertical"
      className="form-input modal-input mt-4"
      onFinish={onFinish}
      form={form}
    >
      <div className="row">
        <div className="col-12">
          <div style={{ marginBottom: "10px" }}>
            <label
              style={{ color: "#fff", marginBottom: "8px", display: "block" }}
            >
              Event Media (Images/Videos)
            </label>
          </div>
          <SimpleFileUpload
            type="dragger"
            initialFileList={attachments}
            onUploadSuccess={handleFileUploadSuccess}
            onUploadError={handleFileUploadError}
            onFileRemove={handleFileRemove}
            maxSize={50}
            multiple={true}
            maxFiles={5}
          />
        </div>

        <div className="row mt-5">
          <div className="col-12 col-md-8">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="Ex: Modified Super Cars"
                  label="Event Title"
                  name="title"
                  rules={combineRules("Event Title", validations.required)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="Enter Location"
                  label="Event Location"
                  name="location"
                  rules={combineRules("Event Location", validations.required)}
                />
              </div>

              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="Select Date"
                  label="Event Start Date"
                  type="datepiker"
                  name="start_date"
                  format="YYYY-MM-DD"
                  rules={combineRules("Event Date", validations.required)}
                  disablePastDates={true}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="Select Date"
                  label="Event End Date"
                  type="datepiker"
                  name="end_date"
                  format="YYYY-MM-DD"
                  rules={combineRules("Event End Date", validations.required)}
                  disablePastDates={true}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="05:30 pm"
                  label="Event Start Time"
                  type="timepiker"
                  name="start_time"
                  format="HH:mm:ss"
                  rules={combineRules("Event Time", validations.required)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <BaseInput
                  placeholder="05:30 pm"
                  label="Event End Time"
                  type="timepiker"
                  name="end_time"
                  format="HH:mm:ss"
                  rules={[
                    validations.required("Event End Time"),
                    ({ getFieldValue }) => ({
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve();
                        }

                        const startDate = getFieldValue("start_date");
                        const endDate = getFieldValue("end_date");
                        const startTime = getFieldValue("start_time");

                        // If start date and end date are the same, check time validation
                        if (
                          startDate &&
                          endDate &&
                          startTime &&
                          dayjs(startDate).format("YYYY-MM-DD") ===
                            dayjs(endDate).format("YYYY-MM-DD")
                        ) {
                          const startTimeFormatted =
                            dayjs(startTime).format("HH:mm:ss");
                          const endTimeFormatted =
                            dayjs(value).format("HH:mm:ss");

                          if (endTimeFormatted <= startTimeFormatted) {
                            return Promise.reject(
                              new Error(
                                "End time must be after start time when dates are the same"
                              )
                            );
                          }
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                  dependencies={["start_date", "end_date", "start_time"]}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="col-12 col-md-12">
              <BaseInput
                name="description"
                placeholder="Lorem Ipsum iss, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                label="Event Description"
                type="textarea"
                rows={6}
                rules={combineRules("Event Description", validations.required)}
              />
            </div>

            <div className="col-12 col-md-12 mt-3">
              <FlatButton
                title={
                  isCreating || isUpdating
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Event"
                    : "Create Event"
                }
                className="car-detail-btn btn-bg-red mb-0 theme-button"
                htmlType="submit"
                loading={isCreating || isUpdating}
                disabled={isCreating || isUpdating}
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CreateEvent;
