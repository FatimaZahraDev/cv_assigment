import React from "react";

const EventCard = ({ img, title, location, date, time }) => {
  return (
    <div className="event-card">
      <div className="event-header">
        <img src={img} alt={title} />
      </div>
      <div className="event-card-body">
        <h2 className="font-30 color-white">{title}</h2>
        <div className="d-flex align-items-center mb-1 mt-3">
          <img src="/assets/img/map-icon.png" alt="map" />
          <p className="ms-3">{location}</p>
        </div>
        <div className="d-flex align-items-center mt-2">
          <img src="/assets/img/calendar-icon.png" alt="calendar" />
          <p className="ms-3">{date}</p>
        </div>
        <div className="d-flex align-items-center mt-2">
          <img src="/assets/img/clock-icon.png" alt="clock" />
          <p className="ms-3">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
