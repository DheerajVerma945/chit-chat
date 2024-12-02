import React, { useEffect, useState } from "react";
import { GroupSkeleton } from "../skeletons/Explore";
import { useUserStore } from "../../store/useUserStore";
import { Lock, UserPlus } from "lucide-react";
import { useGroupConfigStore } from "../../store/useGroupConfigStore";
import toast from "react-hot-toast";

const GroupExplore = () => {
  const { exploreGroups, fetchExploreGroups, sendGroupRequestUser } =
    useUserStore();

  const { joinGroup, isJoiningGroup } = useGroupConfigStore();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSending, setRequestSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchExploreGroups();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchExploreGroups]);

  const handleGroupRequest = async (id) => {
    setRequestSending(true);
    try {
      await sendGroupRequestUser(id);
    } catch (error) {
      toast.error(error?.response?.data?.messsage);
    } finally {
      setRequestSending(false);
    }
  };

  const handleJoinGroup = async (id) => {
    await joinGroup(id);
  };

  if (isLoading) return <GroupSkeleton />;

  if (!exploreGroups || exploreGroups.length === 0)
    return (
      <p className="h-screen justify-center items-center flex">
        No groups found
      </p>
    );

  return (
    <div className="py-8 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
        {exploreGroups.map((group) => (
          <div
            key={group._id}
            className="flex  flex-col items-center space-y-6 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div className="size-20 md:size-24 rounded-full overflow-hidden ">
              <img
                src={group.photo}
                alt={group.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center text-sm md:text-lg font-semibold">
              {group.name.length > 7
                ? group.name.slice(0, 7).trim() + "..."
                : group.name}
            </div>
            {group.visibility === "private" ? (
              <div className="text-center space-y-2">
                <Lock className="w-6 h-6 mx-auto" />
                <button
                  className={`${
                    requestSending
                      ? "btn btn-primary  loading bg-primary"
                      : "btn btn-primary flex items-center gap-2 text-xs md:text-md py-2 px-4 rounded-lg"
                  }`}
                  onClick={()=>handleGroupRequest(group._id)}
                >
                  Request
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <UserPlus className="w-6 h-6 mx-auto" />
                <button
                  className={`${
                    isJoiningGroup
                      ? "btn btn-primary  loading bg-primary"
                      : "btn btn-primary flex items-center gap-2 text-xs md:text-md py-2 px-4 rounded-lg"
                  }`}
                  onClick={()=>handleJoinGroup(group._id)}
                >
                  Join Group
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupExplore;
