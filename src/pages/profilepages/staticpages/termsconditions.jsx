import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { useNavigate } from "react-router";
import { useQuery } from "@/hooks/reactQuery";

const TermsConditions = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery("getTermsPage");
  const content = data?.data?.content || data?.data?.description || "";

  return (
    <ProfileLayout page_title="Terms & Conditions">
      <div className="d-flex align-items-center mb-3" style={{ cursor: "pointer" }} onClick={() => navigate("/profile/settings")}> 
        <img src="/assets/img/right-arrow.png" alt="back" style={{ transform: "rotate(180deg)" }} />
        <span className="ms-2 color-white-500">Back</span>
      </div>
      <h2 className="color-white font-26 mb-3">Terms & Conditions</h2>
      {isLoading ? (
        <p className="color-white-500">Loading...</p>
      ) : isError ? (
        <p className="text-danger">Failed to load content.</p>
      ) : (
        <div className="color-white-500" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </ProfileLayout>
  );
};

export default TermsConditions;
