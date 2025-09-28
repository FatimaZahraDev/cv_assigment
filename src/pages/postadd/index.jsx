import React, { useState } from "react";
import { useLocation } from "react-router";
import InnerLayout from "@/components/shared/layout/innerlayout";
import HelpBox from "@/components/shared/box/helpbox";
import PostAddWizard from "./PostAddWizard";

const PostAdd = () => {
  const location = useLocation();
  const isEditMode = location.state?.isEdit || false;
  
  return (
    <InnerLayout headerClass="sub-header">
      <section className="addpost-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-8">
              <div className="border-bottom mb-3 pb-3">
                <h1 className="color-white">
                  {isEditMode ? "Edit your Vehicle Ad" : "Post your Vehicle Ad"}
                </h1>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-7 col-lg-8">
              <div className="border-bottom  mb-3 pb-3">
                <p className="color-red font-18">Step 1 of 3</p>
                <h1 className="color-white">Vehicle Details</h1>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>

              {/* <Form
                layout="vertical"
                className="form-input mt-4"
                onFinish={handleFinishStep1}
              >
                <div className="row">
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Vehicle Make"
                      name="make_id"
                      type="select"
                      placeholder="Honda"
                      options={getOptions("makes")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Vehicle Model"
                      name="model_id"
                      type="select"
                      placeholder="Vezel"
                      options={getOptions("models")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Vehicle Year"
                      name="year_id"
                      type="select"
                      placeholder="2024"
                      options={getOptions("years")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Milage"
                      name="mileage_id"
                      type="select"
                      placeholder="12,000 miles"
                      options={getOptions("mileages")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Fuel Type"
                      name="fuel_type_id"
                      type="select"
                      placeholder="Petrol"
                      options={getOptions("fuel_types")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Transmission Type"
                      name="transmission_type_id"
                      type="select"
                      placeholder="Automatic"
                      options={getOptions("transmission_types")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Registration"
                      name="city_id"
                      type="select"
                      placeholder="Miami"
                      options={getOptions("cities")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Registration State"
                      name="state_id"
                      type="select"
                      placeholder="Florida"
                      options={getOptions("states")}
                      loading={isDropdownLoading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <BaseInput
                      label="Registration Status"
                      name="registration_status"
                      type="select"
                      placeholder="Registered"
                      options={getOptions("registration_statuses")}
                      loading={isDropdownLoading}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-5 col-lg-4">
                    <FlatButton
                      htmlType="submit"
                      title="Continue to next step"
                      className="car-detail-btn btn-bg-red theme-button"
                    />
                  </div>
                </div>
              </Form> */}
              <PostAddWizard />
            </div>
            <div className="col-12 col-md-5 col-lg-4">
              <HelpBox />
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default PostAdd;