import React, { useEffect } from "react";
import { Form } from "antd";
import BaseInput from "@/components/shared/inputs";
import { Link, useLocation, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import AuthLayout from "@/components/shared/layout/authlayout";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";
import Helper from "@/helpers";
import { message } from "antd";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: optData } = location.state || {};

  useEffect(() => {
    if (optData?.otp) {
      message.success(`Your OTP is: ${optData?.otp}`, 100);
    }
  }, [optData?.otp]);

  const { mutate, isPending } = useMutation("verifyOtp", {
    useFormData: false,
    onSuccess: (data) => {
      if (data)
        navigate("/reset-password", {
          state: {
            data: optData,
          },
        });
    },
  });
  const onFinish = (values) => {
    const transformedData = {
      ...values,
      device: "web",
      email: optData?.email,
      device_token: "web-token-" + Date.now(), // Generate a web token
    };
    mutate(transformedData);
  };

  return (
    <AuthLayout pageType="login" pageClass="login">
      <h1 className="text-center">OTP Verifacation</h1>
      <p className="subtitle text-center">
        Please enter the 6 Digit verification code sent to your phone +555 5555
        5555
      </p>
      <Form onFinish={onFinish} layout="vertical" className="login-input mt-4">
        <div className="otp-input d-flex align-items-center justify-content-center">
          <BaseInput
            name="otp"
            type="otp"
            placeholder="1"
            className="auth-input"
            rules={combineRules("otp", validations.required, validations.otp)}
          />
        </div>

        <FlatButton
          title={isPending ? "Submitting..." : "Submit"}
          className="sign-in-btn theme-button"
          htmlType="submit"
          loading={isPending}
          disabled={isPending}
        />
      </Form>
    </AuthLayout>
  );
};

export default OTPVerification;
