import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageInput, MessageSkeleton, ChatHeader } from "../components";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import GroupInfo from "./GroupInfo.jsx";
import { Check } from "lucide-react";

const ChatContainer = () => {
  const { authUser } = useAuthStore();

  const messagEndRef = useRef(null);
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  const [lastMessage, setlastMessage] = useState(null);

  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
    showInfo,
    allGroupMessages,
  } = useGroupChatStore();
  console.log("New Presentgroupmessages", groupMessages);
  console.log("New all group messages ", allGroupMessages);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
    if (selectedGroup) getGroupMessages(selectedGroup._id);

    return () => {};
  }, [selectedUser?._id, selectedGroup?._id, getMessages, getGroupMessages]);

  useEffect(() => {
    if (messagEndRef.current && (messages || groupMessages)) {
      messagEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages, groupMessages]);

  if (isMessagesLoading || isGroupMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto  scrollbar-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 ml-2 flex flex-col overflow-auto  scrollbar-hidden">
      <ChatHeader />
      {!showInfo && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages &&
            messages.length > 0 &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser.data._id
                    ? "chat-end"
                    : "chat-start"
                }`}
                ref={messagEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser.data._id
                          ? authUser.data.profilePic
                          : selectedUser.profilePic
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div
                  className={`${
                    message.senderId === authUser.data._id
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content"
                  } chat-bubble relative flex flex-col text-base sm:text-sm`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] max-w-[150px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}

                  {message.senderId === authUser.data._id && (
                    <div className="absolute -bottom-1 -right-1 flex flex-col items-center text-secondary-content">
                      {message.isRead ? (
                        <>
                          <Check className="text-xs scale-50 sm:scale-75 -mb-3" />
                          <Check className="text-xs scale-50 sm:scale-75 -mt-2" />
                        </>
                      ) : (
                        <Check className="text-xs scale-50 sm:scale-75" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          {groupMessages &&
            groupMessages.length > 0 &&
            groupMessages.map((message) => {
              if (lastMessage && lastMessage._id === message._id) {
                return null;
              }

              setlastMessage(message);

              return (
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId._id === authUser.data._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                  ref={messagEndRef}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId._id === authUser.data._id
                            ? authUser.data.profilePic
                            : message.senderId.profilePic
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div className="chat-header mb-1 mr-3">
                    <time className="text-xs opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  <div
                    className={`${
                      message.senderId._id === authUser.data._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content"
                    } chat-bubble flex flex-col relative text-base sm:text-sm`}
                  >
                    {message.senderId._id !== authUser.data._id && (
                      <p className="absolute top-[-1.5rem] left-10 text-sm">
                        ~{message.senderId.fullName.split(" ")[0]}
                      </p>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {showInfo && <GroupInfo />}
      {!showInfo && <MessageInput />}
    </div>
  );
};
export default ChatContainer;
