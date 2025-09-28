import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import InnerLayout from "@/components/shared/layout/innerlayout";
import FlatButton from "@/components/shared/button/flatbutton";
import { Avatar, Dropdown, Menu, Skeleton, Spin } from "antd";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import "@/components/shared/card/eventcard.css";
import { Navigation, Pagination } from "swiper/modules";
import useSweetAlert from "@/hooks/useSweetAlert";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventdata, setEventData] = useState({});
  const fallbackImage = "/assets/img/event-card.png";
  const { showAlert } = useSweetAlert();
  const {
    data: getEventData,
    isLoading,
    error,
    isError,
  } = useQuery("getEventById", {
    // Performance optimizations
    slug: id,
  });
  const { mutate: markAsInterested, isPending: isCreating } = useMutation(
    "createEvent",
    {
      useFormData: false,
      invalidateQueries: ["getEventById", "getEvent"],
      onSuccess: async (data) => {
        if (data) {
          console.log("data", data);
        }
      },
    }
  );

  useEffect(() => {
    if (getEventData?.data?.event) {
      setEventData(getEventData?.data?.event);
    }
  }, [getEventData]);
  console.log("data", eventdata);
  const markAsInterestedClick = (e) => {
    e.stopPropagation();
    if (window.user.user) {
      markAsInterested({ slug: `${eventdata.id}/interest`, data: "" });
    } else {
      showAlert({
        title: "Login Required",
        text: "You need to login first to access this feature.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login"); // replace with your login route
        }
      });
    }
  };
  const handleMenuClick = (key, eventdata) => {
    if (key === "edit") {
      setSelectedEvent(eventdata);
      setIsModalOpen(true);
    } else if (key === "delete") {
      handleDeleteProperty(eventdata.id);
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

  return isLoading ? (
    <div className="loader-overlay">
      <Spin size="large" />
    </div>
  ) : (
    <InnerLayout headerClass="sub-header">
      <section className="event-banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner-img">
                {/* Swiper slider for attachments */}
                {eventdata?.attachments?.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={{
                      nextEl: ".swiper-button-next-custom",
                      prevEl: ".swiper-button-prev-custom",
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    className="event-attachments-swiper"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {eventdata?.attachments?.map((attachment, index) => (
                      <SwiperSlide key={attachment.id || index}>
                        <div className="attachment-slide">
                          {attachment.type === "video" ? (
                            <video
                              src={attachment.url}
                              controls
                              preload="metadata"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px 8px 0 0",
                              }}
                              onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with video
                            />
                          ) : (
                            <img
                              src={attachment.url}
                              alt={`${event?.title} - ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px 8px 0 0",
                              }}
                              loading="lazy"
                            />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}

                    {/* Custom navigation buttons */}
                    {eventdata?.attachments?.length > 0 && (
                      <>
                        <div
                          className="swiper-button-prev-custom"
                          onClick={(e) => e.stopPropagation()}
                        ></div>
                        <div
                          className="swiper-button-next-custom"
                          onClick={(e) => e.stopPropagation()}
                        ></div>
                      </>
                    )}
                  </Swiper>
                ) : (
                  // Fallback single image
                  <img
                    src={fallbackImage}
                    alt={eventdata?.title || "Event"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="event-detail">
            <div className="row">
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-between border-bottom">
                  <div>
                    <p className="color-red font-18">Events</p>
                    <h2 className="color-white font-40">{eventdata?.title}</h2>
                    <div className="d-flex align-item-center mb-2">
                      <div>
                        <img
                          src="/assets/img/outline-location.png"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <p className="ms-2 color-white mt-1">
                        {eventdata?.location}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-5">
                    <FlatButton
                      title={
                        eventdata?.interested_users?.some(
                          (user) => user.id === window?.user?.user?.id
                        )
                          ? "Interested"
                          : "Mark As Interested"
                      }
                      className="car-detail-btn btn-bg-grey  px-5 ms-3 theme-button"
                      onClick={markAsInterestedClick} // Prevent card click
                    />
                    <FlatButton
                      className="car-detail-btn btn-bg-red ms-3 theme-button"
                      title={
                        <div className="d-flex align-item-center">
                          <div>
                            <img src="/assets/img/check-circle.svg" alt="" />
                          </div>
                          <div>
                            <p className="pt-1 ps-1">Going</p>
                          </div>
                        </div>
                      }
                    />
                    {/* {window?.user?.user?.id === eventdata?.user_id && (
                      <Dropdown
                        overlay={
                          <Menu
                            onClick={({ key }) =>
                              handleMenuClick(key, eventdata)
                            }
                          >
                            <Menu.Item key="edit">Edit</Menu.Item>
                            <Menu.Item key="delete">Delete</Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <div
                          className="white-dots-img"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FlatButton
                            className="car-detail-btn btn-bg-grey ms-3  px-0 edit-btn-dots"
                            title={
                              <div className="d-flex align-item-center">
                                <div>
                                  <img
                                    src="/assets/img/horizontal-dots.png"
                                    alt=""
                                  />
                                </div>
                              </div>
                            }
                          />
                        </div>
                      </Dropdown>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-md-6 col-lg-7">
                <div className="event-detail-card">
                  <h2 className="color-white font-30 mb-2">Event Details</h2>
                  <p className="mb-3 color-white-800 font-500">
                    {eventdata?.description}
                  </p>
                  <div className="col-12 col-md-12 col-lg-8 col-xl-6">
                    <div className="d-flex align-items-center call-icon-bg">
                      <div>
                        <img src="/assets/img/call-icon.png" alt="" />
                      </div>
                      <div className="ms-1">
                        <p>{eventdata?.user?.contact_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-8 col-xl-6">
                    <div className="d-flex align-items-center call-icon-bg">
                      <div>
                        <img src="/assets/img/letter-icon.png" alt="" />
                      </div>
                      <div className="ms-1">
                        <p>{eventdata?.user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="meet-host-card mt-4">
                  <h2 className="color-white font-40 mb-3">Meet your Host</h2>
                  <div className="inspection-card">
                    <div className="inspection-header">
                      <img
                        src={
                          eventdata?.user?.cover_photo ||
                          "/assets/img/dummy.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="inspection-body">
                      <div className="inspection-profile">
                        <img src={eventdata?.user?.profile_image} alt={name} />
                      </div>
                      <div className="text-center">
                        <h2 className="color-white font-30 mt-2 mb-1 font-500">
                          {eventdata?.user?.name}
                        </h2>
                        <p className="color-white-500 font-16">
                          {eventdata?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-5">
                <div className="map-area">
                  <div className="map-img">
                    <img src="/assets/img/map.png" alt="" />
                  </div>
                  <FlatButton
                    className="car-detail-btn btn-bg-white mt-3"
                    title={
                      <div className="d-flex align-item-center">
                        <div>
                          <img src="/assets/img/location-black.png" alt="" />
                        </div>
                        <div>
                          <p className="pt-1 ps-2 color-black">
                            Get Directions
                          </p>
                        </div>
                      </div>
                    }
                  />
                </div>

                {eventdata?.interested_users?.length > 0 && (
                  <div className="interested-card mt-4">
                    <h2 className="color-white font-40 mb-3 font-500">
                      Interested People
                    </h2>
                    <Avatar.Group
                      size="large"
                      max={{
                        count: 5,
                        style: {
                          color: "#fff",
                          backgroundColor: "#000000",
                          cursor: "pointer",
                        },
                        popover: { trigger: "click" },
                      }}
                    >
                      {eventdata?.interested_users.map((user, idx) => (
                        <Avatar
                          key={idx}
                          src={user.profile_image}
                          alt={user.name}
                        />
                      ))}
                    </Avatar.Group>
                    <FlatButton
                      className="car-detail-btn btn-bg-black mt-3"
                      title={
                        <div className="d-flex align-item-center">
                          <div>
                            <img src="/assets/img/invite-icon.svg" alt="" />
                          </div>
                          <div>
                            <p className="pt-1 ps-2">Invite Friends</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default EventDetail;
