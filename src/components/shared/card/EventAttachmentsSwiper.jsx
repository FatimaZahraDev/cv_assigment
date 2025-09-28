import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./eventcard.css";

const EventAttachmentsSwiper = ({ attachments = [], fallbackImage, eventTitle }) => {
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [attachments]);

  if (!attachments.length) {
    return (
      <img
        src={fallbackImage}
        alt={eventTitle || "Event"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px 8px 0 0",
        }}
        loading="lazy"
      />
    );
  }

  return (
    <Swiper
      ref={swiperRef}
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
      {attachments.map((attachment, index) => (
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
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={attachment.url}
                alt={`${eventTitle || "Event"} - ${index + 1}`}
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
      {attachments.length > 1 && (
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
  );
};

export default EventAttachmentsSwiper;
