import React from "react";

const messages = [
  {
    id: 1,
    sender: "user",
    name: "Amanda Lourence",
    text: "Lorem Ipsum is simply dummy text of the printing",
    time: "2:42 pm",
    date: "15 May, 2025",
  },
  {
    id: 2,
    sender: "me",
    name: "You",
    text: "Lorem Ipsum is simply dummy text of the printing",
    time: "2:42 pm",
    date: "15 May, 2025",
  },
  {
    id: 3,
    sender: "user",
    name: "Amanda Lourence",
    text: "Another message from user",
    time: "2:45 pm",
    date: "15 May, 2025",
  },
  {
    id: 4,
    sender: "me",
    name: "You",
    text: "Another reply from me",
    time: "2:46 pm",
    date: "15 May, 2025",
  },
];

const ChatMessages = () => {
  return (
    <div className="chat-messages">
      <div className="row">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {(index === 0 || messages[index - 1].date !== msg.date) && (
              <div className="col-12 text-center">
                <div className="message-date">{msg.date}</div>
              </div>
            )}

            <div
              className={
                msg.sender === "me"
                  ? "col-12 col-md-6 offset-md-6"
                  : "col-12 col-md-6"
              }
            >
              <div className={`message ${msg.sender === "me" ? "right" : "left red"}`}>
                <div className="bubble">
                  <div className="user">
                    <p>{msg.name}</p>
                  </div>
                  {msg.text}
                </div>
                <div className="time">{msg.time}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
