import React, { useEffect, useRef } from "react";
import { Avatar, Dropdown } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import FlatButton from "@/components/shared/button/flatbutton";
import MarkAsInterestedButton from "@/components/shared/button/MarkAsInterestedButton";
import EventAttachmentsSwiper from "@/components/shared/card/EventAttachmentsSwiper";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useMutation } from "@/hooks/reactQuery";
import useSweetAlert from "@/hooks/useSweetAlert";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./eventcard.css";

const CreateEventCard = ({ event, overlay }) => {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();

  const { mutate: markAsInterested, isPending: isCreating } = useMutation(
    "createEvent",
    {
      useFormData: false,
      invalidateQueries: ["getEvent", "getEventById"],
      onSuccess: async (data) => {
        if (data) {
          console.log("data", data);
        }
      },
    }
  );
  // Use event.avatars if available, otherwise fallback to default avatars
  const avatars = event?.avatars || [
    "/assets/img/avatar-1.png",
    "/assets/img/avatar-2.png",
    "/assets/img/avatar-3.png",
    "/assets/img/avatar-1.png",
    "/assets/img/avatar-2.png",
  ];

  // Format date range: "Sat, Jul 17 – Jul 24"
  const formatDateRange = () => {
    if (!event?.start_date || !event?.end_date) return "Date TBD";

    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    // If same date, show only one date
    if (startDate.isSame(endDate, "day")) {
      return startDate.format("ddd, MMM D");
    }

    // If same month, show "Sat, Jul 17 – 24"
    if (startDate.isSame(endDate, "month")) {
      return `${startDate.format("ddd, MMM D")} – ${endDate.format("D")}`;
    }

    // Different months: "Sat, Jul 17 – Aug 24"
    return `${startDate.format("ddd, MMM D")} – ${endDate.format("MMM D")}`;
  };

  // Format time range: "5:00 am to 6:00 am"
  const formatTimeRange = () => {
    if (!event?.start_time || !event?.end_time) return "Time TBD";

    const startTime = dayjs(`2000-01-01 ${event.start_time}`);
    const endTime = dayjs(`2000-01-01 ${event.end_time}`);

    return `${startTime.format("h:mm a")} to ${endTime.format("h:mm a")}`;
  };

  // Handle card click (navigate to detail page)
  const handleCardClick = (e) => {
    // Don't navigate if clicking on dropdown or buttons
    if (
      e.target.closest(".white-dots-img") ||
      e.target.closest(".event-btn") ||
      e.target.closest(".swiper-button-prev-custom") ||
      e.target.closest(".swiper-button-next-custom") ||
      e.target.closest("video") ||
      e.target.closest(".ant-dropdown-menu")
    ) {
      return;
    }
    navigate(`/event/${event.id}`);
  };

  // Get attachments for slider
  const attachments = event?.attachments || [];
  const interested_users = event?.interested_users || [];

  // Fallback image if no attachments
  const fallbackImage = event?.image || "/assets/img/event-card.png";
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [attachments]);
  // Handler for MarkAsInterestedButton
  const handleMarkAsInterested = (eventId) => {
    markAsInterested({ slug: `${eventId}/interest`, data: "" });
  };

  return (
    <div
      className="create-event-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="create-event-card-header">
        {/* Swiper slider for attachments */}
        <EventAttachmentsSwiper
          attachments={attachments}
          fallbackImage={fallbackImage}
          eventTitle={event?.title}
        />

        {/* Dropdown menu for event owner */}
        {window.user?.user?.id === event?.user_id && (
          <Dropdown overlay={overlay} trigger={["click"]}>
            <div
              className="white-dots-img"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/assets/img/white-dots.png" alt="menu" />
            </div>
          </Dropdown>
        )}
        {/* Attachment count indicator */}
        {attachments.length > 1 && (
          <div className="attachment-count">
            <span>{attachments.length} files</span>
          </div>
        )}
      </div>

      <div className="create-event-card-body">
        {/* Formatted date range */}
        <div className="create-event-card-min-height">
          <p className="color-red font-14">{formatDateRange()}</p>

          {/* Event title */}
          <h2 className="color-white font-18 mb-1 mt-1">
            {event?.title || "Event Title"}
          </h2>

          {/* Formatted time range */}
          <p className="color-white-500 font-12 mb-2">{formatTimeRange()}</p>

          {/* Location */}
          <div className="d-flex align-items-center mb-2">
            <img src="/assets/img/light-location.png" alt="" />
            <div className="ms-2">
              <p className="color-white-500 pt-1">
                {event?.location || "Location TBD"}
              </p>
            </div>
          </div>
        </div>

        {/* Interested people */}
        <div className="min-height-intersed">
          {interested_users?.length > 0 && (
            <>
              <p className="font-18 mb-2">Interested People</p>
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
                {interested_users?.map((user, idx) => (
                  <Avatar key={idx} src={user?.profile_image} alt={user.name} />
                ))}
              </Avatar.Group>
            </>
          )}
        </div>

        {/* Interested button */}
        <MarkAsInterestedButton
          eventId={event.id}
          interestedUsers={event?.interested_users || []}
          onMarkAsInterested={handleMarkAsInterested}
          className="event-btn mt-4"
        />
      </div>
    </div>
  );
};

export default CreateEventCard;
