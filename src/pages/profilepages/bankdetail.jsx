import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { Form } from "antd";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";

const BankDetail = () => {
  return (
    <ProfileLayout page_title="Bank Details">
      <div className="row">
        <div className="col-12 col-md-6">
          <h2 className="color-white font-24">Card Details</h2>
          <p className="color-white-500">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <Form layout="vertical" className="form-input mt-4">
            <div className="row">
              <div className="col-12 col-md-12">
                <BaseInput placeholder="Baker Davis" label="Card Title" />
              </div>
              <div className="col-12 col-md-12">
                <BaseInput
                  placeholder="4564 7531 1594 8462"
                  label="Card Number"
                />
              </div>
              <div className="col-12 col-md-6">
                <BaseInput placeholder="02/28" label="Expiry" />
              </div>
              <div className="col-12 col-md-6">
                <BaseInput placeholder="456" label="CVV" />
              </div>
              <div className="col-12 col-md-12">
                <FlatButton
                  title="Add New Card"
                  className="car-detail-btn btn-bg-red mt-2 theme-button"
                />
              </div>
            </div>
          </Form>
        </div>
        <div className="col-12 col-md-5">
          <div className="added-card">
            <div className="d-flex align-items-center">
              <div>
                <img src="/assets/img/master-card-black.png" alt="" />
              </div>
              <div className="ms-3">
                <p className="color-white font-18">Baker Davis</p>
                <p className="color-white-800 font-22">**** **** **** 4567</p>
              </div>
            </div>
            <div>
              <p className="card-circle"></p>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default BankDetail;
