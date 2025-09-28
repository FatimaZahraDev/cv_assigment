import React from "react";

// Helper to detect PDF files
const isPdf = (url) => {
  if (!url) return false;
  try {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.toLowerCase().endsWith(".pdf");
  } catch (e) {
    return false;
  }
};

// Renders either a PDF link preview or an image preview
const renderFilePreview = (url, label) => {
  if (!url) return null;

  if (isPdf(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="d-flex align-items-center akira-pdf"
        style={{ textDecoration: "none" }}
      >
        <div className="akira-pdf-img">
          <img src="/assets/img/pdf-document.png" alt="PDF" />
        </div>
        <div className="ms-3">
          <p className="color-white">{label}</p>
          <p className="color-white-800" style={{ maxWidth: 380, wordBreak: "break-all" }}>
            {url}
          </p>
        </div>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img
        src={url}
        alt={label}
        style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 8 }}
      />
    </a>
  );
};

const InspectorProfileDetails = ({ inspector }) => {
  if (!inspector) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="inspection-card">
          <div className="inspection-header">
            <img
              src={inspector?.header_image || "/assets/img/inspection-header-1.png"}
              alt=""
            />
          </div>
          <div className="inspection-body">
            <div className="inspection-profile">
              <img
                src={inspector?.profile_image || "/assets/img/akera-img.png"}
                alt={inspector?.name || inspector?.full_name || "Inspector"}
                className="img-fluid"
              />
            </div>
            <h2 className="color-white text-center font-24 mt-2">
              {inspector?.name || inspector?.full_name || "Unknown"}
            </h2>
          </div>
        </div>

        <div className="col-12 col-md-6 mb-2">
          <p className="color-white-800">Company Name</p>
          <p className="color-white">{inspector?.company_name || "-"}</p>
        </div>
        <div className="col-12 col-md-6 mb-2">
          <p className="color-white-800 ">Email</p>
          <p className="color-white">{inspector?.email || "-"}</p>
        </div>
        <div className="col-12 col-md-6 mb-2">
          <p className="color-white-800 ">Contact Number</p>
          <p className="color-white">{inspector?.contact_number || inspector?.phone || "-"}</p>
        </div>
        <div className="col-12 col-md-6 mb-2">
          <p className="color-white-800 ">Service Rate</p>
          <p className="color-white">
            {inspector?.service_rate ? `${inspector.service_rate}` : "-"}
            <span> $</span>
          </p>
        </div>

        <div className="col-12">
          <p className="color-white-800">Address</p>
          <p className="color-white">
            {[
              inspector?.street,
              inspector?.city,
              inspector?.state,
            ]
              .filter(Boolean)
              .join(", ") || "-"}
          </p>
        </div>

        <div className="col-12 mt-3">
          <h3 className="color-white font-20 mb-2">License / Certificate</h3>
          <div className="d-flex gap-3 flex-wrap">
            {renderFilePreview(inspector?.business_license_image, "Business License")}
            {renderFilePreview(inspector?.certificate, "Certificate")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorProfileDetails;
