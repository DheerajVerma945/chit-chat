import React, { useEffect, useState } from "react";
import { UserSkeleton } from "../skeletons/Explore";

const UserExplore = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await exploreUsers();
      setUsers(res.data.data);
    };
    fetch();
  }, [exploreUsers]);
  return (
    <div className="mt-20">
      <UserSkeleton />
    </div>
  );
};

export default UserExplore;
