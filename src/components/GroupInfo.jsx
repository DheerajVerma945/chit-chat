import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, MoreVertical, Settings, UserPlus2 } from "lucide-react";
import { useGroupConfigStore } from "../store/useGroupConfigStore";

const GroupInfo = () => {
  const {
    groupData,
    addMember,
    removeMember,
    updateGroup,
    setGroupData,
    joinGroup,
    exitGroup,
  } = useGroupConfigStore();
  const group = groupData[0];

  useEffect(() => {
    setGroupData(groupData);
  }, [groupData, setGroupData]);

  const { authUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    newName: group.name,
    newPhoto: group.photo,
    description: group.description,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState(group.visibility);
  const [imageUploading, setImageUploading] = useState(false);

  const validateSave = (newName !== group.name) || newPhoto || (description !== group.description)

  const handleImageUpload = async (e) => {
    setImageUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, newPhoto: file });
    setTimeout(() => {
      setImageUploading(false);
    }, 2000);
  };

  const handleGroupInfoUpdate = async () => {
    setIsLoading(true);
    await updateGroup({
      name: formData.newName,
      photo: formData.newPhoto,
      description: formData.description,
      visibility,
    });
    setIsLoading(false);
  };

  const handleVisibilityToggle = () => {
    setVisibility(visibility === "private" ? "public" : "private");
  };

  const handleAddMember = async (userId) => {
    await addMember(userId);
  };

  const handleRemoveMember = async (userId) => {
    await removeMember(userId);
  };

  const handleExitGroup = async () => {
    await exitGroup();
  };

  const handleJoinGroup = async (groupId) => {
    await joinGroup(groupId);
  };

  return (
    <div className="min-h-screen bg-base-100 relative">
      {imageUploading && (
        <div className="absolute inset-0 bg-opacity-80 bg-black flex h-screen items-center justify-center">
          <div className="loading bg-primary w-12 h-12 rounded-full"></div>
        </div>
      )}
      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Group information and settings
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img
                src={formData.newPhoto}
                alt="Group"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="group-image-upload"
                className="absolute bottom-2 right-2 bg-base-content hover:scale-110 p-2 rounded-full cursor-pointer transition-transform duration-300"
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
              {imageUploading
                ? "Uploading..."
                : "Click the camera icon to update group photo"}
            </p>
          </div>

          {authUser.data._id === group.admin && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4 items-center">
                <button
                  onClick={() => {}}
                  className="btn btn-primary flex items-center gap-2 text-sm py-2 px-4 rounded-lg"
                >
                  <UserPlus2 />
                  <span className="hidden lg:block">Add member</span>
                </button>
                <button
                  onClick={() => setIsUpdating(!isUpdating)}
                  className="btn btn-primary flex items-center gap-2 text-sm py-2 px-4 rounded-lg"
                >
                  <Settings />
                  <span className="hidden lg:block">Settings</span>
                </button>
              </div>

              {isUpdating && (
                <div className="form-control space-y-4 mt-6">
                  <input
                    type="text"
                    value={formData.newName}
                    onChange={(e) =>
                      setFormData({ ...formData, newName: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Group Name"
                  />
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Group Description"
                  />
                  <div className="flex flex-row items-center bg-base-100 btn no-animation justify-between mt-4">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs sm:text-lg">Visibility</span>
                      <p className="text-xs hidden lg:block">
                        (In private groups, only the admin can send and accept
                        requests to users.)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm">
                        {visibility === "private" ? "Private" : "Public"}
                      </span>
                      <input
                        type="checkbox"
                        checked={visibility === "private"}
                        onChange={handleVisibilityToggle}
                        className="toggle xs:toggle-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 sm:mt-4 mt-8">
                    <button
                      onClick={() => setIsUpdating(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGroupInfoUpdate}
                      disabled={!validateSave}
                      className={`btn btn-primary ${
                        isLoading ? "loading bg-primary" : ""
                      }`}
                    >
                      {!isLoading && <span>Save</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {group.visibility === "public" && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4 items-center">
                <button
                  onClick={() => {}}
                  className="btn btn-primary flex items-center gap-2 text-sm py-2 px-4 rounded-lg"
                >
                  <UserPlus2 />
                  <span className="hidden lg:block">Add member</span>
                </button>
              </div>
            </div>
          )}

          <div className="border-t-2 border-base-100">
            <h2 className="text-lg font-medium mb-4 mt-8">
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
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {member.fullName}
                    </span>
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
