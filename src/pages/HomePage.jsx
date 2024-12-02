import React, { useState } from "react";
import { Inbox, User, Users } from "lucide-react";
import { GroupExplore, UserExplore } from "../components";
import { ChatPage } from "./index";
import { useGroupChatStore } from "../store/useGroupChatStore";

const HomePage = () => {
  const [currentContainer, setCurrentContainer] = useState("inbox");
  const { setSelectedGroup } = useGroupChatStore();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {currentContainer === "users" && <UserExplore />}
        {currentContainer === "groups" && <GroupExplore />}
        {currentContainer === "inbox" && <ChatPage />}
      </div>
      <div className="fixed bottom-1 inset-x-10 h-12  border-t rounded-t-md bg-base-100 shadow-lg flex ">
        <button
          className={`flex-1 flex flex-col rounded-md items-center justify-center gap-1   transition duration-300 hover:bg-base-200 ${
            currentContainer === "inbox"
              ? "bg-primary-content text-primary"
              : ""
          }`}
          onClick={() => {
            setCurrentContainer("inbox");
            setSelectedGroup(null);
          }}
        >
          <Inbox size={20} />
          <span className="text-xs lg:text-sm">Inbox</span>
        </button>
        <button
          className={`flex-1 flex flex-col rounded-md items-center justify-center gap-1 transition duration-300 hover:bg-base-200 ${
            currentContainer === "users"
              ? "bg-primary-content text-primary"
              : ""
          }`}
          onClick={() => {
            setCurrentContainer("users");
            setSelectedGroup(null);
          }}
        >
          <User size={20} />
          <span className="text-xs lg:text-sm">Explore People</span>
        </button>
        <button
          className={`flex-1 flex flex-col rounded-md items-center justify-center gap-1  transition duration-300 hover:bg-base-200 ${
            currentContainer === "groups"
              ? "bg-primary-content text-primary"
              : ""
          }`}
          onClick={() => {
            setCurrentContainer("groups");
            setSelectedGroup(null);
          }}
        >
          <Users size={20} />
          <span className="text-xs lg:text-sm">Explore Groups</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
