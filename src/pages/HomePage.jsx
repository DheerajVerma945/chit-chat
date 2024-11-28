import React, { useState } from "react";
import { Inbox, User, Users } from "lucide-react";
import { GroupExplore, UserExplore } from "../components";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [currentContainer, setCurrentContainer] = useState("users");
  const navigate = useNavigate();
  return (
    <div className="flex h-auto xl:h-screen font-bold mt-16">
      <div className="flex flex-col justify-between h-full">
        <div className="fixed inset-0 w-20 lg:w-40 h-full bg-base-100 shadow-lg flex flex-col">
          <div className="h-1/2 mt-16 flex flex-col">
            <button
              className={`flex h-1/2 items-center gap-2 p-4 w-full transition duration-300 hover:bg-base-200 rounded-md ${
                currentContainer === "users" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setCurrentContainer("users")}
            >
              <User size={20} />
              <span className="hidden lg:inline">Explore People</span>
            </button>
            <button
              className={`flex h-1/2 items-center gap-2 p-4 w-full transition duration-300 hover:bg-base-200 rounded-md ${
                currentContainer === "groups" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setCurrentContainer("groups")}
            >
              <Users size={20} />
              <span className="hidden lg:inline">Explore Groups</span>
            </button>
          </div>
          <div className="h-1/2 flex items-center">
            <button
              className="flex gap-8 w-full p-4 h-full items-center  transition duration-300 hover:bg-base-200 rounded-md"
              onClick={() => navigate("/chat")}
            >
              <Inbox size={20} />
              <span className="hidden lg:inline">Inbox</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center ml-20 lg:ml-40">
        {currentContainer === "users" && <UserExplore />}
        {currentContainer === "groups" && <GroupExplore />}
      </div>
    </div>
  );
};

export default HomePage;
