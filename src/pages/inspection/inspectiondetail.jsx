import React, { useState } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Form, Image, Radio } from "antd";
import { combineRules, validations } from "@/config/rules";
import dayjs from "dayjs";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const InspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    data: getVehicleData,
    isLoading,
    isError,
    error,
  } = useQuery("getAllVehicle", {
    params: { id },
  });
  console.log("getVehicleData", getVehicleData);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const vehicleDataID = Array.isArray(getVehicleData?.data)
    ? getVehicleData?.data[0]
    : getVehicleData?.data || null;

  const vehicleAttachments = vehicleDataID?.attachments || [];
  const fallbackImages = [
    "/assets/img/ford-mustang.png",
    "/assets/img/audi-a3.png",
    "/assets/img/tesla.png",
  ];

  const displayAttachments =
    vehicleAttachments.length > 0
      ? vehicleAttachments
      : fallbackImages.map((img) => ({ file_url: img, type: "image" }));
  const imageAttachments = displayAttachments.filter(
    (att) =>
      att.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || att.type === "image"
  );
  const videoAttachments = displayAttachments.filter(
    (att) =>
      att.file_url?.toLowerCase().endsWith(".mp4") || att.type === "video"
  );

  const VideoRenderer = ({ attachment, index, isThumb = false }) => (
    <video
      src={attachment.file_url}
      controls
      muted={isThumb}
      preload="metadata"
      style={{
        maxHeight: isThumb ? "80px" : "400px",
        width: isThumb ? "100%" : "100%",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  );

  const { mutate: createRequest, isPending: isCreating } = useMutation(
  "createInpesctionRequest",
  {
    useFormData: false,
    onSuccess: async (data) => {
      if (data) {
        // 🔹 Show success alert
        Swal.fire({
          imageUrl: "/assets/img/sweeit-img.png",
          imageWidth: 140,
          imageHeight: 140,
          title: "Inspection Request Sent",
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
          background: "#1e1e1e",
          color: "#ffffff",
          customClass: {
            popup: "dark-swal-popup",
            title: "dark-swal-title",
            confirmButton: "dark-swal-button",
          },
        });

        // 🔹 Reset all form fields
        form.resetFields();
      }
    },
  }
);
  const { data: dropdownData, isLoading: isDropdownLoading } =
    useQuery("alldropdowm");
  const getOptions = (key) => {
    if (!dropdownData?.data || !dropdownData.data[key]) return [];
    return dropdownData.data[key].map((item) => ({
      label: item.name || item.label || item.title,
      value: item.id || item.value,
    }));
  };

  const handleFinalSubmit = (values) => {
    const transformedData = {
      ...values,
      type: "self",
      vehicle_ad_id: vehicleDataID?.id || null,
      inspection_date: dayjs(values.inspection_date).format("YYYY-MM-DD"),
      inspection_time: dayjs(values.inspection_time).format("HH:mm"),
    };
    createRequest(transformedData);
  };

  const handleRequest = () => {
    Swal.fire({
      imageUrl: "/assets/img/sweeit-img.png", // 🖼️ Your custom image path here
      imageWidth: 140,
      imageHeight: 140,
      title: "Inspection Request Sent",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      confirmButtonColor: "#d33",
      confirmButtonText: "OK",
      background: "#1e1e1e",
      color: "#ffffff",
      customClass: {
        popup: "dark-swal-popup",
        title: "dark-swal-title",
        confirmButton: "dark-swal-button",
      },
    });
  };
  return (
    <InnerLayout headerClass="sub-header">
      <section className="forum-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center">
                <h2 className="color-red">Inspection</h2>
                <span className="color-red-500 font-26">/Vehicles</span>
              </div>
              <div className="">
                <h3 className="color-white font-50 mb-2">
                  <span>{vehicleDataID?.make?.name || "Unknown"}</span>{" "}
                  <span>{vehicleDataID?.model?.name || "Model"}</span>
                  <br />
                  {vehicleDataID?.transmission_type?.name || "Unknown"}
                </h3>
                <h3 className="color-white font-30  footer-border mt-3 pt-4">
                  Request Inspection
                </h3>
                <p className="color-white-500 font-18">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <div className="col-12 col-md-10 col-lg-9 col-xl-9">
                  <Radio.Group
                    name="inspectionType"
                    defaultValue={1}
                    className="custom-radio-group mt-4 mb-4"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 1) {
                        navigate(`/vehicle/inspection/${vehicleDataID.id}`); 
                      } else if (value === 2) {
                       navigate(`/vehicle/inspection-vendor/${vehicleDataID.id}`); 
                       
                      }
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div>
                        <Radio value={1} className="color-white">
                          Inspect by you
                        </Radio>
                      </div>
                      <div>
                        <Radio value={2} className="color-white">
                          Inspect by Vendor
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
                <div className="footer-border">
                  <h3 className="color-white font-30  mt-1 pt-2 ">
                    Inspect by you
                  </h3>
                  <p className="color-white-500 font-18">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
                <Form
                form={form}
                  layout="vertical"
                  className="form-input mt-4"
                  onFinish={handleFinalSubmit}
                >
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="full_name"
                        placeholder="Ex : Baker Davis"
                        label="Full name"
                        rules={combineRules("Full name", validations.required)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="phone_number"
                        placeholder="Ex : +1 1234 567 894"
                        label="Phone Number"
                        rules={combineRules("email", validations.required)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        placeholder="Miami"
                        label="Your City"
                        type="select"
                        name="city_id"
                        options={getOptions("cities")}
                        loading={isDropdownLoading}
                        rules={combineRules("City", validations.required)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        placeholder="Florida"
                        label="Your State"
                        type="select"
                        name="state_id"
                        options={getOptions("states")}
                        loading={isDropdownLoading}
                        rules={combineRules("State", validations.required)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_date"
                        placeholder="Select Date"
                        label="Inspection Date"
                        type="datepiker"
                        format="YYYY-MM-DD"
                        rules={combineRules(
                          "Inspection Date",
                          validations.required
                        )}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_time"
                        placeholder="05:30 pm"
                        label="InspectionTime"
                        type="timepiker"
                        format="HH:mm"
                        rules={combineRules(
                          "Inspection Time",
                          validations.required
                        )}
                      />
                    </div>
                  </div>
                  <h3 className="color-white font-30  mt-1">
                    Do you want a test drive?
                  </h3>
                  <div className="col-12 col-md-10 col-lg-9 col-xl-9">
                    <Form.Item
                      name="want_test_drive"
                      initialValue={true} // default Yes
                      rules={[
                        { required: true, message: "Please select an option" },
                      ]}
                      className="radio-area"
                    >
                      <Radio.Group className="custom-radio-group mt-4 mb-4">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <Radio value={true} className="color-white">
                              Yes I want
                            </Radio>
                          </div>
                          <div>
                            <Radio value={false} className="color-white">
                              No thanks
                            </Radio>
                          </div>
                        </div>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className="footer-border">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                      <FlatButton
                        htmlType="submit"
                        loading={isCreating}
                        disabled={isCreating}
                        title={isCreating ? "Request Inspection...." :"Request Inspection" }
                        className="car-detail-btn btn-bg-red mt-3 theme-button"
                        // onClick={handleRequest}
                      />
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="inpection-car-detail-area">
                <div className="car-detail-area-img">
                  <div className="slider-container">
                    <Swiper
                      modules={[Navigation, Pagination, Thumbs]}
                      slidesPerView={1}
                      navigation={{
                        nextEl: ".swiper-button-next-custom",
                        prevEl: ".swiper-button-prev-custom",
                      }}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      className="nested-card-slider-swiper"
                      style={{ width: "100%", height: "400px" }}
                    >
                      {/* AntD Image.PreviewGroup for IMAGES */}
                      <Image.PreviewGroup>
                        {imageAttachments.map((att, idx) => (
                          <SwiperSlide key={`img-${idx}`}>
                            <div
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            >
                              <Image
                                src={att.file_url}
                                alt={`img-${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Image.PreviewGroup>

                      {/* Normal video render */}
                      {videoAttachments.map((att, idx) => (
                        <SwiperSlide key={`vid-${idx}`}>
                          <VideoRenderer attachment={att} index={idx} />
                        </SwiperSlide>
                      ))}

                      {displayAttachments.length > 1 && (
                        <>
                          <div className="swiper-button-prev-custom"></div>
                          <div className="swiper-button-next-custom"></div>
                        </>
                      )}
                    </Swiper>

                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={Math.min(3, displayAttachments.length)}
                      watchSlidesProgress
                      className="second-slider"
                      style={{ marginTop: "10px" }}
                    >
                      {imageAttachments.map((att, idx) => (
                        <SwiperSlide key={`thumb-img-${idx}`}>
                          <div>
                            <img
                              src={att.file_url}
                              alt={`${
                                vehicleDataID?.make?.name || "Vehicle"
                              } thumbnail ${idx + 1}`}
                              className="img-fluid"
                              style={{
                                width: "100%",
                                height: "80px",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))}

                      {videoAttachments.map((att, idx) => (
                        <SwiperSlide key={`thumb-vid-${idx}`}>
                          <div>
                            <VideoRenderer
                              attachment={att}
                              index={idx}
                              isThumb
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                <div className="car-detail-area-body">
                  <h3 className="color-white font-50 mb-1">
                    <span>{vehicleDataID?.make?.name || "Unknown"}</span>{" "}
                    <span>{vehicleDataID?.model?.name || "Model"}</span>
                    <br />
                    {vehicleDataID?.transmission_type?.name || "Unknown"}
                  </h3>

                  <div className="d-flex align-item-center mb-2">
                    <img
                      src="/assets/img/light-location.png"
                      alt=""
                      className="img-fluid"
                    />
                    <p className="ms-2 color-white mt-1">
                      {vehicleDataID?.city?.name || "Unknown City"},{" "}
                      {vehicleDataID?.state?.name || "Unknown State"}
                    </p>
                  </div>
                  <p className="color-white-500 mb-2">
                    {vehicleDataID?.description || "No description available"}
                  </p>

                  <div className="seller-profile d-flex align-items-center mt-3">
                    <div className="seller-profile-img">
                      <img
                        src={
                          vehicleDataID?.user?.profile_image ||
                          "/assets/img/seller-profile.png"
                        }
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="ms-3">
                      <h2 className="color-white font-22 mb-1">
                        {vehicleDataID?.user?.name || "Unknown Seller"}
                      </h2>
                      <p className="color-white-800">Tap to view profile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default InspectionDetail;
