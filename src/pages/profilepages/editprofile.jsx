import React, { memo, useMemo, useState } from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { Form, Skeleton } from "antd";
import FlatButton from "@/components/shared/button/flatbutton";
import BaseInput from "@/components/shared/inputs";
import CustomUpload from "@/components/shared/upload/index";
import { useMutation, useQuery } from "@/hooks/reactQuery";
import Loader from "@/components/shared/loader";
import Helper from "@/helpers";
import { useNavigate } from "react-router";
import { combineRules, validations } from "@/config/rules";
import UploadProfile from "@/components/shared/upload/uploadprofile";
import UploadCover from "@/components/shared/upload/uploadcover";
import EditPorfileSkeleton from "../../components/skeleton/editporfileskeleton";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const EditProfile = memo(() => {
  const [active, setActive] = useState(false);
  const handleActiveChange = (checked) => {
    setActive(checked);
  };
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // State to store uploaded image URLs
  const [uploadedProfileImage, setUploadedProfileImage] = useState(null);
  const [uploadedCoverImage, setUploadedCoverImage] = useState(null);

  // Fetch profile data with performance optimizations
  const {
    data: profileData,
    isLoading,
    error,
    isError,
  } = useQuery("getProfile", {
    // Performance optimizations
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

    // Data transformation for performance - align with server response structure
    select: useMemo(
      () => (response) => {
        console.log("response", response);
        // Extract user data from the server response structure: data.data.user
        const user = response?.data?.data?.user || {};
        return {
          name: user.name || "",
          email: user.email || "",
          contact_number: user.contact_number || "",
          profile_image: user.profile_image || "",
          cover_photo: user.cover_photo || "",
          company_name: user.company_name || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          street: user.street || "",
          // Add other fields as needed
        };
      },
      []
    ),

    notifyOnChangeProps: ["data", "error", "isLoading"],
  });
  console.log("profileData", profileData);

  const { mutate: updateUser, isPending } = useMutation("updateProfile", {
    invalidateQueries: ["getProfile"],
    onSuccess: async (data) => {
      if (data) {
        const updatedUser = data.data.data.user;

        window.user = {
          ...window.user,
          user: updatedUser,
        };
        await Helper.setStorageData("session", window.user);
        navigate("/profile/edit-profile");
      }
    },
  });

  const initialValues = useMemo(() => {
    if (!profileData) return {};

    return {
      name: profileData.name,
      email: profileData.email,
      contact_number: profileData.contact_number,
      address: profileData.address,
    };
  }, [profileData]);

  React.useEffect(() => {
    if (profileData && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues, profileData]);

  const handleProfileImageUpload = (data) => {
    const imageUrl = data?.data?.data?.url;
    if (imageUrl) {
      setUploadedProfileImage(imageUrl);
    }
  };

  // Handle cover image upload success
  const handleCoverImageUpload = (data, imageType) => {
    const imageUrl = data?.data?.data?.url;

    if (imageUrl) {
      setUploadedCoverImage(imageUrl);
    }
  };

  const onFinish = (values) => {
    const transformedData = {
      ...values,
      device: "web",
      device_token: "web-token-" + Date.now(), // Generate a web token
    };

    // Add uploaded image URLs to the payload
    if (uploadedProfileImage) {
      transformedData.profile_image = uploadedProfileImage;
    }
    if (uploadedCoverImage) {
      transformedData.cover_photo = uploadedCoverImage;
    }

    const finalPayload = {
      ...transformedData,
    };

    updateUser({ slug: window.user.id, data: finalPayload });
  };

  // Show loading state
  if (isLoading) {
    return <EditPorfileSkeleton />;
  }

  return (
    <ProfileLayout page_title="Edit Profile">
      <div className="row">
        <div className="col-12">
          <Form
            form={form}
            layout="vertical"
            className="form-input mt-4"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <div className="row">
              <div className="col-12">
                <div className="row justify-content-center mb-5">
                  <div className="col-12 text-center mb-5 position-relative">
                    <div className="mb-4">
                      <UploadCover
                        initialImageUrl={profileData?.cover_photo}
                        onUploadSuccess={handleCoverImageUpload}
                      />
                    </div>
                    <div className="mb-3 uploader-profile">
                      <UploadProfile
                        className="update-profile-icon"
                        imageType="profile_image"
                        initialImageUrl={profileData?.profile_image}
                        onUploadSuccess={handleProfileImageUpload}
                      />
                      <label className="form-label text-white">
                        Profile Picture
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <BaseInput
                  name="name"
                  placeholder="Ex: Baker Davis"
                  label="Full Name"
                  type="text"
                />
              </div>
              <div className="col-12 col-md-6">
                <BaseInput
                  name="email"
                  placeholder="Ex: baker.davis@example.com"
                  label="Email address"
                  type="email"
                />
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="contact_number"
                  label="Phone Number"
                  rules={[
                    validations.required("Phone Number"),
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve();
                        }
                        if (!isValidPhoneNumber(value)) {
                          return Promise.reject(
                            new Error(
                              "Please enter a valid phone number for the selected country"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className="phone-input-item"
                >
                  <PhoneInput
                    placeholder="Ex: +1 1234 546 752"
                    defaultCountry="US"
                    international
                    countryCallingCodeEditable={false}
                    className="custom-phone-input"
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <BaseInput name="address" placeholder="Ex:" label="Address" />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-3 col-lg-4 col-xl-5">
                <FlatButton
                  title={isPending ? "Submitting" : "Submit"}
                  className="car-detail-btn btn-bg-red mt-2 theme-button"
                  htmlType="submit"
                  loading={isPending}
                  disabled={isPending}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </ProfileLayout>
  );
});

EditProfile.displayName = "EditProfile";

export default EditProfile;
