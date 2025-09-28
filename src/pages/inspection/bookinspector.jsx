import React, { useMemo } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import { Form, Radio } from "antd";
import FlatButton from "@/components/shared/button/flatbutton";
import { useLocation, useNavigate, useParams } from "react-router";
import BaseInput from "@/components/shared/inputs";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@/hooks/reactQuery";
import dayjs from "dayjs";
import { combineRules, validations } from "@/config/rules";

const BookInspectionVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeVehicleId } = useParams();
  const [form] = Form.useForm();

  const selectedInspector = location.state?.selectedInspector || null;
  const vehicle_ad_id = location.state?.vehicle_ad_id || routeVehicleId || null;

  console.log("Selected Inspector:", selectedInspector);

  // Dropdowns for city/state
  const { data: dropdownData, isLoading: isDropdownLoading } =
    useQuery("alldropdowm");
  const getOptions = (key) => {
    if (!dropdownData?.data || !dropdownData.data[key]) return [];
    return dropdownData.data[key].map((item) => ({
      label: item.name || item.label || item.title,
      value: item.id || item.value,
    }));
  };

  const { mutate: createRequest, isPending: isCreating } = useMutation(
    "createInpesctionRequest",
    {
      useFormData: false,
      onSuccess: async (data) => {
        if (data) {
          Swal.fire({
            imageUrl: "/assets/img/sweeit-img.png",
            imageWidth: 140,
            imageHeight: 140,
            title: "Inspection Request Sent",
            text: "Your vendor inspection request has been submitted.",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          });
          form.resetFields();
          navigate(-1);
        }
      },
    }
  );

  const onFinish = (values) => {

    const payload = {
       ...values,
      type: "vendor",
      card_id : 1,
      vehicle_ad_id: vehicle_ad_id ?? null,
      inspector_id: selectedInspector?.id ?? values.inspector_id,
      inspection_date_start: dayjs(values.inspection_date_start).format(
        "YYYY-MM-DD"
      ),
      inspection_date_end: dayjs(values.inspection_date_end).format(
        "YYYY-MM-DD"
      ),
      inspection_time_start: dayjs(values.inspection_time_start).format(
        "HH:mm"
      ),
      inspection_time_end: dayjs(values.inspection_time_end).format("HH:mm"),
    };
    createRequest(payload);
  };


  return (
    <InnerLayout headerClass="sub-header">
      <section className="forum-sec">
        <div className="container">
          <div className="row">
            {/* Left Column */}
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center">
                <h2 className="color-red">Inspection</h2>
                <span className="color-red-500 font-26">/Vehicles</span>
              </div>

              <h3 className="color-white font-50 mb-2">Booking Details</h3>

              <h3 className="color-white font-30 footer-border mt-3 pt-4">
                Request Inspection
              </h3>
              <p className="color-white-500 font-18">
                Provide your details and confirm vendor inspection request.
              </p>

              <div className="col-12 col-md-10 col-lg-9 col-xl-9">
                <Radio.Group
                  defaultValue={2}
                  className="custom-radio-group mt-4 mb-4"
                  onChange={(e) => {
                    navigate(
                      e.target.value === 1
                        ? "/inspection-detail"
                        : "/inspection-vendor"
                    );
                  }}
                >
                  <div className="d-flex justify-content-between w-100">
                    <Radio value={1} className="color-white">
                      Inspect by you
                    </Radio>
                    <Radio value={2} className="color-white">
                      Inspect by Vendor
                    </Radio>
                  </div>
                </Radio.Group>
              </div>

              <div className="footer-border border-bottom">
                <p className="color-red font-18">Step 2 out of 2</p>
                <h3 className="color-white font-30">Booking Details</h3>
                <p className="color-white-500 font-18">
                  Please provide basic information for scheduling.
                </p>
              </div>

              <div className="mt-3">
                <Form
                  form={form}
                  layout="vertical"
                  className="form-input mt-4"
                  onFinish={onFinish}
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
                        placeholder="Ex : 03211234567"
                        label="Phone Number"
                        rules={combineRules(
                          "Phone Number",
                          validations.required
                        )}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        placeholder="Your City"
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
                        placeholder="Your State"
                        label="Your State"
                        type="select"
                        name="state_id"
                        options={getOptions("states")}
                        loading={isDropdownLoading}
                        rules={combineRules("State", validations.required)}
                      />
                    </div>

                    {/* Start/End Date */}
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_date_start"
                        placeholder="Select Start Date"
                        label="Inspection Start Date"
                        type="datepiker"
                        format="YYYY-MM-DD"
                        rules={combineRules(
                          "Inspection Start Date",
                          validations.required
                        )}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_date_end"
                        placeholder="Select End Date"
                        label="Inspection End Date"
                        type="datepiker"
                        format="YYYY-MM-DD"
                        rules={combineRules(
                          "Inspection End Date",
                          validations.required
                        )}
                      />
                    </div>

                    {/* Start/End Time */}
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_time_start"
                        placeholder="10:00"
                        label="Inspection Start Time"
                        type="timepiker"
                        format="HH:mm"
                        rules={combineRules(
                          "Inspection Start Time",
                          validations.required
                        )}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        name="inspection_time_end"
                        placeholder="17:00"
                        label="Inspection End Time"
                        type="timepiker"
                        format="HH:mm"
                        rules={combineRules(
                          "Inspection End Time",
                          validations.required
                        )}
                      />
                    </div>
                    <div className="col-12">
                      <h3 className="color-white font-30 mb-4">
                        Tell us your Concerns about vehicle
                      </h3>
                      <BaseInput
                        placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since..."
                        label=""
                        name="description"
                        type="textarea"
                        rows={7}
                        rules={combineRules(
                          "Description",
                          validations.required
                        )}
                      />
                    </div>
                  </div>

                  <div className="footer-border">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                      <FlatButton
                        htmlType="button"
                        loading={isCreating}
                        disabled={isCreating}
                        title={
                          isCreating ? "Submitting..." : "Process Checkout"
                        }
                        className="car-detail-btn btn-bg-red mt-3 theme-button"
                      />
                    </div>
                  </div>
                </Form>
              </div>
            </div>

            {/* Right Column: Vehicle details (same UI as before) + vendor summary & pricing */}
            <div className="col-12 col-md-6">
              {/* Vehicle Details Card */}
              <VehicleSummary vehicleId={vehicle_ad_id} />

              {/* Vendor summary */}
              <div className="inspection-card akera-book-card mt-3">
                <div className="inspection-header">
                  <img src="/assets/img/akira-bg.png" alt="" />
                </div>
                <div className="inspection-body">
                  <div className="d-flex">
                    <div className="inspection-profile">
                      <img
                        src={
                          selectedInspector?.profile_image ||
                          "/assets/img/akera-img.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="ms-3 mt-3">
                      <h2 className="color-white font-40 mt-2 mb-1">
                        {selectedInspector?.name ||
                          selectedInspector?.full_name ||
                          "Vendor"}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-box mt-4">
                <h3 className="color-white font-40">Check Out</h3>
                <p className="mb-3 color-white-800">
                  Review your details and proceed to confirm your booking.
                </p>
                <div className="d-flex align-items-center">
                  <div className="card-area d-flex align-items-center">
                    <div>
                      <img alt="" src="/assets/img/master-card-black.png" />
                    </div>
                    <div className="ms-3">
                      <p>Credit/Debit Card</p>
                      <p>**** **** **** 4567</p>
                    </div>
                  </div>
                  <div className="ms-3 ">
                    {/* <FlatButton
                      type="button"
                      title="Add new Card?"
                      className="btn-bg-red theme-button add-new-btn"
                    /> */}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <div>
                    <p>Pricing structure</p>
                    <h2 className="color-white font-36">
                      {selectedInspector?.service_rate } <span>$</span>
                    </h2>
                  </div>
                  <div>
                    <FlatButton
                      title="Process Checkout"
                      className="car-detail-btn btn-bg-red mt-3 theme-button"
                      onClick={() => form.submit()}
                    />
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

// Vehicle summary subcomponent (reuses styles as in inspection detail page)
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Image, Spin } from "antd";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const VehicleSummary = ({ vehicleId }) => {
  const { data: getVehicleData, isLoading } = useQuery("getAllVehicle", {
    params: { id: vehicleId },
  });

  if (!vehicleId) return null;

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

  return (
    <div className="inpection-car-detail-area inpection-car-vender-area">
      <div className="row">
        <div className="col-12 col-md-6">
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
                className="nested-card-slider-swiper"
                style={{ width: "100%", height: "300px" }}
              >
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
                {videoAttachments.map((att, idx) => (
                  <SwiperSlide key={`vid-${idx}`}>
                    <video
                      src={att.file_url}
                      controls
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </SwiperSlide>
                ))}
                {displayAttachments.length > 1 && (
                  <>
                    <div className="swiper-button-prev-custom"></div>
                    <div className="swiper-button-next-custom"></div>
                  </>
                )}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="car-detail-area-body">
            <h3 className="color-white font-28 mb-1">
              <span>{vehicleDataID?.make?.name || "Unknown"}</span>{" "}
              <span>{vehicleDataID?.model?.name || "Model"}</span>
              <br />
              {vehicleDataID?.transmission_type?.name || "Unknown"}
            </h3>
            <div className="d-flex align-items-center mb-2">
              <img
                src="/assets/img/light-location.png"
                alt=""
                className="img-fluid"
              />
              <p className="ms-2 color-white-800 mt-1">
                {vehicleDataID?.city?.name || "Unknown City"},{" "}
                {vehicleDataID?.state?.name || "Unknown State"}
              </p>
            </div>
            <div className="seller-profile d-flex align-items-center mt-3">
              <img
                src={
                  vehicleDataID?.user?.profile_image ||
                  "/assets/img/seller-profile.png"
                }
                alt=""
                className="img-fluid seller-profile-img"
              />
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
  );
};

export default BookInspectionVendor;
