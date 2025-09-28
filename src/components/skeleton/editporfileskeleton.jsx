import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { Skeleton } from "antd";
const EditPorfileSkeleton = () => {
  return (
    <ProfileLayout page_title="Edit Profile">
      <div className="row">
        <div className="col-12">
          <div className="row justify-content-center mb-5">
            <div className="col-12  mb-5 position-relative">
              <div className="w-100 mb-4">
                <Skeleton.Image
                  className="w-100 tex-center align-items-center d-flex"
                  active
                  style={{
                    height: 160,
                    backgroundColor: "#444", // dark grey background
                    borderRadius: 12,
                    display: "block",
                    // width: "100%",
                  }}
                />
              </div>
              <div className="mb-3 text-center uploader-profile">
                <Skeleton.Image
                  size={100}
                  shape="circle"
                  active
                  style={{
                    backgroundColor: "#444", // dark grey background
                    borderRadius: 100,
                    width: 120,
                    height: 120,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 text-center mb-5"></div>

        {/* Full Name Input */}
        <div className="col-12 col-md-6 mb-4">
          <Skeleton.Input
            active
            style={{ width: 500, height: 60, backgroundColor: "#444" }}
          />
        </div>

        {/* Email Input */}
        <div className="col-12 col-md-6 mb-4">
          <Skeleton.Input
            active
            style={{
              width: 500,
              height: 60,
              backgroundColor: "#444",
              display: "block",
            }}
          />
        </div>

        {/* Contact Number Input */}
        <div className="col-12 col-md-6 mb-4">
          <Skeleton.Input
            active
            style={{ width: 500, height: 60, backgroundColor: "#444" }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="row">
        <div className="col-12 col-md-3 col-lg-4 col-xl-5">
          <Skeleton.Button
            active
            style={{ width: 500, height: 60, backgroundColor: "#444" }}
          />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default EditPorfileSkeleton;
