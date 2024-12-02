import React from "react";
import { useUserStore } from "../../store/useUserStore";

const GroupRequests = () => {
  const { groupRequestsUser } = useUserStore();
  console.log(groupRequestsUser);
  if (!groupRequestsUser || groupRequestsUser.lenght === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        No group requests at the moment
      </div>
    );
  return <div>Group Requests here</div>;
};

export default GroupRequests;
