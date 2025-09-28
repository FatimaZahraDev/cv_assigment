import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FlatButton from "@/components/shared/button/flatbutton";
import EventCard from "@/components/shared/card/eventcard";
import { useQuery } from "@/hooks/reactQuery";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const Event = () => {
  const navigate = useNavigate();

  // Fetch events using the API (same as events page)
  const { loading, data } = useQuery("getEvent", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 10, // Get more events for the swiper
    },
  });

  // Transform event data to match EventCard component format
  const transformEventData = (event) => {
    console.log("Transforming event data:", event);
    console.log("Event attachments:", event?.attachments);

    // Format date range: "Monday 22 April, 2025"
    const formatDate = () => {
      if (!event?.start_date) return "Date TBD";
      return dayjs(event.start_date).format("dddd DD MMMM, YYYY");
    };

    // Format time range: "10:00 am to 08:00 pm"
    const formatTime = () => {
      if (!event?.start_time || !event?.end_time) return "Time TBD";
      const startTime = dayjs(`2000-01-01 ${event.start_time}`);
      const endTime = dayjs(`2000-01-01 ${event.end_time}`);
      return `${startTime.format("h:mm a")} to ${endTime.format("h:mm a")}`;
    };

    // Get the event image from API
    const eventImage = event?.attachments?.[0]?.full_url ||
                      event?.attachments?.[0]?.url ||
                      event?.image ||
                      "/assets/img/event-card-img.png";

    console.log("Using event image:", eventImage);

    return {
      id: event.id,
      img: eventImage,
      title: event.title || "Event Title",
      location: event.location || "Location TBD",
      date: formatDate(),
      time: formatTime(),
    };
  };

  // Static fallback data (keeping original structure as fallback)
  const staticEventData = [
    {
      img: "/assets/img/event-card-img.png",
      title: "Rides by the River",
      location: "At Lane 57, South street, Florida.",
      date: "Monday 22 April, 2025",
      time: "10:00 am to 08:00 pm",
    },
  ];

  const staticSliderImages = [
    "/assets/img/slider-img-1.png",
    "/assets/img/slider-img-2.png",
    "/assets/img/slider-img-3.png",
    "/assets/img/slider-img-4.png",
    "/assets/img/slider-img-2.png",
    "/assets/img/slider-img-3.png",
    "/assets/img/slider-img-4.png",
    "/assets/img/slider-img-4.png",
    "/assets/img/slider-img-2.png",
    "/assets/img/slider-img-3.png",
    "/assets/img/slider-img-4.png",
  ];

  // Debug API data
  console.log("Events API data:", data);
  console.log("Loading state:", loading);

  // Get first event for the main card and remaining events for the swiper
  const firstEvent = data && data.length > 0 ? transformEventData(data[0]) : staticEventData[0];
  const remainingEvents = data && data.length > 1 ? data.slice(1) : [];

  // Get images from API for swiper
  const sliderImages = remainingEvents.length > 0
    ? remainingEvents.map(event => {
        const eventImage = event?.attachments?.[0]?.full_url ||
                          event?.attachments?.[0]?.url ||
                          event?.image ||
                          "/assets/img/slider-img-1.png";
        console.log("Swiper event image:", eventImage, "for event:", event?.title);
        return eventImage;
      })
    : staticSliderImages;

  console.log("First event:", firstEvent);
  console.log("Remaining events:", remainingEvents);
  console.log("Slider images:", sliderImages);
  return (
    <section className="event-sec">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4">
            {loading ? (
              // Loading state for the main event card
              <div className="event-card">
                <div className="event-header">
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#333',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
                <div className="event-card-body">
                  <p className="color-white">Loading event...</p>
                </div>
              </div>
            ) : data && data.length > 0 ? (
              // Display the first event from API
              <div onClick={() => firstEvent.id && navigate(`/event/${firstEvent.id}`)} style={{ cursor: 'pointer' }}>
                <EventCard {...firstEvent} />
              </div>
            ) : (
              // Fallback to static data only if no API data
              <div>
                <EventCard {...staticEventData[0]} />
              </div>
            )}
          </div>

          <div className="col-12 col-md-8">
            <div className="event-slider-content">
              <div className="col-12 col-md-8">
                <p className="color-red font-28">Events</p>
                <h2 className="color-white font-55">Explore Events</h2>
                <p className="color-white-800 mt-2 mb-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. It has been the industry's standard
                  dummy text ever since the 1500s.
                </p>
                <FlatButton
                  title="Explore More Events"
                  className="login-btn mb-3 theme-button"
                  onClick={() => navigate("/event")}
                />
              </div>
            </div>

            <Swiper
              slidesPerView={5.5}
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                },
                480: {
                  slidesPerView: 2.2,
                },
                768: {
                  slidesPerView: 3.2,
                },
                992: {
                  slidesPerView: 4.2,
                },
                1200: {
                  slidesPerView: 5.5,
                },
              }}
            >
              {loading ? (
                // Loading state for swiper
                Array.from({ length: 6 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="slider-car-img">
                      <div
                        style={{
                          width: '100%',
                          height: '150px',
                          backgroundColor: '#333',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : data && data.length > 1 ? (
                // Display remaining events' images from API in swiper
                sliderImages.map((img, index) => {
                  const event = remainingEvents[index];
                  return (
                    <SwiperSlide key={`api-${event?.id || index}`}>
                      <div
                        className="slider-car-img"
                        onClick={() => event?.id && navigate(`/event/${event.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={img}
                          alt={event?.title || `Event ${index + 2}`}
                          onError={(e) => {
                            console.log("Image failed to load:", img);
                            e.target.src = "/assets/img/slider-img-1.png";
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })
              ) : (
                // Fallback to static images only if no API data
                staticSliderImages.map((img, index) => (
                  <SwiperSlide key={`static-${index}`}>
                    <div className="slider-car-img">
                      <img src={img} alt={`Static Slide ${index + 1}`} />
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;
