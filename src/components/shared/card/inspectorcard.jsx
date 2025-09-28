// components/inspectorCard.jsx
import React from "react";
import FlatButton from "@/components/shared/button/flatbutton";

const InspectorCard = ({ name, headerImg, profileImg, onViewProfile }) => {
  return (
   
      <div className="inspection-card">
        <div className="inspection-header">
          <img src={headerImg} alt="" />
        </div>
        <div className="inspection-body">
          <div className="inspection-profile">
            <img src={profileImg} alt={name} />
          </div>
          <div className="text-center">
            <h2 className="color-white font-20 mt-2 mb-1">{name}</h2>
            <FlatButton title="View Profile" className="ins-btn" onClick={onViewProfile} />
          </div>
        </div>
      </div>
  
  );
};

export default InspectorCard;
