import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const {selectedGroup,setSelectedGroup} = useGroupChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser && <img src={selectedUser.profilePic} alt={selectedUser.fullName} />}
              {selectedGroup && <img src={selectedGroup.photo} alt={selectedGroup.name} />}
            </div>
          </div>

          <div>
            { selectedUser && <h3 className="font-medium">{selectedUser.fullName}</h3>}
            { selectedGroup && <h3 className="font-medium">{selectedGroup.name}</h3>}
            {selectedUser && <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>}
          </div>
        </div>

        {selectedUser && <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>}
        {selectedGroup && <button onClick={() => setSelectedGroup(null)}>
          <X />
        </button>}
      </div>
    </div>
  );
};
export default ChatHeader;