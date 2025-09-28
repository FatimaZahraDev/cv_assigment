import React from "react";
import { Button } from "antd";

const FlatButton = ({ title, icon, className, onClick, htmlType, loading ,disabled }) => {
  return (
    <Button
      onClick={onClick}
      icon={icon}
      className={className}
      htmlType={htmlType}
      loading={loading}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default FlatButton;
