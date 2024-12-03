import React, { useEffect } from "react";
import { useGroupConfigStore } from "../../store/useGroupConfigStore";
import { useChatStore } from "../../store/useChatStore";
import { UserPlus2, Lock, X } from "lucide-react";

const AddMembers = () => {
  const { getMembersForAdding, connectionsForGroup, setShowAddUsers } = useGroupConfigStore();
  const { users } = useChatStore();

  useEffect(() => {
    getMembersForAdding(users);
  }, [users]);

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="relative bg-base-100 p-6 rounded-xl max-w-lg w-full shadow-lg">
        <button
          onClick={() => setShowAddUsers(false)}
          className="absolute top-2 right-2 text-gray-500"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-center text-lg font-bold mb-4">Add Connections</h2>
        <div className="space-y-4">
          {connectionsForGroup.length > 0 ? (
            connectionsForGroup.map((connection) => (
              <div
                key={connection._id}
                className="flex justify-between items-center p-4 border-b border-base-200"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={connection.profilePic}
                    alt={connection.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{connection.fullName}</span>
                </div>
                <div className="flex items-center gap-4">
                  {connection.privacy ? (
                    <button className="btn btn-secondary text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Invite
                    </button>
                  ) : (
                    <button className="btn btn-primary text-sm flex items-center gap-2">
                      <UserPlus2 className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm">No connections available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
