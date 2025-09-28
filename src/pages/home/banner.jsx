import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Banner = () => {
  const slides = [
    {
      title: "FIND THE BEST",
      subtitle: "CAR WITHOUT HEADACHES",
      img: "/assets/img/slider-img.png",
    },
    {
      title: "FIND YOUR DREAM",
      subtitle: "SPORTS CAR TODAY",
      img: "/assets/img/slider-img.png",
    },
    {
      title: "ENJOY THE RIDE",
      subtitle: "WITH STYLE",
      img: "/assets/img/slider-img.png",
    },
    {
      title: "TOP QUALITY",
      subtitle: "CARS AT BEST PRICE",
      img: "/assets/img/slider-img.png",
    },
  ];

  return (
    <div className="banner-slider">
      <Swiper
        direction={"vertical"}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}">${index + 1}-${
              slides.length
            }</span>`;
          },
        }}
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide-background"
              style={{
                backgroundImage: `url(${slide.img})`,
              }}
            >
              <div className="container">
                <div className="slider-content-area">
                  <h1 className="color-red font-80">{slide.title}</h1>
                  <h2 className="color-white font-80">
                    {slide.subtitle.split(" ").map((word, i) =>
                      word === "HEADACHES" ? (
                        <React.Fragment key={i}>
                          <br />
                          {word}{" "}
                        </React.Fragment>
                      ) : (
                        word + " "
                      )
                    )}
                  </h2>
                  <div className="explore-area d-flex align-items-center gap-2">
                    <p className="line mb-0"></p>
                    <p className="mb-0 color-white">Explore More</p>
                    <img
                      src="/assets/img/right-arrow.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
