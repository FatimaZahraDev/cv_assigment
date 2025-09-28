import React from "react";
import { Rate } from "antd";

const InspectorCard = ({ inspector, isActive, onClick }) => {
  return (
    <div
      className={`inspector-list ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer", marginBottom: "15px" }}
    >
      <div className="seller-profile d-flex align-items-center inspector-card">
        <div className="seller-profile-img">
          <img src={inspector.img} alt="" className="img-fluid" />
        </div>
        <div className="ms-3">
          <h2 className="color-white font-16 mb-1">{inspector.name}</h2>
          <div className="d-flex align-item-center">
            <p className="color-white-800 me-2 font-14">{inspector.rating}</p>
            <Rate disabled defaultValue={inspector.rating} />
          </div>
          <div className="d-flex align-item-center mb-2">
            <div>
              <img
                src="/assets/img/light-location.png"
                alt=""
                className="img-fluid"
              />
            </div>
            <p className="ms-2 font-14 color-white-500 mt-1">
              {inspector.location}
            </p>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        {isActive && (
          <div className="d-flex align-items-center mt-2">
            <p className="color-white pt-1 me-3">Selected</p>
          </div>
        )}
        <div>
          <img src="/assets/img/right-arrow.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default InspectorCard;
