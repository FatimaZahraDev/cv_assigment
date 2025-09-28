import React from "react";
import FlatButton from "@/components/shared/button/flatbutton";
import InspectorCard from "@/components/shared/card/inspectorcard";

const inspectors = [
  {
    id: 1,
    name: "Nolan Workman",
    headerImg: "/assets/img/inspection-header-1.png",
    profileImg: "/assets/img/akera-img.png",
  },
  {
    id: 2,
    name: "Nolan Workman",
    headerImg: "/assets/img/inspection-header-1.png",
    profileImg: "/assets/img/akera-img.png",
  },
  {
    id: 3,
    name: "Nolan Workman",
    headerImg: "/assets/img/inspection-header-1.png",
    profileImg: "/assets/img/akera-img.png",
  },
  {
    id: 4,
    name: "Nolan Workman",
    headerImg: "/assets/img/inspection-header-1.png",
    profileImg: "/assets/img/akera-img.png",
  },
];

const Inspection = () => {
  return (
    <section className="inspection-sec">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="event-slider-content mb-4">
              <p className="color-red font-28">Inspection</p>
              <h2 className="color-white font-55">Inspect any Vehicle</h2>
              <p className="font-20 mb-3">
                We have the best inspectors at your service
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {inspectors.map((inspector) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <InspectorCard key={inspector.id} {...inspector} />
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-10 col-lg-8 text-center">
            <p className="font-14 color-white-800 mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
            <FlatButton title="Explore More" className="login-btn" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspection;
