import React, { useState } from "react";
import { Inbox, User, Users } from "lucide-react";
import {  GroupExplore, UserExplore } from "../components";
import {ChatPage} from "./index"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [currentContainer, setCurrentContainer] = useState("inbox");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <div >
        {currentContainer === "users" && <UserExplore />}
        {currentContainer === "groups" && <GroupExplore />}
        {currentContainer==="inbox" && <ChatPage/>}
      </div>
      <div className="fixed bottom-1 inset-x-10 h-10 border-t rounded-t mt-6  bg-base-100 shadow-lg flex">
        <button
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition duration-300 hover:bg-base-200 ${currentContainer === "inbox" ? "bg-primary-content" : ""
          }`}
          
          onClick={() => setCurrentContainer("inbox")}
        >
          <Inbox size={20} />
          <span className="text-xs lg:text-sm">Inbox</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition duration-300 hover:bg-base-200 ${
            currentContainer === "users" ? "bg-primary-content" : ""
          }`}
          onClick={() => setCurrentContainer("users")}
        >
          <User size={20} />
          <span className="text-xs lg:text-sm">Explore People</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition duration-300 hover:bg-base-200 ${
            currentContainer === "groups" ? "bg-primary-content" : ""
          }`}
          onClick={() => setCurrentContainer("groups")}
        >
          <Users size={20} />
          <span className="text-xs lg:text-sm">Explore Groups</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
