import React from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import ChatHeader from "./chatheader";
import ChatMessages from "./chatmessages";
import MessageInput from "./messageinput";
import ChatList from "./chatlist";
import FlatButton from "@/components/shared/button/flatbutton";

const ChatScreen = () => {


    return (
        <InnerLayout headerClass="sub-header">
            <section className="chat-sec">
                <div className="container">
                    <div className="inbox-container">
                        <div className="chat-sidebar">
                            <div className="inbox-title">Inbox</div>
                           
                            <div className="quick-filter">
                                 <h3 className="color-white font-18 mb-1">Quick Filter</h3>
                                 <div className="quick-filter-btn">
                                    <FlatButton title="All" className="filter-btn active" />
                                    <FlatButton title="Unread Chats" className="filter-btn" />
                                     
                                 </div>
                              
                            </div>
                            <ChatList />
                        </div>
                        <div className="chat-main">
                            <ChatHeader />
                            <div className="chat-msg-input">
                                  <ChatMessages />
                            <MessageInput />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </InnerLayout>
    );
};

export default ChatScreen;
