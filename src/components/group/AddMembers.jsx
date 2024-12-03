import React from "react";
import { useGroupConfigStore } from "../../store/useGroupConfigStore";

const AddMembers = () => {
  const { connectionsForGroup } = useGroupConfigStore();
  return (
    <div className="flex items-center justify-center h-full">
      {connectionsForGroup.length > 0 &&
        connectionsForGroup.map((connection) => (
          <div>{connection.fullName}</div>
        ))}
    </div>
  );
};

export default AddMembers;
