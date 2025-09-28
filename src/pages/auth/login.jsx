import React from "react";

import { Form } from "antd";
import BaseInput from "@/components/shared/inputs";
import { Link, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import AuthLayout from "@/components/shared/layout/authlayout";
import { combineRules, validations } from "@/config/rules";
import { useMutation } from "@/hooks/reactQuery";
import Helper from "@/helpers";

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation("login", {
    useFormData: false,
    onSuccess: async (data) => {
      if (data) {
        await Helper.setStorageData("session", data.data.data);
        window.user = data.data.data;
        navigate("/", { replace: true });
      }
    },
  });
  const onFinish = (values) => {
    const transformedData = {
      ...values,
      device: "web",
      device_token: "web-token-" + Date.now(), // Generate a web token
    };
    mutate(transformedData);
  };

  return (
    <AuthLayout pageType="login" pageClass="login">
      <h1 className="text-center">Login to your account</h1>
      <p className="subtitle text-center">
        Enter your credentials to active your account
      </p>
      <Form onFinish={onFinish} layout="vertical" className="login-input mt-4">
        <BaseInput
          name="login"
          placeholder="Enter Email"
          label="Email address"
          rules={combineRules("email", validations.required, validations.email)}
        />
        <BaseInput
          placeholder="Enter Password"
          label="Password"
          type="password"
          name="password"
          rules={combineRules(
            "password",
            validations.required,
            validations.password
            // validations.passwordCharacters
          )}
        />
        <div className="forgot-password">
          <Link to="/forget-passowrd">Forgot Password?</Link>
        </div>

        <FlatButton
          title={isPending ? "Sign In..." : "Sign In"}
          className="sign-in-btn theme-button"
          htmlType="submit"
          loading={isPending}
          disabled={isPending}
        />
      </Form>

      <div className="divider">OR</div>

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

      <p className="register-text mt-4">
        New to Modded Market?{" "}
        <Link to="/register" className="register-link">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
