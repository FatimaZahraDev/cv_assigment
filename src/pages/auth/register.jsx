import React from "react";

import { Form } from "antd";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import BaseInput from "@/components/shared/inputs";
import { Link, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import AuthLayout from "@/components/shared/layout/authlayout";
import { combineRules, validations } from "@/config/rules";
import { useMutation, useQuery } from "@/hooks/reactQuery";
import Helper from "@/helpers";

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation("signup", {
    useFormData: false,
    onSuccess: async (data) => {
      if (data) {
        navigate("/login");
      }
    },
  });

  const onFinish = (values) => {
    const transformedData = {
      ...values,
      is_term_accept: true,
      device: "web",
      device_token: "web-token-" + Date.now(), // Generate a web token
    };
    const finalPayload = {
      ...transformedData,
    };
    mutate(finalPayload);
  };

  return (
    <>
      <AuthLayout pageType="register" pageClass="register">
        <h1 className="color-white ">Let's Create New Account</h1>
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
                name="name"
                placeholder="Ex: Baker Davis"
                label="Full Name"
                rules={combineRules(
                  "full-name",
                  validations.required,
                  validations.minLength(2),
                  validations.maxLength(40)
                )}
              />
            </div>
            <div className="col-12 col-md-6">
              <BaseInput
                name="email"
                placeholder="Ex: baker.davis@example.com"
                label="Email address"
                rules={combineRules(
                  "email",
                  validations.required,
                  validations.email
                )}
              />
            </div>
            <div className="col-12 col-md-12">
              <Form.Item
                name="contact_number"
                label="Phone Number"
                rules={[
                  validations.required("Phone Number"),
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!isValidPhoneNumber(value)) {
                        return Promise.reject(
                          new Error(
                            "Please enter a valid phone number for the selected country"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                className="phone-input-item"
              >
                <PhoneInput
                  placeholder="Ex: +1 1234 546 752"
                  defaultCountry="US"
                  international
                  countryCallingCodeEditable={false}
                  className="custom-phone-input"
                />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
              <BaseInput
                name="password"
                placeholder="Enter Password"
                label="Password"
                type="password"
                rules={combineRules(
                  "password",
                  validations.required,
                  validations.password,
                  validations.passwordCharacters
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
              By registering, you agree to our Terms & Conditions, Privacy and
              Cookie Policy, and to join our loyalty programme
            </p>
          </div>

          <div className="d-flex w-100 align-items-center">
            <FlatButton
              title={isPending ? "Creating Account..." : "Register"}
              className="sign-in-btn register-btn theme-button"
              htmlType="submit"
              loading={isPending}
              disabled={isPending}
            />
            <div className="divider ms-4">OR</div>

            <div className="social-login">
              <FlatButton
                title={<img src="/assets/img/google-icon.png" alt="" />}
                className="social-btn google"
              />
              <FlatButton
                title={<img src="/assets/img/fb-icon.png" alt="" />}
                className="social-btn facebook"
              />
              <FlatButton
                title={<img src="/assets/img/apple-icon.png" alt="" />}
                className="social-btn apple"
              />
            </div>
          </div>
        </Form>
      </AuthLayout>
    </>
  );
};

export default Register;
