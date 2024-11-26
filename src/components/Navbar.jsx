import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import Logo from "../../public/Logo.png"
import { LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  return (
    <>
      <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img className="size-10 object-cover rounded-full text-primary" src={Logo}/>
                </div>
                <h1 className="text-lg font-bold">BaatCheet</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="btn btn-sm gap-2 transition-colors"
              >
                <Settings className="size-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to="/profile" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() => setShowLogoutMsg(true)}
                  >
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {showLogoutMsg && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center h-screen z-50">
    <div className="bg-base-100 border border-base-300 rounded-lg shadow-lg w-4/5 sm:w-1/3 p-6 flex flex-col items-center gap-6">
      <h2 className="text-lg font-semibold  text-center">
        Are you sure you want to logout?
      </h2>
      <div className="flex w-full justify-between gap-4">
        <button
          onClick={()=>{
            logout();
            setShowLogoutMsg(false);
          }}
          className="btn btn-sm bg-red-500 text-white flex-1 hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={() => setShowLogoutMsg(false)}
          className="btn btn-sm bg-gray-200 text-gray-800 flex-1 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Navbar;
