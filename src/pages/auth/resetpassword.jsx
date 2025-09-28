import React from "react";

import { Form } from "antd";
import BaseInput from "@/components/shared/inputs";
import { Link, useLocation, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import AuthLayout from "@/components/shared/layout/authlayout";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  console.log("reset password", data);

  const { mutate, isPending } = useMutation("resetPassword", {
    useFormData: false,
    onSuccess: async (data) => {
      if (data) {
        navigate("/login"), {};
      }
    },
  });

  const onFinish = (values) => {
    const transformedData = {
      ...values,
      otp: data?.otp,
      email: data?.email,
      // Generate a web token
    };
    mutate(transformedData);
  };

  return (
    <>
      <AuthLayout pageType="register" pageClass="register">
        <h1 className="color-white ">Reset Password</h1>
        <p className="subtitle">
          Create an account by filling in the data below
        </p>
        <Form
          onFinish={onFinish}
          layout="vertical"
          className="login-input mt-4"
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <BaseInput
                name="password"
                placeholder="Enter Password"
                label="Password"
                type="password"
                rules={combineRules(
                  "password",
                  validations.required,
                  validations.password
                )}
              />
            </div>
            <div className="col-12 col-md-6">
              <BaseInput
                name="password_confirmation"
                placeholder="Enter Confirm Password"
                label="Confirm Password"
                type="password"
                rules={[
                  validations.required("confirm-password"),
                  ({ getFieldValue }) => ({
                    validator: (_, value) => {
                      const password = getFieldValue("password");
                      if (!value || !password) {
                        return Promise.resolve();
                      }
                      if (value !== password) {
                        return Promise.reject(
                          new Error("Confirm Passwords does not match")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                dependencies={["password"]}
              />
            </div>
          </div>

          <div className="">
            <p className="mb-4">
              By registering, you agree to our Terms & Conditions, Privacy and
              Cookie Policy, and to join our loyalty programme
            </p>
          </div>

          <div className="d-flex w-100 align-items-center">
            <FlatButton
              title={isPending ? "Submitting..." : "Submint"}
              className="sign-in-btn register-btn theme-button"
              htmlType="submit"
              loading={isPending}
              disabled={isPending}
            />
          </div>
        </Form>
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
