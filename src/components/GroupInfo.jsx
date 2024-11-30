import React, { useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, MoreVertical } from "lucide-react";

const GroupInfo = () => {
  const { selectedGroup: group, updateGroupInfo, addMemberToGroup } = useGroupChatStore();
  const { authUser } = useAuthStore();
  const { users } = useChatStore();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group.name);
  const [newGroupImage, setNewGroupImage] = useState(null);
  const [visibility, setVisibility] = useState(group.visibility);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Handle image compression and setNewGroupImage
  };

  const handleAddMember = (user) => {
    // Handle adding member logic
  };

  const handleRemoveMember = (userId) => {
    // Handle removing member logic
  };

  const handleGroupInfoUpdate = () => {
    setIsLoading(true);
    // Handle group info update logic
    setIsLoading(false);
  };

  const handleVisibilityToggle = () => {
    setVisibility(visibility === "private" ? "public" : "private");
  };

  return (
    <div className="h-full justify-center items-center flex flex-col p-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <img src={group.photo} alt="Group" className="rounded-full object-cover w-32 h-32" />
      </div>

      {authUser.data._id === group.admin && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {}} // Trigger add member modal
              className="btn btn-primary"
            >
              Add Member
            </button>
            <button
              onClick={() => setIsUpdating(true)}
              className="btn btn-secondary"
            >
              Update Group Info
            </button>
          </div>

          {isUpdating && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <label htmlFor="group-image-upload" className="cursor-pointer">Change Group Image</label>
                <input
                  type="file"
                  id="group-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Group Name"
              />
              <div>
                <label className="label cursor-pointer">
                  <span className="label-text">Visibility</span>
                  <input
                    type="checkbox"
                    checked={visibility === "private"}
                    onChange={handleVisibilityToggle}
                    className="toggle"
                  />
                  <span className="label-text">{visibility === "private" ? "Private" : "Public"}</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleGroupInfoUpdate}
                  className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsUpdating(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium">Members</h2>
        <div className="space-y-4">
          {group.members.map((member) => (
            <div key={member._id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={member.profilePic} alt={member.fullName} className="w-8 h-8 rounded-full" />
                <span>{member.fullName}</span>
              </div>
              {authUser.data._id === group.admin && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="btn btn-ghost"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
