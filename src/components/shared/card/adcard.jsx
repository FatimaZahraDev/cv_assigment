import React, { useState } from "react";
import { Switch } from "antd";
import { Avatar, Dropdown } from "antd";

const AdCard = ({
  image,
  title,
  location,
  date,
  defaultActive = false,
  overlay,
  vehicleId,
  onStatusChange,
  isUpdating = false,
}) => {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleToggle = (checked) => {
    // Call the parent component's status change handler if provided
    if (onStatusChange && vehicleId) {
      onStatusChange(vehicleId, checked);
    }
  };

  return (
    <div className="my-add-card">
      <div className="d-flex align-items-center">
        <div className="my-car-add">
          <img src={image} alt="Vehicle" />
        </div>
        <div className="ms-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div>
                <h2 className="color-white font-24">{title}</h2>
              </div>
              <div className="d-flex align-items-center ms-3">
                <label
                  className={`m-0 me-2 ${
                    isActive ? "color-green" : "color-yellow"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </label>
                <Switch
                  checked={isActive}
                  onChange={handleToggle}
                  className={isActive ? "switch-green" : "switch-yellow"}
                  loading={isUpdating}
                  disabled={isUpdating}
                />
              </div>
            </div>
            <div>
              <Dropdown overlay={overlay} trigger={["click"]}>
                <div
                  className="white-dots-img"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src="/assets/img/white-dots.png" alt="menu" />
                </div>
              </Dropdown>
            </div>
          </div>

          <div className="d-flex align-items-center mb-2 mt-2">
            <div>
              <img src="/assets/img/light-location.png" alt="Location" />
            </div>
            <p className="ms-2 color-white-500 mt-1">{location}</p>
          </div>
          <p className="ms-2 color-white-500">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
