import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { Form } from "antd";
import FlatButton from "@/components/shared/button/flatbutton";
import { combineRules, validations } from "@/config/rules";
import BaseInput from "@/components/shared/inputs";
import { useMutation } from "@/hooks/reactQuery";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { mutate: changePassword, isPending } = useMutation("changePassword", {
    onSuccess: async (data) => {
      if (data) {
        form.resetFields();
      }
    },
  });
  const onFinish = (values) => {
    changePassword(values);
  };
  return (
    <ProfileLayout page_title="Change Password">
      <div className="row">
        <div className="col-12">
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            className="form-input mt-4"
          >
            <div className="row">
              <div className="col-12 col-md-6">
                <h2 className="color-white">Old Password</h2>
                <p className="color-white-500 mb-3">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <BaseInput
                  placeholder="Enter Old Password"
                  label="Old Password"
                  type="password"
                  name="old_password"
                  rules={combineRules("password", validations.required)}
                />
              </div>
            </div>
            <div className="row align-items-end ">
              <div className="col-12 col-md-6">
                <h2 className="color-white">New Password</h2>
                <p className="color-white-500 mb-3">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <BaseInput
                  placeholder="Enter strong password"
                  label="Set New Password"
                  type="password"
                  name="new_password"
                  rules={combineRules("password", validations.required)}
                />
              </div>
              <div className="col-12 col-md-6">
                <BaseInput
                  placeholder="Enter confirm password"
                  label="Confirm Password"
                  type="password"
                  name="new_password_confirmation"
                  rules={combineRules("password", validations.required)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-3 col-lg-4 col-xl-5">
                <FlatButton
                  title={isPending ? "Changing Password" : "Change Password"}
                  className="car-detail-btn btn-bg-red mt-2 theme-button"
                  htmlType="submit"
                  disabled={isPending}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ChangePassword;
