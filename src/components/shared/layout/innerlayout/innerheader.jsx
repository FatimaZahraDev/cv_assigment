import React, { memo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import FlatButton from "@/components/shared/button/flatbutton";
import CustomDropdowm from "@/components/shared/dropdown";
import { Dropdown, Menu } from "antd";
import ProfileList from "@/components/shared/list/profilelist";
import useSweetAlert from "@/hooks/useSweetAlert";

const InnerHeader = ({ headerClass }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  /* 👉 Detect login */
  const user = window?.user?.user;
  console.log(" window?.user?.user", window?.user);

  const { showAlert } = useSweetAlert();

  const handleSignout = async () => {
    const result = await showAlert({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Clear storage and navigate to login
      window.helper.removeStorageData();
      window.user = null;
      // Use window.location.replace to prevent back navigation
      window.location.replace("/");
    }
  };
  const items = [
    {
      key: "profile-info",
      label: (
        <Link to="/profile/edit-profile">
          <div className="user-info pb-3 d-flex align-items-center border-bottom">
            <div className="drop-img-profile d-flex align-items-center">
              <img
                src={user?.profile_image || "/assets/img/akera-img.png"}
                alt={user?.name}
                className="rounded-circle"
                width="40"
                height="40"
              />
            </div>
            <div className="ms-3">
              <h2 className="color-white font-26">{user?.name}</h2>

              <p className="color-white-500">Edit Profile</p>
            </div>
          </div>
        </Link>
      ),
      disabled: false,
    },
    { type: "divider" },
    {
      key: "my-ads",
      label: (
        <ProfileList
          image="/assets/img/car-icon.png"
          title="My Vehicles Ads"
          onClick={() => navigate("/profile/myadd")}
          active={currentPath === "/profile/myadd"}
        />
      ),
    },
    {
      key: "requests",
      label: (
        <ProfileList
          image="/assets/img/request-icon.png"
          title="Requests"
          onClick={() => navigate("/profile/request")}
          active={currentPath === "/profile/request"}
        />
      ),
    },
    {
      key: "subscription",
      label: (
        <ProfileList
          image="/assets/img/suscribtion-icon.png"
          title="Subscription"
          onClick={() => navigate("/profile/subscription")}
          active={currentPath === "/profile/subscription"}
        />
      ),
    },
    // {
    //   key: "bank",
    //   label: (
    //     <ProfileList
    //       image="/assets/img/bank-icon.png"
    //       title="Bank Details"
    //       onClick={() => navigate("/profile/bank-details")}
    //       active={currentPath === "/profile/bank-details"}
    //     />
    //   ),
    // },
    {
      key: "password",
      label: (
        <ProfileList
          image="/assets/img/chnage-pass.png"
          title="Change Password"
          onClick={() => navigate("/profile/change-password")}
          active={currentPath === "/profile/change-password"}
        />
      ),
    },
    {
      key: "help",
      label: (
        <ProfileList
          image="/assets/img/help-icon.png"
          title="Help"
          onClick={() => navigate("/profile/help")}
          active={currentPath === "/profile/help"}
        />
      ),
    },
    {
      key: "setting",
      label: (
        <ProfileList
          image="/assets/img/setting-icon.png"
          title="Settings"
          onClick={() => navigate("/profile/settings")}
          active={currentPath === "/profile/settings"}
        />
      ),
    },
    {
      key: "logout",
      label: (
        <ProfileList
          image="/assets/img/logout-icon.png"
          title="Logout"
          onClick={handleSignout}
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <>
      <header className={`${headerClass} app-header`}>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo */}
            <NavLink className="navbar-brand" to="/">
              <img src="/assets/img/logo.png" alt="Logo" />
            </NavLink>

            {/* Toggle */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Nav Links */}
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav me-5">
                <li className="nav-item ">
                  <NavLink className="nav-link border-animation" to="/" end>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link border-animation"
                    to="/vehicle"
                    end
                  >
                    Vehicles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link border-animation" to="/forum">
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link border-animation" to="/event">
                    Events
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link border-animation"
                    to="/inspection"
                  >
                    Inspection
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Right Side Actions */}
            {!user ? (
              /* Guest UI */
              <div className="d-flex align-items-center">
                <div className="header-icons me-3">
                  <img src="/assets/img/search-icon.png" alt="Search" />
                </div>
                <FlatButton
                  className="login-btn me-3 theme-button"
                  title="Login"
                  onClick={() => navigate("/login")}
                />
                <FlatButton
                  className="signup-btn theme-button"
                  title="Register"
                  onClick={() => navigate("/register")}
                />
              </div>
            ) : (
              /* Logged‑in UI */
              <div className="d-flex align-items-center">
                <NavLink to="/chat-screen">
                  <div className="header-icons me-3">
                    <img src="/assets/img/header-chat.png" alt="Message" />
                  </div>
                </NavLink>
                <div className="header-icons me-3">
                  <img src="/assets/img/search-icon.png" alt="Search" />
                </div>
                <div className="header-icons me-3">
                  <img src="/assets/img/bell.png" alt="Notifications" />
                </div>

                {/* Profile dropdown */}
                <CustomDropdowm
                  className="drop-header-icons header-icons me-3"
                  overlayClassName="user-profile-items"
                  items={items}
                  icon="true"
                  title={
                    <div className="drop-img me-2">
                      <img
                        src={user?.profile_image || "/assets/img/akera-img.png"}
                        alt={user?.name}
                      />
                    </div>
                  }
                />

                {/* Sell button */}
                <FlatButton
                  className="login-btn sell-btn me-3"
                  title={
                    <div className="sell-v-btn d-flex align-items-center">
                      <img src="/assets/img/add-icon.png" alt="Add" />
                      <p className="mb-0 ms-2">Sell a vehicle</p>
                    </div>
                  }
                  onClick={() => navigate("/post-add")}
                />
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ✅ Login Modal */}
    </>
  );
};

export default memo(InnerHeader);
