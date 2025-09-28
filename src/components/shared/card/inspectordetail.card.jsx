import React from "react";
import { Rate } from "antd";
import FlatButton from "@/components/shared/button/flatbutton";

const InspectorDetailCard = ({ inspector }) => {
  return (
    <div className="inspection-card akera-inspec-card">
      <div className="inspection-header">
        <img src={inspector.headerImg} alt="" />
      </div>

      <div className="inspection-body">
        <div className="d-flex">
          <div className="inspection-profile">
            <img src={inspector.profileImg} alt="" />
          </div>
          <div className="ms-3 mt-3">
            <h2 className="color-white font-40 mt-2 mb-1">{inspector.name}</h2>
            <Rate disabled defaultValue={inspector.rating} />
          </div>
        </div>

        <div className="about-akira">
          <div className="d-flex align-items-center justify-content-between border mt-3 pb-2 mb-4">
            <h2 className="color-white font-18 mb-1">About {inspector.name}</h2>
            <p>Expertise & Experiences</p>
          </div>

          <div className="akira-detail">
            <div className="row">
              <div className="col-12 col-md-6">
                <p className="mb-3">{inspector.email}</p>
              </div>
              <div className="col-12 col-md-6">
                <p>{inspector.phone}</p>
              </div>
              <div className="col-12 col-md-6">
                <p>{inspector.address}</p>
              </div>
            </div>
          </div>

          <h2 className="color-white font-20 mt-4 mb-4">
            License & Certifications
          </h2>

          <div className="akira-pdf">
            <div className="d-flex align-items-center">
              <div className="akira-pdf-img">
                <img src="/assets/img/pdf-document.png" alt="" />
              </div>
              <div className="ms-3">
                <p>{inspector.licenseTitle}</p>
                <p style={{ maxWidth: 380, wordBreak: "break-all" }}>{inspector.licenseFile}</p>
              </div>
            </div>
            <div>
              <FlatButton
                title={
                  <div>
                    <img src="/assets/img/eye.png" alt="" />
                    <p>View</p>
                  </div>
                }
                className="akira-btn theme-button"
                onClick={() => {
                  if (inspector?.licenseUrl) {
                    window.open(inspector.licenseUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                disabled={!inspector?.licenseUrl}
              />
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p>Pricing structure</p>
              <h2 className="color-white font-36">${inspector.price}</h2>
            </div>
            <div>
              <FlatButton
                title="Select Inspector/vendor"
                className="car-detail-btn btn-bg-red mt-3 theme-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDetailCard;
