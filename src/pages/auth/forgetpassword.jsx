import React from "react";
import { Form } from "antd";
import BaseInput from "@/components/shared/inputs";
import { Link, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import AuthLayout from "@/components/shared/layout/authlayout";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation("forgotPassword", {
    useFormData: false,
    onSuccess: (data) => {
      if (data)
        navigate("/otp-verification", {
          state: {
            data: data?.data?.data,
          },
        });
    },
  });
  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <AuthLayout pageType="login" pageClass="login">
      <h1 className="text-center">Forgot Your Password</h1>
      <p className="subtitle text-center">
        Enter the email address associated with your account.
      </p>
      <Form onFinish={onFinish} layout="vertical" className="login-input mt-4">
        <BaseInput
          name="email"
          placeholder="Enter Email"
          label="Email address"
          rules={combineRules("email", validations.required, validations.email)}
        />

        <FlatButton
          title={isPending ? "Submiting..." : "Submit"}
          className="sign-in-btn theme-button"
          htmlType="submit"
          loading={isPending}
          disabled={isPending}
        />
      </Form>
    </AuthLayout>
  );
};

export default ForgetPassword;
