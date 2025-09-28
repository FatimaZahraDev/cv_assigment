import React from "react";
import AuthSidebar from "./authsidebar";

const AuthLayout = ({
  children,
  logoClass = "auth-logo",
  title,
  detail,
  src = "/assets/img/auth-img.png",
  showSidebar = false,
  pageType = "login", // "login" | "signup" | "forget"
  pageClass
}) => {
  // Conditional class setup based on pageType
  const leftColClass =
    pageType === "login" ? "col-6" : "col-12 col-md-4 col-lg-4 col-xl-5";
   
  const imgSizeClass =  pageClass === "login" ? "login-container" : "login-container register-container";
  const rightColClass =
    pageType === "login" ? "col-6" : "col-12 col-md-8 col-lg-8 col-xl-7";

  return (
    <div className={imgSizeClass}>
      <div className="row gx-0">
        <div className={leftColClass}>
          <div className="left-panel">
            <AuthSidebar />
          </div>
        </div>
        <div className={rightColClass}>
          <div className="right-panel">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
