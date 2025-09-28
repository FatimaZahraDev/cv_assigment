import { lazy } from "react";

// Public Routes (No login required)
export const routes = [
  { path: "/", name: "home", component: lazy(() => import("@/pages/home")) },
  {
    path: "/vehicle",
    name: "vehicle",
    component: lazy(() => import("@/pages/vehicle")),
  },
  {
    path: "/vehicle/vehicle-detail/:id",
    name: "vehicle-detail",
    component: lazy(() => import("@/pages/vehicle/vehicledetail")),
  },
  {
    path: "/vehicle/compare",
    name: "vehicle-compare",
    component: lazy(() => import("@/pages/vehicle/compare")),
  },
  {
    path: "/forum",
    name: "forum",
    component: lazy(() => import("@/pages/forum")),
  },
  {
    path: "/event",
    name: "event",
    component: lazy(() => import("@/pages/event")),
  },
  {
    path: "/event/:id",
    name: "event-detail",
    component: lazy(() => import("@/pages/event/eventdetail")),
  },
  {
    path: "/inspection",
    name: "inspection",
    component: lazy(() => import("@/pages/inspection")),
  },
  
  {
    path: "/login",
    name: "login",
    component: lazy(() => import("@/pages/auth/login")),
    authOnly: true,
  },
  {
    path: "/register",
    name: "register",
    component: lazy(() => import("@/pages/auth/register")),
    authOnly: true,
  },
  {
    path: "/forget-passowrd",
    name: "forget-password",
    component: lazy(() => import("@/pages/auth/forgetpassword")),
    authOnly: true,
  },
  {
    path: "/otp-verification",
    name: "otp-verification",
    component: lazy(() => import("@/pages/auth/otpverification")),
    authOnly: true,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: lazy(() => import("@/pages/auth/resetpassword")),
    authOnly: true,
  },

  // Private Routes (Require login)
  {
    path: "/vehicle/inspection-vendor/:id",
    name: "inspection-vendor",
    component: lazy(() => import("@/pages/inspection/inspectionvendor")),
    private: true,
  },
  {
    path: "/vehicle/inspection/:id",
    name: "inspection-detail",
    component: lazy(() => import("@/pages/inspection/inspectiondetail")),
    private: true,
  },
  {
    path: "/book-inspection-vendor",
    name: "book-inspection-vendor",
    component: lazy(() => import("@/pages/inspection/bookinspector")),
    private: true,
  },
  {
    path: "/post-add",
    name: "post-add",
    component: lazy(() => import("@/pages/postadd")),
    private: true,
  },
  {
    path: "/post-add-second-step",
    name: "post-second",
    component: lazy(() => import("@/pages/postadd/postsecondstep")),
    private: true,
  },
  {
    path: "/post-add-third-step",
    name: "post-third",
    component: lazy(() => import("@/pages/postadd/postthirdstep")),
    private: true,
  },
  {
    path: "/profile/myadd",
    name: "myadd",
    component: lazy(() => import("@/pages/profilepages/myadd")),
    private: true,
  },
  {
    path: "/profile/request",
    name: "request",
    component: lazy(() => import("@/pages/profilepages/request")),
    private: true,
  },
  {
    path: "/profile/settings",
    name: "settings",
    component: lazy(() => import("@/pages/profilepages/settings")),
    private: true,
  },
  {
    path: "/profile/privacy-policy",
    name: "privacy-policy",
    component: lazy(() => import("@/pages/profilepages/staticpages/privacypolicy")),
    private: true,
  },
  {
    path: "/profile/terms-conditions",
    name: "terms-conditions",
    component: lazy(() => import("@/pages/profilepages/staticpages/termsconditions")),
    private: true,
  },
  {
    path: "/profile/about",
    name: "faq",
    component: lazy(() => import("@/pages/profilepages/staticpages/about")),
    private: true,
  },
  {
    path: "/profile/subscription",
    name: "subscription",
    component: lazy(() => import("@/pages/profilepages/subscription")),
    private: true,
  },
  {
    path: "/profile/bank-details",
    name: "bank-detail",
    component: lazy(() => import("@/pages/profilepages/bankdetail")),
    private: true,
  },
  {
    path: "/profile/edit-profile",
    name: "edit-profile",
    component: lazy(() => import("@/pages/profilepages/editprofile")),
    private: true,
  },
  {
    path: "/profile/help",
    name: "help",
    component: lazy(() => import("@/pages/profilepages/profilehelp")),
    private: true,
  },
  {
    path: "/profile/change-password",
    name: "change-password",
    component: lazy(() => import("@/pages/profilepages/changepassword")),
    private: true,
  },
  {
    path: "/chat-screen",
    name: "chat-screen",
    component: lazy(() => import("@/pages/chatscreen")),
    private: true,
  },
];
