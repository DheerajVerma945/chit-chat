import React from "react";
import { useUserStore } from "../../store/useUserStore";

const UserRequests = () => {
  const { userRequests } = useUserStore();
  console.log(userRequests);
  if (!userRequests || userRequests.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        No group requests at the moment
      </div>
    );
  return <div>User requests here</div>;
};

export default UserRequests;
