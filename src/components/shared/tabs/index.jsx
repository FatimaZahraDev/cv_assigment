import React from 'react';
import { Tabs } from 'antd';


const CustomTabs = ({items ,onChange ,className}) => {
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} className={className} />
  )
}

export default CustomTabs