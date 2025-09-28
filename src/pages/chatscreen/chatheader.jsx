import React from "react";
import FlatButton from "@/components/shared/button/flatbutton";

const ChatHeader = () => {
  return (
    <>
      <div className="chat-header">
        <div className="user-details">
          <div className="d-flex align-items-center">
            <div className="chat-user-img">
              <img src="/assets/img/akera-img.png" alt="" className="" />
            </div>
            <div className="ms-3">
              <h3 className="font-500">Harry Lington</h3>
              <p className="color-white-500">Last active 2 weeks ago</p>
            </div>
          </div>
          <div className="d-flex align-items-center me-3">
            <div className="me-4">
              <img src="/assets/img/horizontal-dots.png" alt="" />
            </div>
            <div>
              <img src="/assets/img/close-icon.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="vehicle-info">
        <div className="d-flex align-items-center">
          <div className="vehicle-img">
            <img
              src="/assets/img/event-card.png"
              alt=""
              className="vehicle-img"
            />
          </div>
          <div className="ms-3">
            <h4 className="font-500">Ford Mustang GT</h4>
            <div className="d-flex align-items-center mb-2">
              <img
                src="/assets/img/light-location.png"
                alt=""
                className="img-fluid"
              />
              <p className="ms-2 color-white-500 mt-1">
                At Lane 57, South street, Florida
              </p>
            </div>
          </div>
        </div>
        <FlatButton className="view-btn theme-button" title="View Vehicle" />
      </div>
    </>
  );
};

export default ChatHeader;
