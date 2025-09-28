import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Form, Radio, Switch } from "antd";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import SimpleFileUpload from "@/components/shared/fileupload/SimpleFileUpload";
import HelpBox from "@/components/shared/box/helpbox";
import { useMutation, useQuery } from "@/hooks/reactQuery";
import { useQueryClient } from "@tanstack/react-query";
import { combineRules, validations } from "@/config/rules";

const PostAddWizard = () => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState([]);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Check if we're in edit mode
  const isEditMode = location?.state?.isEdit;
  const vehicleData = location?.state?.vehicleData;
  console.log("vehicleData", vehicleData);
  const { data: dropdownData, isLoading: isDropdownLoading } =
    useQuery("alldropdowm");
  console.log("dropdownData", dropdownData);
  const getOptions = (key) => {
    if (!dropdownData?.data || !dropdownData.data[key]) return [];
    return dropdownData.data[key].map((item) => ({
      label: item.name || item.label || item.title,
      value: item.id || item.value,
    }));
  };

  const updateFormData = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const handleFinishStep1 = (values) => {
    updateFormData(values);
    setCurrentStep(2);
  };

  const handleFinishStep2 = (values) => {
    updateFormData(values);
    setCurrentStep(3);
  };

  // Back navigation handlers
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const { mutate: createVehicle, isPending: isCreating } = useMutation(
    "createVehicle",
    {
      useFormData: false,
      onSuccess: async (data) => {
        if (data) {
          // Clear all vehicle-related queries from cache
          queryClient.removeQueries({ queryKey: ["getAllVehicle"] });
          queryClient.removeQueries({ queryKey: ["getMineVehicle"] });
          queryClient.removeQueries({ queryKey: ["getVehicleById"] });

          // Navigate and reload
          navigate("/profile/myadd");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
    }
  );

  const { mutate: updateVehicle, isPending: isUpdating } = useMutation(
    "updateVehicle",
    {
      useFormData: false,
      onSuccess: async (data) => {
        if (data) {
          // Aggressively clear all vehicle-related cache
          queryClient.clear();

          // Navigate and force reload
          navigate("/profile/myadd");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
    }
  );

  // Pre-fill form data when in edit mode - exactly like Event Edit
  useEffect(() => {
    if (isEditMode && vehicleData && Object.keys(vehicleData).length > 0) {
      // Convert existing attachments to the format expected by the component
      const existingAttachments =
        vehicleData.attachments?.map((att) => ({
          url: att.file_url,
          type: att.file_url?.toLowerCase().endsWith(".mp4")
            ? "video"
            : "image",
        })) || [];

      setAttachments(existingAttachments);

      // Pre-fill form fields using setFieldsValue - same as Event Edit
      const preFilledData = {
        category_id: vehicleData?.category_id,
        sub_category_id: vehicleData?.sub_category_id,
        make_id: vehicleData?.make_id,
        model_id: vehicleData?.model_id,
        year_id: vehicleData?.year_id,
        mileage_id: vehicleData?.mileage_id,
        fuel_type_id: vehicleData?.fuel_type_id,
        transmission_type_id: vehicleData?.transmission_type_id,
        city_id: vehicleData?.city_id,
        state_id: vehicleData?.state_id,
        registration_status_id: vehicleData?.registration_status_id,
        engine_modification_id: vehicleData?.engine_modification_id,
        exhaust_system_id: vehicleData?.exhaust_system_id,
        suspension_id: vehicleData?.suspension_id,
        wheels_tires_id: vehicleData?.wheels_tires_id,
        brakes_id: vehicleData?.brakes_id,
        body_kit_id: vehicleData?.body_kit_id,
        interior_upgrade_id: vehicleData?.interior_upgrade_id,
        performance_tuning_id: vehicleData?.performance_tuning_id,
        electronics_id: vehicleData?.electronics_id,
        interior_exterior_id: vehicleData?.interior_exterior_id,
        description: vehicleData?.description,
        price: vehicleData?.price,
        is_featured: vehicleData?.is_featured,
      };

      // Set form values for all steps - exactly like Event Edit
      form1.setFieldsValue(preFilledData);
      form2.setFieldsValue(preFilledData);
      form3.setFieldsValue(preFilledData);
      setFormData(preFilledData);
    } else {
      // If it's create mode, clear the forms
      form1.resetFields();
      form2.resetFields();
      form3.resetFields();
      setFormData({});
      setAttachments([]);
    }
  }, [isEditMode, vehicleData]);

  // File upload handlers (same as CreateEvent)
  const handleFileUploadSuccess = (response) => {
    const newAttachment = {
      url: response.data.data.url,
      type: response.data.data.type,
    };
    setAttachments((prev) => [...prev, newAttachment]);
  };

  const handleFileUploadError = (error) => {
    console.error("File upload failed:", error);
  };

  const handleFileRemove = (removedFile) => {
    setAttachments((prev) => prev.filter((a) => a.url !== removedFile.url));
  };

  const handleFinalSubmit = (values) => {
    const attachmentUrls = attachments.map((attachment) => attachment.url);
    const finalData = { ...formData, ...values, attachments: attachmentUrls };

    if (isEditMode) {
      // Update existing vehicle
      updateVehicle({ slug: vehicleData.id, data: finalData });
    } else {
      // Create new vehicle
      createVehicle(finalData);
    }
  };

  if (currentStep === 1) {
    return (
      <Form
        layout="vertical"
        className="form-input vehicle-ad-inputs-error mt-4"
        onFinish={handleFinishStep1}
        form={form1}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <BaseInput
              label="Category"
              name="category_id"
              type="select"
              placeholder="Category"
              options={getOptions("categories")}
              loading={isDropdownLoading}
              rules={combineRules("Category", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Sub Category"
              name="sub_category_id"
              type="select"
              placeholder="Sub Category"
              options={getOptions("sub_categories")}
              loading={isDropdownLoading}
              rules={combineRules("Sub Category", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Vehicle Make"
              name="make_id"
              type="select"
              placeholder="Honda"
              options={getOptions("makes")}
              loading={isDropdownLoading}
              rules={combineRules("Vehicle Make", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Vehicle Model"
              name="model_id"
              type="select"
              placeholder="Vezel"
              options={getOptions("models")}
              loading={isDropdownLoading}
              rules={combineRules("Vehicle Model", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Vehicle Year"
              name="year_id"
              type="select"
              placeholder="2024"
              options={getOptions("years")}
              loading={isDropdownLoading}
              rules={combineRules("Vehicle Year", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Milage"
              name="mileage_id"
              type="select"
              placeholder="12,000 miles"
              options={getOptions("mileages")}
              loading={isDropdownLoading}
              rules={combineRules("Milage", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Fuel Type"
              name="fuel_type_id"
              type="select"
              placeholder="Petrol"
              options={getOptions("fuel_types")}
              loading={isDropdownLoading}
              rules={combineRules("Fuel Type", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Transmission Type"
              name="transmission_type_id"
              type="select"
              placeholder="Automatic"
              options={getOptions("transmission_types")}
              loading={isDropdownLoading}
              rules={combineRules("Transmission Type", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Registration"
              name="city_id"
              type="select"
              placeholder="Miami"
              options={getOptions("cities")}
              loading={isDropdownLoading}
              rules={combineRules("Registration", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Registration State"
              name="state_id"
              type="select"
              placeholder="Florida"
              options={getOptions("states")}
              loading={isDropdownLoading}
              rules={combineRules("Registration State", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Registration Status"
              name="registration_status_id"
              type="select"
              placeholder="Registered"
              options={getOptions("registration_statuses")}
              loading={isDropdownLoading}
              rules={combineRules("Registration Status", validations.required)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <FlatButton
              htmlType="submit"
              title="Continue to next step"
              className="car-detail-btn btn-bg-red theme-button"
            />
          </div>
        </div>
      </Form>
    );
  }

  if (currentStep === 2) {
    return (
      <Form
        layout="vertical"
        className="form-input mt-4 vehicle-ad-inputs-error"
        onFinish={handleFinishStep2}
        form={form2}
      >
        {/* Back button for Step 2 */}

        <div className="row">
          <div className="col-12 col-md-6">
            <BaseInput
              label="Engine Modifications"
              name="engine_modification_id"
              type="select"
              placeholder="Select option"
              options={getOptions("engine_modifications")}
              loading={isDropdownLoading}
              rules={combineRules("Engine Modifications", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Exhaust System"
              name="exhaust_system_id"
              type="select"
              placeholder="Select option"
              options={getOptions("exhaust_systems")}
              loading={isDropdownLoading}
              rules={combineRules("Exhaust System", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Suspension"
              name="suspension_id"
              type="select"
              placeholder="Select option"
              options={getOptions("suspensions")}
              loading={isDropdownLoading}
              rules={combineRules("Suspension", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Wheels & Tires"
              name="wheels_tires_id"
              type="select"
              placeholder="Select option"
              options={getOptions("wheels_tires")}
              loading={isDropdownLoading}
              rules={combineRules("Wheels & Tires", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Brakes"
              name="brakes_id"
              type="select"
              placeholder="Select option"
              options={getOptions("brakes")}
              loading={isDropdownLoading}
              rules={combineRules("Brakes", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Body Kits & Aero Parts"
              name="body_kit_id"
              type="select"
              placeholder="Select option"
              options={getOptions("body_kits")}
              loading={isDropdownLoading}
              rules={combineRules(
                "Body Kits & Aero Parts",
                validations.required
              )}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Interior Upgrades"
              name="interior_upgrade_id"
              type="select"
              placeholder="Select option"
              options={getOptions("interior_upgrades")}
              loading={isDropdownLoading}
              rules={combineRules("Interior Upgrades", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Performance"
              name="performance_tuning_id"
              type="select"
              placeholder="Select option"
              options={getOptions("performance_tunings")}
              loading={isDropdownLoading}
              rules={combineRules("Performance", validations.required)}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Electronics & Infotainment"
              name="electronics_id"
              type="select"
              placeholder="Select option"
              options={getOptions("electronics")}
              loading={isDropdownLoading}
              rules={combineRules(
                "Electronics & Infotainment",
                validations.required
              )}
            />
          </div>
          <div className="col-12 col-md-6">
            <BaseInput
              label="Interior & Exterior Condition"
              name="interior_exterior_id"
              type="select"
              placeholder="Select option"
              options={getOptions("interior_exteriors")}
              loading={isDropdownLoading}
              rules={combineRules(
                "Interior & Exterior Condition",
                validations.required
              )}
            />
          </div>
        </div>

        <div className="row">
          <h3 className="color-white font-30 mt-1">Description</h3>
          <p className="color-white-800 mt-2 pb-4">
            Lorem Ipsum is simply dummy text...
          </p>
          <div className="col-12">
            <BaseInput
              name="description"
              type="textarea"
              rows={3}
              rules={combineRules("Description", validations.required)}
              placeholder="Describe modifications..."
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <FlatButton
              onClick={handleBackToStep1}
              title="Back to previous step"
              className="car-detail-btn btn-bg-grey  theme-button"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <FlatButton
              htmlType="submit"
              title="Continue to next step"
              className="car-detail-btn btn-bg-red  theme-button"
            />
          </div>
        </div>
      </Form>
    );
  }

  return (
    <Form
      layout="vertical"
      className="form-input mt-4 vehicle-ad-inputs-error"
      onFinish={handleFinalSubmit}
      form={form3}
    >
      {/* Back button for Step 3 */}

      <div className="border-bottom mb-3">
        
          <SimpleFileUpload
            type="dragger"
            initialFileList={attachments}
            onUploadSuccess={handleFileUploadSuccess}
            onUploadError={handleFileUploadError}
            onFileRemove={handleFileRemove}
            maxSize={50}
            multiple={true}
            maxFiles={5}
            apiEndpoint="vehicleFileUpload"
            fileKey="attachment"
            rules={combineRules(
              "Attachments",
              validations.required("Attachments")
            )}
          />
       
      </div>
      <div className="mb-3">
        <h3 className="color-white font-30 mt-1">Set Price</h3>
        <p className="color-white-800 mt-2 mb-4">
          Lorem Ipsum is simply dummy text...
        </p>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="usd-input">
              <BaseInput
                icon={<p className="usd-p">USD</p>}
                placeholder="$100,000.00"
                className=""
                name="price"
                type="number"
                rules={combineRules("Price", validations.required)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="featured-box">
              <p>Featured Post</p>
              <Switch
                defaultChecked={formData.is_featured}
                onChange={(val) => updateFormData({ featured: val })}
                name="is_featured"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <FlatButton
              onClick={handleBackToStep2}
              title="Back to previous step"
              className="car-detail-btn btn-bg-grey  theme-button"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <FlatButton
              htmlType="submit"
              title={isEditMode ? "Update vehicle ad" : "Post vehicle ad"}
              className="car-detail-btn btn-bg-red  theme-button"
              loading={isEditMode ? isUpdating : isCreating}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PostAddWizard;
