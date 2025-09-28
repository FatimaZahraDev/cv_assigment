import React, { useState } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import { Spin, Skeleton, Empty, Pagination } from "antd";
import CreateEventCard from "@/components/shared/card/createeventcard";
import CustomModal from "@/components/shared/modal";
import CreateEvent from "./createevent";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import useSweetAlert from "@/hooks/useSweetAlert";
import "./event.css";
import { Menu } from "antd";
const Event = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const { showAlert } = useSweetAlert();
  // Simple pagination implementation as requested
  const { loading, data, pagination, setQueryParams } = useQuery("getEvent", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 9,
    },
  });
  const { mutate: deleteEvent, isPending: isDeleting } = useMutation(
    "deleteEvent",
    {
      invalidateQueries: [{ queryKey: ["getEvent"] }],
      showSuccessNotification: true,
      onSuccess: async () => {},
    }
  );

  const handlePageChange = (page, pageSize) => {
    setQueryParams({
      ...filters,
      page,
      per_page: pageSize,
      keyword: searchTerm,
    });
  };

  const handleMenuClick = (key, event) => {
    if (key === "edit") {
      // console.log("Click on edit", event);
      setSelectedEvent(event);
      setIsModalOpen(true);
    } else if (key === "delete") {
      handleDeleteProperty(event.id);
    }
  };
  const handleDeleteProperty = async (id) => {
    const result = await showAlert({
      title: "Are you sure?",
      text: `Do you want to delete this property`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteEvent({ slug: id, data: "" });
    }
  };
  const showEventModal = () => {
    setSelectedEvent(null); // Clear selected event for create mode
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedEvent(null); // Clear selected event
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedEvent(null); // Clear selected event
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setQueryParams({
      ...filters,
      per_page: 9,
      search: value,
    });
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
              <div className="row">
                <div className="col-6 col-sm-4 col-md-12 col-lg-12">
                  <BaseInput
                    placeholder="Location"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/location-icon.png" />}
                  />
                </div>
                <div className="col-6 col-sm-4 col-md-12 col-lg-12">
                  <BaseInput
                    placeholder="Pick Date"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/price-icon.png" />}
                  />
                </div>
                <div className="col-6 col-sm-4 col-md-12 col-lg-12">
                  <BaseInput
                    placeholder="Category"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/make-icon.png" />}
                  />
                </div>
              </div>
              <div className="footer-border">
                <FlatButton
                  className="car-detail-btn btn-bg-red theme-button"
                  onClick={showEventModal}
                  title={
                    <div className="d-flex align-items-center">
                      <img
                        className="add-icon-btn"
                        src="/assets/img/add-icon.png"
                        alt=""
                      />
                      <p>Create an Event</p>
                    </div>
                  }
                />
              </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9 col-xl-9">
              <div className="custom-input d-flex justify-content-between mt-3 align-items-end">
                <h2 className="color-white font-50">Events</h2>
                <div>
                  <BaseInput
                    type=""
                    placeholder="Search Events"
                    className="tunner-select"
                    icon={<img src="/assets/img/search-icon.png" />}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="row mt-4">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div
                      key={index}
                      className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-4"
                    >
                      <div className="bg-dark rounded p-3">
                        <Skeleton.Image
                          active
                          className="w-100 text-center align-items-center d-flex mb-2"
                          style={{
                            width: "100%",
                            height: 200,
                            display: "block",
                          }}
                        />
                      </div>

                      {/* Body with text and avatar loaders */}
                      <div className="create-event-card-body">
                        <Skeleton
                          active
                          paragraph={{ rows: 1 }}
                          title={false}
                          style={{ marginBottom: 12 }}
                        />

                        <Skeleton
                          active
                          paragraph={{ rows: 2 }}
                          title={false}
                          style={{ marginBottom: 16 }}
                        />

                        <div className="d-flex align-items-center mb-3">
                          <Skeleton.Input
                            active
                            size="small"
                            style={{ width: "60%" }}
                          />
                        </div>

                        <Skeleton paragraph={{ rows: 1 }} active />
                        <div className="d-flex align-items-center gap-2 mb-3">
                          {[...Array(5)].map((_, idx) => (
                            <Skeleton.Avatar
                              key={idx}
                              size="large"
                              shape="circle"
                              active
                              style={{ marginRight: 8 }}
                            />
                          ))}
                        </div>

                        <Skeleton.Button
                          active
                          style={{ width: 120, height: 40 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Events grid */}
                  <div className="row mt-4">
                    {data && data.length > 0 ? (
                      data.map((event) => (
                        <div
                          className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4"
                          key={event.id}
                        >
                          <CreateEventCard
                            event={event}
                            overlay={
                              <Menu
                                onClick={({ key }) =>
                                  handleMenuClick(key, event)
                                }
                              >
                                <Menu.Item key="edit">Edit</Menu.Item>
                                <Menu.Item key="delete">Delete</Menu.Item>
                              </Menu>
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-5">
                        <h3 className="color-white">No events found</h3>
                        <p className="color-white-500">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Simple pagination */}
                  {pagination && pagination.total > 0 && (
                    <div className="d-flex justify-content-end mt-4">
                      <Pagination
                        current={pagination?.currentPage || 1}
                        total={pagination?.count || 0}
                        pageSize={pagination?.perPage || 9}
                        pageSizeOptions={["9", "10", "20", "50", "100"]}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} events`
                        }
                        onChange={handlePageChange}
                        className="custom-pagination"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <CustomModal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={1200}
        closable={false}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2 className="color-white font-40 mb-1">
              {selectedEvent ? "Update Event" : "Create Event"}
            </h2>
            <p className="color-white-500 font-18">
              Please add your token amount and message for the seller.
            </p>
          </div>
          <div
            style={{ cursor: "pointer", fontSize: "18px" }}
            onClick={handleCancel}
          >
            <img src="/assets/img/modal-close.png" alt="" />
          </div>
        </div>
        <CreateEvent onEventSuccess={handleOk} initialData={selectedEvent} />
      </CustomModal>
    </InnerLayout>
  );
};

export default Event;
