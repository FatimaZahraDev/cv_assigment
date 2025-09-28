import React, { useMemo, useState } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import { useLocation, useNavigate } from "react-router";
import { Select, Spin, Alert, Image } from "antd";
import { useQuery } from "@/hooks/reactQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import FlatButton from "@/components/shared/button/flatbutton";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SpecRow = ({ label, left, right }) => (
  <div className="row py-2">
    <div className="col-12 col-md-4">
      <p className="mb-0 color-white-500">{label}</p>
    </div>
    <div className="col-12 col-md-4">
      <p className="mb-0 color-white">{left ?? "N/A"}</p>
    </div>
    <div className="col-12 col-md-4">
      <p className="mb-0 color-white">{right ?? "N/A"}</p>
    </div>
  </div>
);

const renderValue = (getter, car) => {
  try {
    const v = getter?.(car);
    return v === undefined || v === null || v === "" ? "N/A" : v;
  } catch {
    return "N/A";
  }
};

const formatCarLabel = (car) =>
  `${car?.make?.name || ""} ${car?.model?.name || ""}${car?.year?.name ? ` (${car?.year?.name})` : ""}`.trim();

const getImageAttachments = (car) => {
  const fallbackImages = [
    "/assets/img/ford-mustang.png",
    "/assets/img/audi-a3.png",
    "/assets/img/tesla.png",
  ];
  const atts = car?.attachments || [];
  const images = atts.filter(
    (att) =>
      att?.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || att?.type === "image"
  );
  if (images.length > 0) return images;
  return fallbackImages.map((file_url) => ({ file_url, type: "image" }));
};

const CarImageSlider = ({ car }) => {
  const images = getImageAttachments(car);

  if (!car) {
    return (
      <div
        className="token-card token-img-area p-3 d-flex align-items-center justify-content-center"
        style={{ minHeight: 200 }}
      >
        <p className="mb-0 color-white-500">No car selected</p>
      </div>
    );
  }

  // 👉 Sirf first image show karna hai
  const firstImage = images.length > 0 ? images[0].file_url : null;

  return (
    <div className="token-card token-img-area  p-3">
      {firstImage ? (
        <Image
          src={firstImage}
          alt={`${formatCarLabel(car)} image`}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: 200 }}
        >
          <p className="mb-0 color-white-500">No image available</p>
        </div>
      )}
    </div>
  );
};

const CompareVehicle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Car pre-selected from Vehicle Detail page (if coming via Compare button)
  const selectedCarFromState = location.state?.selectedCar || null;

  const {
    data: vehiclesResponse,
    isLoading,
    isError,
    error,
  } = useQuery("getAllVehicle", {
    enablePagination: true,
    defaultQueryParams: { page: 1, per_page: 50 },
  });

  const vehicles = Array.isArray(vehiclesResponse)
    ? vehiclesResponse
    : [];

  const baseOptions = useMemo(
    () =>
      vehicles.map((v) => ({
        label: formatCarLabel(v),
        value: v?.id,
      })),
    [vehicles]
  );

  // Selection state for direct access scenario
  const [leftCarId, setLeftCarId] = useState();
  const [rightCarId, setRightCarId] = useState();

  // Resolve left/right cars based on state and/or manual selection
  const leftCar = selectedCarFromState || vehicles.find((v) => v?.id === leftCarId) || null;
  const rightCar = vehicles.find((v) => v?.id === rightCarId) || null;

  // Build options that disable choosing the same car on both sides
  const leftOptions = useMemo(
    () => baseOptions.map((o) => ({ ...o, disabled: rightCarId === o.value })),
    [baseOptions, rightCarId]
  );
  const rightOptions = useMemo(
    () => baseOptions.map((o) => ({ ...o, disabled: (selectedCarFromState?.id ?? leftCarId) === o.value })),
    [baseOptions, selectedCarFromState?.id, leftCarId]
  );

  // Category definitions (GSM-style: category heading, then spec rows)
  const categories = useMemo(
    () => [
      {
        key: "general",
        title: "General",
        specs: [
          {
            label: "Make & Model",
            getter: (car) => `${car?.make?.name || "Unknown"} ${car?.model?.name || "Model"}`.trim(),
          },
          { label: "Year", getter: (car) => car?.year?.name || "Unknown Year" },
          {
            label: "Price",
            getter: (car) => (car?.price ? `$${Number(car.price).toLocaleString()}` : "N/A"),
          },
          {
            label: "Location",
            getter: (car) => `${car?.city?.name || "Unknown City"}, ${car?.state?.name || "Unknown State"}`,
          },
        ],
      },
      {
        key: "body",
        title: "Body",
        specs: [
          { label: "Body kit & Aero parts", getter: (car) => car?.body_kit?.name || "N/A" },
        ],
      },
      {
        key: "powertrain",
        title: "Powertrain",
        specs: [
          { label: "Engine Modifications", getter: (car) => car?.engine_modification?.name || "N/A" },
          { label: "Exhaust System", getter: (car) => car?.exhaust_system?.name || "N/A" },
          { label: "Fuel Type", getter: (car) => car?.fuel_type?.name || "N/A" },
          { label: "Performance Tuning", getter: (car) => car?.performance_tuning?.name || "N/A" },
        ],
      },
      {
        key: "transmission",
        title: "Transmission",
        specs: [
          { label: "Transmission", getter: (car) => car?.transmission_type?.name || "N/A" },
        ],
      },
      {
        key: "chassis",
        title: "Chassis",
        specs: [
          { label: "Suspension", getter: (car) => car?.suspension?.name || "N/A" },
          { label: "Wheels & Tires", getter: (car) => car?.wheels_tires?.name || "N/A" },
          { label: "Brakes", getter: (car) => car?.brakes?.name || "N/A" },
        ],
      },
      {
        key: "usage",
        title: "Usage",
        specs: [
          { label: "Mileage", getter: (car) => (car?.mileage?.name ? `${car?.mileage?.name} Miles` : "N/A") },
        ],
      },
      {
        key: "interior",
        title: "Interior",
        specs: [
          { label: "Interior Upgrades", getter: (car) => car?.interior_upgrade?.name || "N/A" },
        ],
      },
      {
        key: "electronics",
        title: "Electronics & Infotainment",
        specs: [
          { label: "Electronics", getter: (car) => car?.electronics?.name || "N/A" },
        ],
      },
      {
        key: "condition",
        title: "Condition",
        specs: [
          { label: "Condition Report", getter: (car) => car?.condition?.name || "N/A" },
        ],
      },
      {
        key: "Description",
         specs: [
          { label: "Description", getter: (car) => car?.description || "No description available" },
        ],
      }
    ],
    []
  );

  return (
    <InnerLayout headerClass="sub-header">
      <section className="make-model-sec compare-sec">
        <div className="container">
          {/* Header + selectors */}
          <div className="row">
            <div className="col-12">
              <FlatButton className="btn btn-outline-light" onClick={() => navigate(-1)} title="Back" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6 d-flex align-items-center">
              <h2 className="color-white font-30 mb-0">Compare Vehicles</h2>
            
            </div>

            {/* Right selector always visible for picking comparison car */}
            {selectedCarFromState ? (
              <div className="col-12 col-md-6">
                <div className="token-card p-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="color-white font-16 mb-0">Selected Car</h4>
                    <p className="mb-0 color-white-500">{formatCarLabel(selectedCarFromState)}</p>
                  </div>
                  {isLoading ? (
                    <div className="d-flex align-items-center" style={{ minHeight: 48 }}>
                      <Spin />
                    </div>
                  ) : (
                    <div>
                      <h4 className="color-white font-16 mb-2">Choose car to compare</h4>
                      <Select
                        showSearch
                        placeholder="Select a vehicle"
                        optionFilterProp="label"
                        options={rightOptions}
                        className="w-100"
                        onChange={(val) => setRightCarId(val)}
                        value={rightCarId}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Dual selection for direct access
              <>
                <div className="col-12 col-md-3">
                  <div className="token-card p-2">
                    <h4 className="color-white font-16 mb-2">Car 1</h4>
                    {isLoading ? (
                      <div className="d-flex align-items-center" style={{ minHeight: 48 }}>
                        <Spin />
                      </div>
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select first vehicle"
                        optionFilterProp="label"
                        options={leftOptions}
                        className="w-100"
                        onChange={(val) => setLeftCarId(val)}
                        value={leftCarId}
                      />
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="token-card p-2">
                    <h4 className="color-white font-16 mb-2">Car 2</h4>
                    {isLoading ? (
                      <div className="d-flex align-items-center" style={{ minHeight: 48 }}>
                        <Spin />
                      </div>
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select second vehicle"
                        optionFilterProp="label"
                        options={rightOptions}
                        className="w-100"
                        onChange={(val) => setRightCarId(val)}
                        value={rightCarId}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {isError && (
            <div className="row mb-3">
              <div className="col-12">
                <Alert
                  message="Failed to load vehicles for comparison"
                  description={error?.message}
                  type="error"
                  showIcon
                />
              </div>
            </div>
          )}

          {/* Top image sliders for selected cars */}
          <div className="row mb-3">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <CarImageSlider car={leftCar} uniqueKey="left" />
            </div>
            <div className="col-12 col-md-6">
              <CarImageSlider car={rightCar} uniqueKey="right" />
            </div>
          </div>

          {/* Category-by-category comparison */}
          {categories.map((cat) => (
            <div className="token-card p-3 mb-3" key={cat.key}>
              <h3 className="color-white font-24 mb-3">{cat.title}</h3>

              {/* Header row to indicate columns */}
              <div className="row pb-2">
                <div className="col-12 col-md-4">
                  <p className="mb-0 color-white-500">Spec</p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="mb-0 color-white-500">Selected Car</p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="mb-0 color-white-500">Comparison Car</p>
                </div>
              </div>

              {cat.specs.map((s) => (
                <SpecRow
                  key={`${cat.key}-${s.label}`}
                  label={s.label}
                  left={leftCar ? renderValue(s.getter, leftCar) : "N/A"}
                  right={rightCar ? renderValue(s.getter, rightCar) : "N/A"}
                />
              ))}

              {/* Helper messages */}
              {/* {!selectedCarFromState && !leftCar && (
                <p className="mt-2 color-white-500">Select Car 1 to begin comparison.</p>
              )}
              {!rightCar && (
                <p className="mt-2 color-white-500">Select Car 2 to see values on the right.</p>
              )} */}
            </div>
          ))}
        </div>
      </section>
    </InnerLayout>
  );
};

export default CompareVehicle;
