import React, { Children } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import InnerLayout from "@/components/shared/layout/innerlayout";
import ProfileList from "@/components/shared/list/profilelist";
import BaseInput from "@/components/shared/inputs";
import useSweetAlert from "@/hooks/useSweetAlert";

const ProfileLayout = ({ children, page_title }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const user = window?.user.user;
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
  return (
    <InnerLayout headerClass="sub-header">
      <section className="profile-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-4">
              <div className="profile-items-area">
                <div className="user-info mb-3 pb-3 d-flex align-items-center border-bottom">
                  <div className="drop-img-profile d-flex align-items-center">
                    <img
                      src={user?.profile_image || "/assets/img/akera-img.png"}
                      alt="Profile"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="ms-3">
                    <div>
                      <h2 className="color-white font-26">{user?.name}</h2>
                    </div>
                    <div>
                      <Link to="/profile/edit-profile">
                        <p className="color-white-500 font-18">Edit Profile</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <ProfileList
                  image="/assets/img/car-icon.png"
                  title="My Vehicles Ads"
                  onClick={() => navigate("/profile/myadd")}
                  active={currentPath === "/profile/myadd"}
                />
                <ProfileList
                  image="/assets/img/request-icon.png"
                  title="Requests"
                  onClick={() => navigate("/profile/request")}
                  active={currentPath === "/profile/request"}
                />
                <ProfileList
                  image="/assets/img/suscribtion-icon.png"
                  title="Subscription"
                  onClick={() => navigate("/profile/subscription")}
                  active={currentPath === "/profile/subscription"}
                />
                {/* <ProfileList
                  image="/assets/img/bank-icon.png"
                  title="Bank Details"
                  onClick={() => navigate("/profile/bank-details")}
                  active={currentPath === "/profile/bank-details"}
                /> */}
                <ProfileList
                  image="/assets/img/chnage-pass.png"
                  title="Change Password"
                  onClick={() => navigate("/profile/change-password")}
                  active={currentPath === "/profile/change-password"}
                />
                <ProfileList
                  image="/assets/img/help-icon.png"
                  title="Help"
                  onClick={() => navigate("/profile/help")}
                  active={currentPath === "/profile/help"}
                />
                <ProfileList
                  image="/assets/img/setting-icon.png"
                  title="Settings"
                  onClick={() => navigate("/profile/settings")}
                  active={currentPath === "/profile/settings"}
                />
                <ProfileList
                  image="/assets/img/logout-icon.png"
                  title="Logout"
                  onClick={handleSignout}
                />
              </div>
            </div>
            <div className="col-12 col-md-9 col-lg-8">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                <div>
                  <p className="color-red font-20">Profile</p>
                  <h2 className="color-white font-30">{page_title}</h2>
                </div>
                <div>
                  {/* <BaseInput
                    type=""
                    placeholder="Search Events"
                    className="tunner-select"
                    icon={<img src="/assets/img/search-icon.png" />}
                  /> */}
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default ProfileLayout;
