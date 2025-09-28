import { Footer } from "antd/es/layout/layout";
import React from "react";
import { Link } from "react-router";

const InnerFooter = () => {
  return (
    <>
      <section className="footer-upper-sec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="font-90">Get your</h2>
              <h2 className="head-2">Desired Vehicle</h2>
              <h2 className="head-2">Now</h2>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-3 col-lg-4 col-xl-4">
              <div className="footer-logo">
                <img src="/assets/img/footer-logo.png" alt="" />
               
              </div>
               <p className="mt-3 font-500">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500
                </p>
                <div className="mt-3 mb-3 social-link">
                  <img src="/assets/img/fb-iocn.png" alt="" className="pe-4" />
                  <img
                    src="/assets/img/linkdin-icon.png"
                    alt=""
                    className="pe-4"
                  />
                  <img
                    src="/assets/img/twiter-icon.png"
                    alt=""
                    className="pe-4"
                  />
                  <img src="/assets/img/insta-icon.png" alt="" />
                </div>  
            </div>
            <div className="col-12 col-sm-4 col-md-3 col-lg-2 col-xl-2 offset-xl-2">
              <p className="font-18 mb-3">Quick Links</p>
              <ul>
                <li className="mb-2"><Link to="/">Home</Link></li>
                <li className="mb-2"><Link to="/vehicle">Vehicle</Link></li>
                <li className="mb-2"><Link to="/event">Events</Link></li>
                <li className="mb-2"><Link to="/forum">Forum</Link></li>
                <li className="mb-2"><Link to="/inspection">Inspection</Link></li>
              </ul>
            </div>
            <div className="col-12 col-sm-4 col-md-3 col-lg-2 col-xl-2">
              <p className="font-18 mb-3">Resources</p>
              <ul >
                <li className="mb-2"><Link to="/chat-screen">Messages</Link></li>
                <li className="mb-2"><Link to="/profile/request">Request</Link></li>
                <li className="mb-2"><Link to="/profile/bank-details">Bank Details</Link></li>
                <li className="mb-2"><Link to="/profile/subscription">Manage Subscription</Link></li>
              </ul>
            </div>
            <div className="col-12 col-sm-4 col-md-3 col-lg-2 col-xl-2">
              <p className="font-18 mb-3"><Link to="#">Contact Us</Link></p>
              <ul>
                <li className="mb-2"> <Link to="#">General Inquiries</Link></li>
                <li className="mb-2"><Link to="#">FAQ</Link></li>
                <li className="mb-2"> <Link to="#">E-news Sign up</Link></li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between footer-border mt-4">
                <div className="d-flex align-items-center">
                  <p>Terms & Conditions</p>
                  <p className="ms-3">Privacy Policy</p>
                </div>
                <div>
                  <p>Copyright © 2024 Modded Market. All rights reserved.</p>
                </div>
                <div>
                  <img src="/assets/img/master-card.png" alt="" className="ms-1" />
                   <img src="/assets/img/visa-card.png" alt="" className="ms-1" />
                    <img src="/assets/img/stripe-card.png" alt="" className="ms-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default InnerFooter;
