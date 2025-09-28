import React from "react";


const ProfileList = ({ image, title, onClick, active }) => {
  return (
    <div
      className={`profile-drop-item ${active ? "active-profile-item" : ""}`}
      onClick={onClick}
    >
      <div className="d-flex align-items-center">
        <div>
          <img src={image} alt="" />
        </div>
        <div className="ms-3">
          <p>{title}</p>
        </div>
      </div>
      <div>
        <img src="/assets/img/right-arrow.png" alt="" />
      </div>
    </div>
  );
};

export default ProfileList;
