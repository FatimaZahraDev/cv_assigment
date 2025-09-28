import React from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import { Form, Radio, Switch } from "antd";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import ImageUploader from "@/components/shared/imageuploader";
import HelpBox from "@/components/shared/box/helpbox";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";
import Helper from "@/helpers";
import PostAddWizard from "./PostAddWizard";

const PostThirdStep = () => {
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
                <p className="color-red font-18">Step 3 of 3</p>
                <h1 className="color-white">Attach Media</h1>
                <p className="color-white-800 mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
              {/* <Form
                layout="vertical"
                className="form-input mt-4"
                onFinish={handleFinalSubmit}
              >
                <div className="border-bottom mb-3">
                  <ImageUploader name="images" />
                </div>
                <div className="mb-3">
                  <h3 className="color-white font-30 mt-1">Set Price</h3>
                  <p className="color-white-800 mt-2 mb-4">
                    Lorem Ipsum is simply dummy text...
                  </p>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="usd-input">
                        <BaseInput
                          icon={<p className="usd-p">USD</p>}
                          placeholder="$100,000.00"
                          className=""
                          name="price"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="featured-box">
                        <p>Featured Post</p>
                        <Switch
                          defaultChecked
                          onChange={(val) => updateFormData({ featured: val })}
                          nam="is_featured"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-5 col-lg-4">
                      <FlatButton
                        htmlType="submit"
                        title="Post vehicle ad"
                        className="car-detail-btn btn-bg-red"
                      />
                    </div>
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

export default PostThirdStep;
