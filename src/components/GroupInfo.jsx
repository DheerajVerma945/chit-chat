import React, { useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, MoreVertical } from "lucide-react";

const GroupInfo = () => {
  const { selectedGroup: group } = useGroupChatStore();
  const { authUser } = useAuthStore();
  const { users } = useChatStore();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState({
    newName: group.name,
    newPhoto: group.photo,
    description: group.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState(group.visibility);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData({ ...data, newPhoto: file });
  };

  const handleGroupInfoUpdate = () => {
    setIsLoading(true);
    // Update logic
    setIsLoading(false);
  };

  const handleVisibilityToggle = () => {
    setVisibility(visibility === "private" ? "public" : "private");
  };

  return (
    <div className="h-auto pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">{group.name}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Group information and settings
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img
                src={data.newPhoto}
                alt="Group"
                className="w-32 h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="group-image-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="group-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-center">
              {isLoading
                ? "Uploading..."
                : "Click the camera icon to update group photo"}
            </p>
          </div>

          {authUser.data._id === group.admin && (
            <div className="space-y-6">
              <div className="flex justify-center gap-10 items-center">
                <button
                  onClick={() => {}}
                  className="btn btn-primary text-sm py-2 px-4 rounded-lg"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setIsUpdating(true)}
                  className="btn btn-primary text-sm py-2 px-4 rounded-lg"
                >
                  Update Group Info
                </button>
              </div>

              {isUpdating && (
                <div className="space-y-4 mt-6">
                  <input
                    type="text"
                    value={data.newName}
                    onChange={(e) =>
                      setData({ ...data, newName: e.target.value })
                    }
                    className="input input-bordered w-full mt-2"
                    placeholder="Group Name"
                  />
                  <div className="mt-4">
                    <label className="label flex items-center justify-between cursor-pointer text-sm font-medium">
                      <span className="label-text">Visibility</span>
                      <div className="flex items-center justify-center gap-5">
                        <span className="label-text">
                          {visibility === "private" ? "Private" : "Public"}
                        </span>
                        <input
                          type="checkbox"
                          checked={visibility === "private"}
                          onChange={handleVisibilityToggle}
                          className="toggle"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleGroupInfoUpdate}
                      className={`btn btn-primary ${
                        isLoading ? "loading" : ""
                      }`}
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

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">
              Members ({group.members.length})
            </h2>
            <div className="space-y-4">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={member.profilePic}
                      alt={member.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{member.fullName}</span>
                  </div>
                  {authUser.data._id === group.admin && (
                    <button onClick={() => {}} className="btn btn-ghost p-2">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
