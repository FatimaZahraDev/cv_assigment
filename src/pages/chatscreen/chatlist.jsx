import React from "react";

const ChatList = () => {
  return (
    <div className="chat-list">
      {Array(8).fill().map((_, i) => (
        <div className="chat-item" key={i}>
          <img src="/assets/img/akera-img.png" alt="" className="chat-avatar" />
          <div className="chat-info">
            <h4 className="font-500">Harry Lington</h4>
            <p>Ford Mustang GT</p>
          </div>
          <span className="chat-date">25 May, 2025</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
