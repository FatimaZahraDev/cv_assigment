import React from "react";
import { Collapse } from "antd";

const CusstomCollapse = ({items ,className}) => (
  <Collapse
    items={items}
    className={className}
    bordered={false}
    defaultActiveKey={["1"]}
     expandIconPosition="end"
    expandIcon={({ isActive }) =>
      isActive ? <img src="/assets/img/arrow-down.png" /> : <img src="/assets/img/arrow-down.png" />
    }
  />
);
export default CusstomCollapse;
