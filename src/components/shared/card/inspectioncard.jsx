import React from "react";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";

const InspectionCard = ({
  my_profile_img,
  user_name,
  request_for_car,
  request_status,
  inspector_img,
  inspector_name,
  inspector_location,
  request_date,
  payment_status,
  request_time,
  service_price,
  deleteButton
}) => {
  return (
    <div className="inspection-card">
      <div className="inspection-card-header d-flex  justify-content-between">
        <div className="d-flex align-items-center">
          <div className="my-profile-img">
            <img src={my_profile_img} alt="" />
          </div>
          <div className="ms-3">
            <div className="d-flex align-items-center">
              <p className="font-16">{user_name}</p>
              <p className="font-12 ms-1 mt-1 color-white-500">Request for</p>
            </div>
            <div>
              <h2 className="font-18">{request_for_car}</h2>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p>
            <span className="color-white-500">Status :</span> {request_status}
          </p>
        </div>
      </div>
      <div className="inspection-card-body d-flex align-items-center w-100">
        <div>
          <div className="inspecter-img">
            <img src={inspector_img} alt="" />
          </div>
          <div>Rating</div>
        </div>

        <div className="w-100 ms-3">
          <div className="d-flex align-items-center justify-content-between w-100">
            <p>{inspector_name}</p>
            <p className="font-20 ">{service_price}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="ins-location-img d-flex align-item-center mb-2">
              <img src="/assets/img/outline-location.png" alt="" />
              <p className="ms-2 color-white-500 ">{inspector_location}</p>
            </div>
            <div>
              <p className="font-12 color-white-500">{payment_status}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="inspector-card-footer">
        <div className="icon-time-area icon-date-time-area">
          <div className="d-flex align-items-center">
            <p className="color-white font-20">
              <ClockCircleOutlined />
            </p>

            <p className="color-white-500 ms-2 font-16">{request_time}</p>
          </div>
        </div>
        <div className="icon-date-area icon-date-time-area">
          <div className="d-flex align-items-center">
            <div className="">
              <p className="color-white font-20">
                <CalendarOutlined />
              </p>
            </div>
            <div className="ms-2">
              {" "}
              <p className="color-white-500 font-16">{request_date}</p>
            </div>
          </div>
        </div>
       
      </div>
       <div className="text-end mt-2 me-3">
         {deleteButton}
        </div>
    </div>
  );
};

export default InspectionCard;
