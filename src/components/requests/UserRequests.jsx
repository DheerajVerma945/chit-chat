import React from "react";
import { useUserStore } from "../../store/useUserStore";

const UserRequests = () => {
  const { userRequests } = useUserStore();
  if (!userRequests || userRequests.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        No user requests at the moment
      </div>
    );

  return (
    <div className="w-full p-5">
      {userRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-md mb-4">
          <div className="flex items-center gap-4">
            <img
              src={request.senderId.profilePic}
              alt={request.senderId.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{request.senderId.fullName}</p>
              <p className="text-sm ">{request.senderId.email}</p>
            </div>
          </div>

          <div className="flex gap-4 ml-2">
            <button className="btn btn-success btn-sm">Accept</button>
            <button className="btn btn-error btn-sm">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserRequests;
