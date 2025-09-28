import React from "react";

const TokenCard = ({
  byer_img,
  buyer_name,
  buyer_email,
  car_name,
  token_amount,
  buyer_concern,
  button_area,
  onDetailClick
}) => {
  return (
    <div className="token-card">
      <div className="token-card-header">
        <div className="d-flex align-items-center">
          <div className="token-user-img">
            <img src={byer_img} alt="" />
          </div>
          <div> 
            <div className="ms-2">
              <h2 className="fon-30 color-white">{buyer_name}</h2>
              <p className="color-white-500">{buyer_email}</p>
            </div>
          </div>
        </div>
        <div className="token-chat-img">
          <img src="/assets/img/seller-message.png" alt="" />
        </div>
      </div>

      <div className="token-body">
        <div className="mt-3 d-flex  justify-content-between">
          <h2 className="color-white w-70">{car_name}</h2>
          <p className="color-red "  style={{ cursor: "pointer" }} onClick={onDetailClick}>View Detail</p>
        </div>
        <div className="mt-2 d-flex align-items-center">
          <span className="font-14 color-white-500 d-block mt-1">
            Token Amount:
          </span>
          <h2 className="color-white ms-2 mt-0"> {token_amount}</h2>
        </div>
        <p className="mt-2 color-white-500">{buyer_concern}</p>
      </div>

      <div className="d-flex align-items-center justify-content-end mt-4">
        {button_area}
      </div>
    </div>
  );
};

export default TokenCard;
