import React from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import { Form, Radio } from "antd";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import { useNavigate } from "react-router";
import HelpBox from "@/components/shared/box/helpbox";
import PostAddWizard from "./PostAddWizard";
import { useQuery } from "@/hooks/reactQuery";

const PostSecondStep = ({ setFormData }) => {
  console.log("setFormData", setFormData);
  const navigate = useNavigate();
  const { data: dropdownData, isLoading: isDropdownLoading } =
    useQuery("alldropdowm");
  const updateFormData = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const handleFinishStep2 = (values) => {
    updateFormData(values);
    navigate("/post-add-third-step");
  };

  // Helper to map dropdown data to options
  const getOptions = (key) => {
    if (!dropdownData || !dropdownData[key]) return [];
    return dropdownData[key].map((item) => ({
      label: item.name || item.label || item.title,
      value: item.id || item.value,
    }));
  };

  return (
    <InnerLayout headerClass="sub-header">
      <section className="addpost-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-8">
              <div className="border-bottom mb-3 pb-3">
                <h1 className="color-white">Post your Vehicle Ad</h1>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-7 col-lg-8">
              <div className="border-bottom  mb-3 pb-3">
                <p className="color-red font-18">Step 2 of 3</p>
                <h1 className="color-white">Vehicle Details</h1>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
              <div className="border-bottom mb-3">
                <h3 className="color-white font-30  mt-1">
                  Are there any modifications in the vehicles?
                </h3>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <div className="col-12 col-md-10 col-lg-6 col-xl-5">
                  <Radio.Group
                    name="radiogroup"
                    defaultValue={1}
                    className="custom-radio-group mt-4 mb-4"
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="">
                        <Radio value={1} className="color-white">
                          Yes
                        </Radio>
                      </div>
                      <div className="">
                        <Radio value={2} className="color-white">
                          No
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="color-white font-30  mt-1">
                  Define Modification History
                </h3>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                {/* <Form
                  layout="vertical"
                  className="form-input mt-4"
                  onFinish={handleFinishStep2}
                >
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Engine Modifications"
                        name="engine_modification_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("engine_modifications")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Exhaust System"
                        name="exhaust_system_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("exhaust_systems")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Suspension"
                        name="suspension_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("suspensions")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Wheels & Tires"
                        name="wheels_tires_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("wheels_tires")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Brakes"
                        name="brakes_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("brakes")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Body Kits & Aero Parts"
                        name="body_kit_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("body_kits")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Interior Upgrades"
                        name="interior_upgrade_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("interior_upgrades")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Performance"
                        name="performance_tuning_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("performance_tunings")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Electronics & Infotainment"
                        name="electronics_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("electronics")}
                        loading={isDropdownLoading}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <BaseInput
                        label="Interior & Exterior Condition"
                        name="interior_exterior_id"
                        type="select"
                        placeholder="Select option"
                        options={getOptions("interior_exteriors")}
                        loading={isDropdownLoading}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <h3 className="color-white font-30 mt-1">Description</h3>
                    <p className="color-white-800 mt-2 pb-4">
                      Lorem Ipsum is simply dummy text...
                    </p>
                    <div className="col-12">
                      <BaseInput
                        name="description"
                        type="textarea"
                        rows={3}
                        placeholder="Describe modifications..."
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-5 col-lg-4">
                      <FlatButton
                        htmlType="submit"
                        title="Continue to next step"
                        className="car-detail-btn btn-bg-red"
                      />
                    </div>
                  </div>
                </Form> */}
                <PostAddWizard />
              </div>
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

export default PostSecondStep;
