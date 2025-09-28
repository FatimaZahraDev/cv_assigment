import React from "react";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const CustomDropdown = ({
  title,
  items,
  className,
  icon,
  overlayClassName,
}) => {
  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      className={className}
      overlayClassName={overlayClassName}
    >
      <span onClick={(e) => e.preventDefault()} style={{ cursor: "pointer" }}>
        <Space>
          <span>{title}</span>
          {icon && <DownOutlined />}
        </Space>
      </span>
    </Dropdown>
  );
};
export default CustomDropdown;
