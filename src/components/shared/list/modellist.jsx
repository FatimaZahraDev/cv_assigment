import React from "react";

const ModelList = ({ image, title, description, isSeller, sellerImage, sellerEmail, messageImage }) => {
  return (
   
        <div className={`make-list ${isSeller ? "seller-list" : ""}`}>
          {isSeller ? (
            <>
              <div className="seller-profile d-flex align-items-center">
                <div className="seller-profile-img">
                  <img src={sellerImage} alt="" className="img-fluid" />
                </div>
                <div className="ms-3">
                  <h2 className="color-white font-22 mb-1">{title}</h2>
                  <p className="color-white-800">{sellerEmail}</p>
                </div>
              </div>
              <div className="ms-2">
                <img src={messageImage} className="img-fluid" alt="" />
              </div>
            </>
          ) : (
            <>
              {image && (
                <div className="make-list-img">
                  <img src={image} alt="" className="img-fluid" />
                </div>
              )}
              <div className="ms-2">
                <h2 className="color-white font-22 mb-1">{title}</h2>
                <p className="color-white-800">{description}</p>
              </div>
            </>
          )}
        </div>
      
  );
};

export default ModelList;
