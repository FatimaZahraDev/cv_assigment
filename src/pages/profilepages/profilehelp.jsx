import React from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import { Collapse } from "antd";
import BaseInput from "@/components/shared/inputs";
const text = `
 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever...
`;
const items = [
  {
    key: "1",
    label:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever...",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever...",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever...",
    children: <p>{text}</p>,
  },
];
const ProfileHelp = () => {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <ProfileLayout page_title="Help">
      <div className="row">
        <div className="col-12 col-md-8 col-xl-7">
          <Collapse
            items={items}
            defaultActiveKey={["1"]}
            expandIconPosition="end"
            onChange={onChange}
            className="help-collapse"
            expandIcon={({ isActive }) =>
              isActive ? (
                <img src="/assets/img/arrow-down.png" />
              ) : (
                <img src="/assets/img/arrow-down.png" />
              )
            }
          />
        </div>
        <div className="col-12 col-md-4 col-xl-5">
            <div className="support-chat-box">
                <h1 className="color-white font-20">Our Support Desk</h1>
                <p className="color-white-500">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <div className="support-chat-msg">
                     <div className="support-msg mt-3">
                    <div className="w-80">
                        <h2 className="font-14 color-white">Support</h2>
                        <p className="font-12">Lorem Ipsum is simply dummy text of the printing</p>
                    </div>
                    <div>
                        <p className="color-white-500 font-12">2:42 pm</p>
                    </div>
                </div>
                </div>
                <div className="support-input">
                    <BaseInput placeholder="Enter your concern here" suffix={<div className="support-send-icon"><img src="/assets/img/help-send.png" alt="" /> </div>} />
                </div>
            </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfileHelp;
