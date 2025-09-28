import React from "react";

const MessageInput = () => {
  return (
    <div className="message-input">
      <button className="plus-btn">+</button>
      <input type="text" placeholder="Type a message..." />
      <button className="send-btn">➤</button>
    </div>
  );
};

export default MessageInput;
