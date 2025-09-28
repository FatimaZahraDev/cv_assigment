import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import FlatButton from "@/components/shared/button/flatbutton";
import { useQuery } from "@/hooks/reactQuery";
import { Skeleton } from "antd";
import CustomTabs from "@/components/shared/tabs";
import TokenCard from "@/components/shared/card/tokencard";
import { useNavigate } from "react-router";
import TokenMoneyRequest from "@/components/partial/request/tokenmoneyrequest";
import InspectionRequest from "@/components/partial/request/inspectionrequest";

const Request = () => {
  const navigate = useNavigate();
  const {
    data: getRequestToken,
    isLoading,
    isError,
    error,
  } = useQuery("getRequestToken", {});

  // 👉 Backend se data array
  const requests = getRequestToken?.data || [];

  const items = [
    {
      key: "1",
      label: "Token Money Request",
      children: (
        <TokenMoneyRequest />
      ),
    },
    {
      key: "2",
      label: "Inspection Request",
      children: <InspectionRequest />,
    },
  ];
  return (
    <ProfileLayout page_title="Requests">
      <CustomTabs items={items} className="my-add-tabs token-request-tab" />
    </ProfileLayout>
  );
};

export default Request;
