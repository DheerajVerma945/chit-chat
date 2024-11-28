import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageInput, MessageSkeleton, ChatHeader } from "../components";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useGroupChatStore } from "../store/useGroupChatStore";

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const messagEndRef = useRef(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unSubscribeToMessages,
  } = useChatStore();

  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
  } = useGroupChatStore();

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
    if (selectedGroup) getGroupMessages(selectedGroup._id);

    if (selectedUser) subscribeToMessages();

    if (selectedUser) return () => unSubscribeToMessages();
  }, [
    selectedUser?._id,
    selectedGroup._id,
    getMessages,
    subscribeToMessages,
    unSubscribeToMessages,
  ]);

  useEffect(() => {
    if (messagEndRef.current && messages) {
      messagEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading || isGroupMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
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
                } chat-bubble flex flex-col`}
              >
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
          ))}
        {groupMessages &&
          groupMessages.length > 0 &&
          groupMessages.map((message) => (
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
                        : senderId.photo
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
                } chat-bubble flex flex-col`}
              >
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
          ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer
