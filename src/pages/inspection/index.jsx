import React, { useState } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import InspectorCard from "@/components/shared/card/inspectorcard";
import CustomModal from "@/components/shared/modal";
import { Pagination, Skeleton } from "antd";
import { useQuery } from "@/hooks/reactQuery";

const Inspection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState(null);
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

  const handlePageChange = (page, pageSize) => {
    setQueryParams({ page, per_page: pageSize, keyword: searchTerm });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setQueryParams({
      name: value,
    });
  };

  const openProfileModal = (ins) => {
    setSelectedInspector(ins);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedInspector(null);
  };

  const isPdf = (url) => {
    if (!url) return false;
    try {
      const cleanUrl = url.split("?")[0];
      return cleanUrl.toLowerCase().endsWith(".pdf");
    } catch (e) {
      return false;
    }
  };

  const renderFilePreview = (url, label) => {
    if (!url) return null;

    if (isPdf(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center akira-pdf"
          style={{ textDecoration: "none" }}
        >
          <div className="akira-pdf-img">
            <img src="/assets/img/pdf-document.png" alt="PDF" />
          </div>
          <div className="ms-3">
            <p className="color-white">{label}</p>
            <p
              className="color-white-800"
              style={{ maxWidth: 380, wordBreak: "break-all" }}
            >
              {url}
            </p>
          </div>
        </a>
      );
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={label}
          style={{
            width: 140,
            height: 100,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </a>
    );
  };

  return (
    <InnerLayout headerClass="sub-header">
      <section className="forum-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-3 col-xl-3">
              <div className="d-flex align-items-end mb-4 mt-5">
                <h2 className="color-white font-40">Filter</h2>
                <span className="color-white font-20 ms-1">
                  {pagination?.total || 0} Results
                </span>
              </div>
              <div>
                <BaseInput
                  placeholder="Location"
                  className="filter-select"
                  suffix={<img src="/assets/img/down-arrow.png" />}
                  type="select"
                  prefix={<img src="/assets/img/location-icon.png" />}
                />
                <BaseInput
                  placeholder="Pick Date"
                  className="filter-select"
                  suffix={<img src="/assets/img/down-arrow.png" />}
                  type="select"
                  prefix={<img src="/assets/img/price-icon.png" />}
                />

                <BaseInput
                  placeholder="Category"
                  className="filter-select"
                  suffix={<img src="/assets/img/down-arrow.png" />}
                  type="select"
                  prefix={<img src="/assets/img/make-icon.png" />}
                />
              </div>
              <div className="footer-border">
                <h2 className="color-white mt-2 mb-3">Popular Vendor</h2>
                {/* Placeholder popular vendor; can be wired to API later */}
                <InspectorCard
                  name="Nolan Workman"
                  headerImg="/assets/img/inspection-header-1.png"
                  profileImg="/assets/img/akera-img.png"
                />
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-9 col-xl-9">
              <div className="d-flex justify-content-between mt-3 align-items-end">
                <h2 className="color-white font-50">Inspectors</h2>
                <div>
                  <BaseInput
                    type=""
                    placeholder="Search Inspectors"
                    className="tunner-select"
                    icon={<img src="/assets/img/search-icon.png" />}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mt-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
                    >
                      <div
                        className="inspection-card text-center p-0"
                        style={{ overflow: "hidden" }}
                      >
                        <Skeleton.Image
                          active
                          style={{
                            width: "100%",
                            height: 150,
                            textAlign: "center",
                          }}
                        />
                        <div className="p-3 text-center">
                          <Skeleton.Avatar active size={64} shape="circle" />
                          <div className="mt-2">
                            <Skeleton.Input
                              active
                              style={{ width: 120 }}
                              size="small"
                            />
                          </div>
                          <div className="mt-2 d-flex justify-content-center gap-2">
                            <Skeleton.Button
                              active
                              style={{ width: 100, height: 32 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : inspectors && inspectors.length > 0 ? (
                  inspectors.map((inspector) => (
                    <div
                      key={inspector.id}
                      className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
                    >
                      <InspectorCard
                        name={
                          inspector?.name || inspector?.full_name || "Unknown"
                        }
                        headerImg={
                          inspector?.header_image ||
                          "/assets/img/inspection-header-1.png"
                        }
                        profileImg={
                          inspector?.profile_image ||
                          "/assets/img/akera-img.png"
                        }
                        onViewProfile={() => openProfileModal(inspector)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <h3 className="color-white">No inspectors found</h3>
                    <p className="color-white-500">
                      Try adjusting your filters or try again later.
                    </p>
                  </div>
                )}
              </div>

              {pagination && pagination.total > 0 && (
                <div className="d-flex justify-content-end mt-4">
                  <Pagination
                    current={pagination?.currentPage || 1}
                    total={pagination?.total || 0}
                    pageSize={pagination?.perPage || 9}
                    pageSizeOptions={["9", "12", "24", "48"]}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} results`
                    }
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <CustomModal
        title="Inspector Details"
        open={isProfileModalOpen}
        onCancel={closeProfileModal}
        footer={false}
        className="car-modal"
        width={800}
      >
        {selectedInspector && (
          <div className="container">
            <div className="row">
              <div className="inspection-card">
                <div className="inspection-header">
                  <img src={selectedInspector?.header_image || "/assets/img/inspection-header-1.png" } alt="" />
                </div>
                <div className="inspection-body">
                  <div className="inspection-profile">
                    <img
                      src={
                        selectedInspector?.profile_image ||
                        "/assets/img/akera-img.png"
                      }
                      alt={
                        selectedInspector?.name ||
                        selectedInspector?.full_name ||
                        "Inspector"
                      }
                      className="img-fluid"
                    />
                  </div>
                  <h2 className="color-white text-center font-24 mt-2">
                  {selectedInspector?.name ||
                    selectedInspector?.full_name ||
                    "Unknown"}
                </h2>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <p className="color-white-800">Company Name</p>
                <p className="color-white">
                  {selectedInspector?.company_name || "-"}
                </p>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <p className="color-white-800 ">Email</p>
                <p className="color-white">{selectedInspector?.email || "-"}</p>
              </div> 
              <div className="col-12 col-md-6 mb-2">
                <p className="color-white-800 ">Contact Number</p>
                <p className="color-white">
                  {selectedInspector?.contact_number ||
                    selectedInspector?.phone ||
                    "-"}
                </p>
              </div>
              <div className="col-12 col-md-6 mb-2">
                <p className="color-white-800 ">Service Rate</p>
                <p className="color-white">
                  {selectedInspector?.service_rate
                    ? `${selectedInspector.service_rate}`
                    : "-"}
                    <span> $</span>
                </p>
              </div>

              <div className="col-12">
                <p className="color-white-800">Address</p>
                <p className="color-white">
                  {[
                    selectedInspector?.street,
                    selectedInspector?.city,
                    selectedInspector?.state,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>
              </div>

              <div className="col-12 mt-3">
                <h3 className="color-white font-20 mb-2">
                  License / Certificate
                </h3>
                <div className="d-flex gap-3 flex-wrap">
                  {renderFilePreview(
                    selectedInspector?.business_license_image,
                    "Business License"
                  )}
                  {renderFilePreview(
                    selectedInspector?.certificate,
                    "Certificate"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </InnerLayout>
  );
};

export default Inspection;
