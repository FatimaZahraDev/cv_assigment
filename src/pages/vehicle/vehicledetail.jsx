import React, { useState, useRef } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import FlatButton from "@/components/shared/button/flatbutton";
import CusstomCollapse from "@/components/shared/collapse/customcollapse";
import ModelList from "@/components/shared/list/modellist";
import { useNavigate, useParams } from "react-router";
import CustomModal from "@/components/shared/modal";
import { Form, Image, Spin } from "antd";
import BaseInput from "@/components/shared/inputs";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const videoStyles = {
  width: "100%",
  objectFit: "cover",
  borderRadius: "8px",
};

const imageStyles = {
  width: "100%",
  objectFit: "cover",
  borderRadius: "8px",
  cursor: "pointer",
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: getVehicleData,
    isLoading,
    isError,
    error,
  } = useQuery("getAllVehicle", {
    params: { id },
  });
  console.log(getVehicleData);
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

  const dynamicItems = [
    {
      key: "1",
      label: "Vehicle Specifications",
      children: (
        <div className="row">
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Make & Model"
              description={`${vehicleDataID?.make?.name || "Unknown"} ${
                vehicleDataID?.model?.name || "Model"
              }`}
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Year"
              description={vehicleDataID?.year?.name || "Unknown Year"}
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Fuel Type"
              description={
                vehicleDataID?.fuel_type?.name || "Unknown Fuel Type"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Transmission"
              description={
                vehicleDataID?.transmission_type?.name || "Unknown Transmission"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Mileage"
              description={`${vehicleDataID?.mileage?.name || "0"} Miles`}
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              image="/assets/img/engine.png"
              title="Body Type"
              description={vehicleDataID?.body_kit?.name || "Unknown Body Type"}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Vehicle Details",
      children: (
        <div className="row">
          <div className="col-12 col-md-6">
            <ModelList
              title="Engine Modifications"
              description={
                vehicleDataID?.engine_modification?.name || "Unknown Color"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Exhaust System"
              description={
                vehicleDataID?.exhaust_system?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Suspension"
              description={
                vehicleDataID?.suspension?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Wheels & Tires"
              description={
                vehicleDataID?.wheels_tires?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Brakes"
              description={vehicleDataID?.brakes?.name || "Unknown Condition"}
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Body kit and Aero parts"
              description={vehicleDataID?.body_kit?.name || "Unknown Condition"}
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Interior Upgrades"
              description={
                vehicleDataID?.interior_upgrade?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Performance tuning"
              description={
                vehicleDataID?.performance_tuning?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Electronics & Infotainment"
              description={
                vehicleDataID?.electronics?.name || "Unknown Condition"
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <ModelList
              title="Condition report"
              description={
                vehicleDataID?.condition?.name || "Unknown Condition"
              }
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Seller Details",
      children: (
        <div className="row">
          <div className="col-12 col-md-6">
            <ModelList
              isSeller
              title={vehicleDataID?.user?.name || "Unknown Seller"}
              sellerEmail={vehicleDataID?.user?.email || "No email available"}
              sellerImage={
                vehicleDataID?.user?.profile_image ||
                "/assets/img/seller-profile.png"
              }
              messageImage="/assets/img/seller-message.png"
            />
          </div>
        </div>
      ),
    },
  ];
  const loggedInUserId = window?.user?.user?.id;

  const { mutate: requestToken, isPending: isCreating } = useMutation(
    "requestToken",
    {
      useFormData: false,
      onSuccess: async (data) => {
        if (data) {
          // 🔹 Show success alert
          setIsModalOpen(false);
          Swal.fire({
            imageUrl: "/assets/img/sweeit-img.png",
            imageWidth: 140,
            imageHeight: 140,
            title: "Token Requested Sucessfully!",
            text: "To check the status, kindly view My token requests.",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          });

          // 🔹 Reset all form fields
          form.resetFields();
        }
      },
    }
  );
  const handleRequest = (values) => {
    const transformedData = {
      ...values,
      vehicle_ad_id: vehicleDataID?.id || null,
    };
    requestToken(transformedData);
  };
  const [form] = Form.useForm();

  if (isError) {
    console.error("API Error:", error);
    return (
      <InnerLayout headerClass="sub-header">
        <div className="container text-center text-white">
          <h2>Error loading vehicle details</h2>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </InnerLayout>
    );
  }

  return isLoading ? (
    <div className="loader-overlay">
      <Spin size="large" />
    </div>
  ) : (
    <InnerLayout headerClass="sub-header">
      <section className="slider-sec vehicle-detail-sec-slider">
        <div className="container">
          <div className="row ">
            <div className="col-12 col-md-6">
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
                        <VideoRenderer attachment={att} index={idx} isThumb />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="slider-card-detail-content">
                <p className="title color-white font-30 mb-2">Vehicles</p>
                <h3 className="color-white font-50 mb-1">
                  <span>{vehicleDataID?.make?.name || "Unknown"}</span>{" "}
                  <span>{vehicleDataID?.model?.name || "Model"}</span>
                  <br />
                  {vehicleDataID?.transmission_type?.name || "Unknown"}
                </h3>

                <div className="d-flex align-item-center mb-2">
                  <img src="/assets/img/outline-location.png" alt="" />
                  <p className="ms-2 color-white mt-1">
                    {vehicleDataID?.city?.name || "Unknown City"},{" "}
                    {vehicleDataID?.state?.name || "Unknown State"}
                  </p>
                </div>

                <h1 className="color-green font-80">
                  $
                  {vehicleDataID?.price
                    ? parseFloat(vehicleDataID.price).toLocaleString()
                    : "N/A"}
                </h1>
                <p className="color-white-500 mb-2">
                  {vehicleDataID?.description || "No description available"}
                </p>

                <div className="footer-border">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <FlatButton
                        title="Request Token"
                        className="car-detail-btn btn-bg-grey"
                        onClick={() => {
                          if (loggedInUserId === vehicleDataID?.user_id) {
                            // ✅ Apna hi ad hai → Alert show
                            Swal.fire({
                              icon: "info",
                              title: "Your own ad.",
                              text: "You cannot send a token request to your own ad.",
                              confirmButtonColor: "#d33",
                              confirmButtonText: "OK",
                              background: "#1e1e1e",
                              color: "#ffffff",
                            });
                          } else {
                            setIsModalOpen(true);
                          }
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <FlatButton
                        title="Message"
                        className="car-detail-btn btn-bg-red"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <FlatButton
                        title="Request Inspection"
                        className="car-detail-btn btn-bg-white"
                         onClick={() => {
                          if (loggedInUserId === vehicleDataID?.user_id) {
                            // ✅ Apna hi ad hai → Alert show
                            Swal.fire({
                              icon: "info",
                              title: "Your own ad.",
                              text: "You cannot send a inspection request to your own ad.",
                              confirmButtonColor: "#d33",
                              confirmButtonText: "OK",
                              background: "#1e1e1e",
                              color: "#ffffff",
                            });
                          } else {
                           navigate(`/vehicle/inspection/${vehicleDataID.id}`)
                          }
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <FlatButton
                        title="Car Compare"
                        className="car-detail-btn btn-bg-trans"
                        onClick={() => {
                          // Navigate to compare page with current vehicle data as left/selected car
                          navigate("/vehicle/compare", {
                            state: { selectedCar: vehicleDataID },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Collapse Section */}
      <section className="make-model-sec">
        <div className="container">
          <CusstomCollapse
            items={dynamicItems}
            className="car-detail-collapse"
          />
        </div>
      </section>

      {/* 🔹 Token Modal */}
      <CustomModal
        title="Request Token"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        className="car-modal"
      >
        <Form
          onFinish={handleRequest}
          layout="vertical"
          className="modal-input mt-4"
          form={form}
        >
          <h2 className="color-white font-20 mb-2">Add Token Amount here</h2>
          <p className="mb-3">Lorem Ipsum is simply dummy text.</p>
          <BaseInput
            name="token_money"
            placeholder="$1,000.00"
            type="number"
            rules={[{ required: true, message: "Please enter token amount" }]}
          />
          <h2 className="font-20 color-white mb-3 font-500">
            Tell your concerns to seller
          </h2>
          <BaseInput
            type="textarea"
            name="concern"
            rows={6}
            placeholder="Write here..."
          />
          <FlatButton
            htmlType="submit"
            title="Request"
            className="car-detail-btn btn-bg-red"
            // onClick={handleRequest}
          />
        </Form>
      </CustomModal>
    </InnerLayout>
  );
};

export default VehicleDetail;
