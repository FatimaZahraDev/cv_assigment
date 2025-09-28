import React from "react";
import FlatButton from "@/components/shared/button/flatbutton";
import { useNavigate, useLocation, Link } from "react-router";

const AuthSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
     <img src="/assets/img/login-car-img.png" alt="" />
      <div className="buttons">
        <FlatButton
          title="Login"
          className={`btn ${currentPath === "/login" ? "active" : ""}`}
          onClick={() => navigate("/login")}
        />
        <FlatButton
          title="Register"
          className={`btn ${currentPath === "/register" ? "active" : ""}`}
          onClick={() => navigate("/register")}
        />
      </div>
      <div className="login-login">
         <Link to="/"> <img src="/assets/img/logo.png" alt="" /></Link>
      </div>
    </>
  );
};

export default AuthSidebar;
