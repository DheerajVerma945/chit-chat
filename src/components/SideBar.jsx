import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../components/skeletons/SideBarSkeleton";
import { User, Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showContacts, setShowContacts] = useState(true);
  const [showGroups, setShowGroups] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  const sortedUsers = [...users].sort((a, b) => {
    const isAOnline = onlineUsers.includes(a._id);
    const isBOnline = onlineUsers.includes(b._id);
    if (isAOnline === isBOnline) return 0;
    return isAOnline ? -1 : 1;
  });

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <aside className="h-full w-28 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between  gap-2 md:gap-4">
          <button className={`flex items-center gap-2 p-2 rounded-md ${showContacts? "btn" :""}`} onClick={()=>{
            setShowContacts(true);
            setShowGroups(false);
          }}>
            <User className="size-6" />
            <span className="font-medium hidden pb- lg:block">Contacts</span>
          </button>
          <button className={`flex items-center gap-2 p-2 rounded-md ${showGroups? "btn" :""}`} onClick={()=>{
            setShowContacts(false);
            setSelectedUser(null);
            setShowGroups(true);
          }}>
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Groups</span>
          </button>
        </div>
      </div>

      {showContacts && (
        <>
          <div className="mt-3 ml-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1}) online
            </span>
          </div>
          {!showOnlineOnly && (
            <div className="overflow-y-auto w-full py-3">
              {sortedUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                      />
                    )}
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showOnlineOnly && (
            <div className="overflow-y-auto w-full py-3">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                      />
                    )}
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center text-zinc-500 py-4">
                  No online users
                </div>
              )}
            </div>
          )}
        </>
      )}
      {showGroups && <p>Groups here</p>}
    </aside>
  );
};

export default Sidebar;
