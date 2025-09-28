import React, { useState } from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { useNavigate } from "react-router";
import { Switch } from "antd";

const Setting = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ProfileLayout page_title="Settings">
      <div className="row">
        {/* Column 1 - Notification box */}
        <div className="col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
          <div className="token-card p-3 d-flex align-items-center justify-content-between">
            <span className="color-white">Notification</span>
            <Switch
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Column 2 - Privacy Policy */}
        <div className="col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
          <div
            className="token-card p-3 d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile/privacy-policy")}
          >
            <span className="color-white">Privacy Policy</span>
          </div>
        </div>

        {/* Column 3 - Terms & Conditions */}
        <div className="col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
          <div
            className="token-card p-3 d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile/terms-conditions")}
          >
            <span className="color-white">Terms & Conditions</span>
          </div>
        </div>

        {/* Column 4 - FAQ */}
        <div className="col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
          <div
            className="token-card p-3 d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile/about")}
          >
            <span className="color-white">About</span>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Setting;
