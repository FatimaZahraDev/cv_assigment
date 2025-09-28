import React from "react";
import { Layout, theme } from "antd";
import { useLocation } from "react-router";
const { Content } = Layout;
import InnerHeader from "./innerheader";
import InnerFooter from "./innerfooter";
import ScrollToTop from "@/components/shared/Scrolltotop";

const InnerLayout = ({ children, headerClass }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Layout>
        <ScrollToTop />
        <InnerHeader headerClass={headerClass} />
        <Content>{children}</Content>
        <InnerFooter />
      </Layout>
    </Layout>
  );
};

export default InnerLayout;
