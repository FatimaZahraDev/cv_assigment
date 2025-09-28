// components/Loader.jsx
import { Spin } from "antd";
import React from "react";


const Loader = () => {
  return (
     <div className="loader-overlay">
      <Spin size="large" />
    </div>
  );
};

export default Loader;
