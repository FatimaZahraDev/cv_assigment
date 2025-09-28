import React, { useState } from "react";
import FlatButton from "../button/flatbutton";
import VehicleAttachmentsSwiper from "./VehicleAttachmentsSwiper";

const VehicleCard = ({ car, onClick, edit_button }) => {
  // Handle card click (navigate to detail page)
  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons, swiper controls, or dropdown menu
    if (
      e.target.closest(".card-header-btn") ||
      e.target.closest(".saved-box") ||
      e.target.closest(".detail-btn") ||
      e.target.closest(".swiper-button-prev-custom") ||
      e.target.closest(".swiper-button-next-custom") ||
      e.target.closest("video") ||
      e.target.closest(".white-dots-img") ||
      e.target.closest(".ant-dropdown") ||
      e.target.closest(".ant-dropdown-menu") ||
      e.target.closest(".ant-dropdown-trigger")
    ) {
      return;
    }
    if (onClick) onClick();
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className="car-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="car-header">
        <VehicleAttachmentsSwiper
          attachments={car.attachments || []}
          fallbackImage={car.image || "/assets/img/ford-mustang.png"}
          vehicleTitle={car.title}
        />
        <div className="card-header-btn">
          <FlatButton title="Great Price" className="red-btn theme-button" />
          {edit_button}
          {/* <div
            className="saved-box"
            onClick={handleSaveClick}
            style={{
              backgroundColor: isSaved ? "#BE2828" : "#fff",
            }}
          >
            <img
              src="/assets/img/saved-icon.png"
              alt="save"
              style={{ filter: isSaved ? "brightness(0) invert(1)" : "none" }}
            />
          </div> */}
        </div>
        {/* Attachment count indicator */}
      </div>
      <div className="card-body">
        <h1 className="color-white font-18 mb-1 mt-2">{car.title}</h1>
        <p className="color-white-800">{car.description}</p>
        <p className="color-white-800">{car.state}</p>
        <div className="card-detail mt-3">
          {car.details &&
            car.details.map((detail, index) => (
              <div className="text-center" key={index}>
                <img src={detail.icon} alt="" />
                <p>{detail.label}</p>
              </div>
            ))}
        </div>
        <div className="d-flex align-items-center justify-content-between mt-3 mb-3">
          <h2 className="color-white font-24">{car.price}</h2>
          <FlatButton
            title="View Details"
            className="detail-btn theme-button"
            onClick={handleViewDetailsClick}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;