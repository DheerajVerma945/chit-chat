import React, { useEffect, useState } from "react";
import { UserSkeleton } from "../skeletons/Explore";
import { useUserStore } from "../../store/useUserStore";
import toast from "react-hot-toast";

const UserExplore = () => {
  const { exploreUsers, fetchExploreUsers, sendUserRequest } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSending, setRequestSending] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchExploreUsers();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchExploreUsers]);

  useEffect(() => {
    setUsers(exploreUsers);
  }, [exploreUsers]);

  const handleConnectionRequest = async (id) => {
    setRequestSending(id);
    try {
      await sendUserRequest(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setRequestSending(null);
    }
  };

  if (isLoading) return <UserSkeleton />;

  if (!users || users.length === 0)
    return (
      <p className="h-screen flex justify-center items-center text-lg font-medium">
        No users found
      </p>
    );

  return (
    <div className="mt-16 py-8 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-col items-center space-y-4 shadow-lg hover:shadow-xl p-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center text-sm md:text-lg font-semibold">
              {user.fullName.length > 7
                ? user.fullName.slice(0, 7).trim() + "..."
                : user.fullName}
            </div>
            <div className="text-center space-y-2">
              <button
                className={`btn btn-primary ${
                  requestSending === user._id
                    ? "loading bg-primary"
                    : ""
                }`}
                onClick={() => handleConnectionRequest(user._id)}
              >
                {requestSending === user._id ? "Requesting..." : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserExplore;
