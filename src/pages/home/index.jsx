import React, { memo } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import Banner from "./banner";
import Vehicle from "./vehicle";
import { Pagination } from "swiper/modules";
import Event from "./event";
import Community from "./community";
import Inspection from "./inspection";

const Home = () => {
  return (
    <InnerLayout>
      <Banner />
      <Vehicle />
      <Event />
      <Community />
      <Inspection />
    </InnerLayout>
  );
};

export default Home;
