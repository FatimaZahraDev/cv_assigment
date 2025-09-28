import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ForumImageDisplay.css";
import { div } from "framer-motion/client";
import { Image } from 'antd';
const ForumMediaDisplay = ({ attachments = [], postTitle = "Forum Post" }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const swiperRef = useRef(null);
  const lightboxSwiperRef = useRef(null);

  // ✅ Get file url
  const getFileUrl = (attachment) => {
    if (attachment?.full_url) return attachment.full_url;
    if (attachment?.file_url) return attachment.file_url;
    if (typeof attachment === "string") return attachment;
    return null;
  };

  // ✅ Detect type
  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase().split(/\#|\?/)[0];
    if (["mp4", "webm", "avi", "mov"].includes(ext)) return "video";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    return "unknown";
  };

  // ✅ Normalize
    const mediaAttachments = attachments.map((att) => ({
    url: att.full_url || att.file_url,
    type: getFileType(att.full_url || att.file_url),
  }));
  const imageUrls = mediaAttachments
    .filter((m) => m.type === "image")
    .map((m) => m.url);
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [mediaAttachments]);

  const handleMediaClick = (index) => {
    setCurrentMediaIndex(index);
    setIsLightboxOpen(true);
  };

  // ✅ Common Renderer (image/video)
  const MediaRenderer = ({ media, style = {}, onClick, autoPlay = false }) => {
    if (!media) return null;
    return media.type === "image" ? (
      // <img
      //   src={media.url}
      //   alt={postTitle}
      //   loading="lazy"
      //   style={{
      //     width: "100%",
      //     borderRadius: "8px",
      //     objectFit: "cover",
      //     ...style,
      //   }}
      // onClick={onClick}
      // />
        <Image.PreviewGroup
      items={imageUrls}
    
  >
    <Image src={media.url} width="100%" height="100%"  />
  </Image.PreviewGroup>
      
    ) : (
      <video
        src={media.url}
        controls
        crossOrigin="anonymous"
        autoPlay={autoPlay}
        style={{
          width: "100%",
          borderRadius: "8px",
          objectFit: "cover",
          ...style,
        }}
        onClick={onClick}
      />
    );
  };

  if (!mediaAttachments.length) return null;

  return (
    <>
      {/* ✅ Main Display */}
      {mediaAttachments.length === 1 ? (
        <div className="forum-single-media" style={{ cursor: "pointer" }}>
          <MediaRenderer
            media={mediaAttachments[0]}
            style={{ maxHeight: "400px" }}
            onClick={() => handleMediaClick(0)}
          />
        </div>
      ) : (
        <div className="forum-media-swiper">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            navigation={{
              nextEl: ".lightbox-swiper-button-next",
              prevEl: ".lightbox-swiper-button-prev",
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="forum-attachments-swiper"
            style={{ width: "100%", borderRadius: "8px" }}
          >
            {mediaAttachments.map((media, index) => (
              <SwiperSlide key={index}>
                <div
                  className="forum-media-slide"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleMediaClick(index)}
                >
                  <MediaRenderer media={media} style={{ height: "360px" }} />
                </div>
              </SwiperSlide>
            ))}
            <div className="lightbox-swiper-button-prev">←</div>
            <div className="lightbox-swiper-button-next">→</div>
          </Swiper>
        </div>
      )}

      {/* ✅ Lightbox Modal (always mounted) */}
      {/* <Modal
        open={isLightboxOpen}
        onCancel={() => setIsLightboxOpen(false)}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        className="forum-image-lightbox"
        centered
        closeIcon={
          <div
            style={{
              color: "white",
              fontSize: "24px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ×
          </div>
        }
      >
        {mediaAttachments.length === 1 ? (
          <div style={{ textAlign: "center", position: "relative" }}>
            <MediaRenderer
              media={mediaAttachments[0]}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
              autoPlay
            />
          </div>
        ) : (
          <Swiper
            ref={lightboxSwiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            initialSlide={currentMediaIndex}
            navigation={{
              nextEl: ".lightbox-swiper-button-next",
              prevEl: ".lightbox-swiper-button-prev",
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="lightbox-swiper"
          >
            {mediaAttachments.map((media, index) => (
              <SwiperSlide key={index}>
                <div className="lightbox-media-slide">
                  <MediaRenderer
                    media={media}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                    }}
                    autoPlay
                  />
                </div>
              </SwiperSlide>
            ))}
            <div className="lightbox-swiper-button-prev">←</div>
            <div className="lightbox-swiper-button-next">→</div>
          </Swiper>
        )}
      </Modal> */}
    </>
  );
};

export default ForumMediaDisplay;
