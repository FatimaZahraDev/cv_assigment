import React, { useMemo, useState, useEffect } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import FlatButton from "@/components/shared/button/flatbutton";
import { useNavigate, useParams } from "react-router";
import InspectorList from "@/components/shared/list/inspectorlist";
import InspectorDetailCard from "@/components/shared/card/inspectordetail.card";
import { Radio, Skeleton, Pagination } from "antd";
import { useQuery } from "@/hooks/reactQuery";

const mapInspectorForList = (ins) => ({
  id: ins?.id,
  name: ins?.name || ins?.full_name || "Unknown",
  rating: ins?.rating || ins?.stars || 0,
  location: `${ins?.city || "Unknown City"}, ${ins?.state || "Unknown State"}`,
  img: ins?.profile_image || "/assets/img/seller-profile.png",
});

const mapInspectorForDetail = (ins) => {
  const licenseUrl = ins?.business_license_image || ins?.certificate || null;
  return {
    name: ins?.name || ins?.full_name || "Unknown",
    rating: ins?.rating || ins?.stars || 0,
    email: ins?.email || "inspector@example.com",
    phone: ins?.contact_number || ins?.phone || "+1 000 000 0000",
    address:
      ins?.address || `${ins?.city || "Unknown City"}, ${ins?.state || "Unknown State"}`,
    headerImg: ins?.header_image || ins?.cover_photo || "/assets/img/akira-bg.png",
    profileImg: ins?.profile_image || "/assets/img/seller-profile.png",
    licenseTitle: ins?.business_license_image ? "Business License" : ins?.certificate ? "Certificate" : "Document",
    licenseFile: licenseUrl || "No document provided",
    licenseUrl: licenseUrl,
    price: ins?.price || ins?.service_rate || 2000,
  };
};

const InspectionVendor = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    data: inspectors,
    pagination,
    setQueryParams,
    isError,
    error,
  } = useQuery("getInspectors", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 6,
    },
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Fetch vehicle details to display on the right (dynamic)
  const { data: getVehicleData } = useQuery("getAllVehicle", {
    params: { id: vehicleId },
  });

  const vehicleDataID = Array.isArray(getVehicleData?.data)
    ? getVehicleData?.data[0]
    : getVehicleData?.data || null;

  const primaryImage = useMemo(() => {
    const atts = vehicleDataID?.attachments || [];
    const img = atts.find((att) => !att.file_url?.toLowerCase().endsWith(".mp4"))?.file_url;
    return img || "/assets/img/ford-mustang.png";
  }, [vehicleDataID]);

  // Select first inspector by default once data loads
  useEffect(() => {
    if (!loading && inspectors && inspectors.length > 0) {
      setActiveIndex(0);
      setShowAll(false);
    }
  }, [loading, inspectors]);

  const selectedInspector = useMemo(() => {
    if (!inspectors || inspectors.length === 0) return null;
    return inspectors[activeIndex] || inspectors[0];
  }, [inspectors, activeIndex]);

  const visibleInspectors = useMemo(() => {
    if (!inspectors || inspectors.length === 0) return [];
    return showAll ? inspectors : inspectors.slice(0, 4);
  }, [inspectors, showAll]);

  const handleSelectInspector = (index) => setActiveIndex(index);

  const handlePageChange = (page, pageSize) => {
    setQueryParams({ page, per_page: pageSize });
  };

  return (
    <InnerLayout headerClass="sub-header">
      <section className="forum-sec">
        <div className="container">
          <div className="row">
            {/* Left Column: Vendor list and actions */}
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center">
                <h2 className="color-red">Inspection</h2>
                <span className="color-red-500 font-26">/Vehicles</span>
              </div>

              <h3 className="color-white font-50 mb-2">
                <span>{vehicleDataID?.make?.name || "Unknown"}</span>{" "}
                <span>{vehicleDataID?.model?.name || "Model"}</span>
                <br />
                {vehicleDataID?.transmission_type?.name || "Unknown"}
              </h3>

              <h3 className="color-white font-30 footer-border mt-3 pt-4">
                Request Inspection
              </h3>
              <p className="color-white-500 font-18">
                Choose a vendor to perform your vehicle inspection.
              </p>

              <div className="col-12 col-md-10 col-lg-9 col-xl-9">
                <Radio.Group
                  name="inspectionType"
                  defaultValue={2}
                  className="custom-radio-group mt-4 mb-4"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 1) {
                      navigate(`/vehicle/inspection/${vehicleId}`);
                    } else if (value === 2) {
                      navigate(`/vehicle/inspection-vendor/${vehicleId}`);
                    }
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

              <div className="footer-border">
                <p className="color-red font-18">Step 1 out of 2</p>
                <h3 className="color-white font-30">Inspect by Vendor/Inspector</h3>
                <p className="color-white-500 font-18">
                  Select a vendor from the list below to see details.
                </p>
              </div>

              <div className="mt-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="seller-profile d-flex align-items-center inspector-card">
                          <Skeleton.Avatar active size={48} shape="circle" />
                          <div className="ms-3 w-100">
                            <Skeleton.Input active style={{ width: "60%" }} size="small" />
                            <div className="mt-1">
                              <Skeleton.Input active style={{ width: "40%" }} size="small" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : inspectors && inspectors.length > 0
                  ? visibleInspectors.map((inspector, index) => (
                      <InspectorList
                        key={inspector.id || index}
                        inspector={mapInspectorForList(inspector)}
                        isActive={activeIndex === index}
                        onClick={() => handleSelectInspector(index)}
                      />
                    ))
                  : (
                    <p className="color-white-500">No inspectors found.</p>
                  )}

                {/* Restore Load more line */}
                {!loading && inspectors && inspectors.length > 4 && !showAll && (
                  <p
                    className="border-bottom text-center color-white-500 pb-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAll(true)}
                  >
                    Load more
                  </p>
                )}

              </div>

              <div className="footer-border">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                  <FlatButton
                    title="Book Inspector/Vendor"
                    className="car-detail-btn btn-bg-red mt-3 theme-button"
                    onClick={() =>
                      navigate("/book-inspection-vendor", {
                        state: {
                          selectedInspector: selectedInspector,
                          vehicle_ad_id: vehicleId,
                        },
                      })
                    }
                    disabled={!selectedInspector}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Vehicle details (as before) + selected vendor detail */}
            <div className="col-12 col-md-6">
              <div className="inpection-car-detail-area inpection-car-vender-area">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="car-detail-area-img">
                      <img
                        src={primaryImage}
                        alt=""
                        className="img-fluid"
                      />
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
                          {vehicleDataID?.city?.name || "Unknown City"}, {vehicleDataID?.state?.name || "Unknown State"}
                        </p>
                      </div>
                      <div className="seller-profile d-flex align-items-center mt-3">
                        <img
                          src={vehicleDataID?.user?.profile_image || "/assets/img/seller-profile.png"}
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

              {selectedInspector ? (
                <InspectorDetailCard inspector={mapInspectorForDetail(selectedInspector)} />
              ) : (
                <div className="inspection-card akera-inspec-card p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
                  <p className="mb-0 color-white-500">Select a vendor to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default InspectionVendor;
