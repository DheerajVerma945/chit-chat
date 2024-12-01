import React, { useEffect, useState } from "react";
import { GroupSkeleton } from "../skeletons/Explore";

const GroupExplore = () => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await exploreGroups();
      setGroups(res.data.data);
    };
    fetch();
  }, [exploreUsers]);
  return (
    <div>
      <GroupSkeleton />
    </div>
  );
};

export default GroupExplore;
