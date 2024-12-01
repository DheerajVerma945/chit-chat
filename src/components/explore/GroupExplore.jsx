import React, { useEffect, useState } from "react";
import { GroupSkeleton } from "../skeletons/Explore";
import { useGroupConfigStore } from "../../store/useGroupConfigStore";

const GroupExplore = () => {
  const {exploreGroups} = useGroupConfigStore();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await exploreGroups();
      setGroups(res.data.data);
    };
    fetch();
  }, [exploreGroups]);
  return (
    <div>
      <GroupSkeleton />
    </div>
  );
};

export default GroupExplore;
