import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useGroupChatStore } from "./useGroupChatStore";

export const useGroupConfigStore = create((set, get) => {
  const { selectedGroup } = useGroupChatStore.getState();
  return {
    groupData: [selectedGroup],
    isAddingMember: false,
    isUpdatingGroup: false,
    isRemovingMember: false,
    isExitingGroup: false,
    isDeletingGroup: false,
    isCreatingGroup: false,
    connectionsForGroup: [],
    showAddUsers: false,

    setConnectionsForGroup: (data) => {
      set({ connectionsForGroup: data });
    },

    setShowAddUsers: (data) => {
      set({ showAddUsers: data });
    },

    addMember: async (userId) => {
      const { groupData, connectionsForGroup } = get();
      set({ isAddingMember: true });
      try {
        const res = await axiosInstance.post("/group/addMember", {
          userId,
          groupId: groupData[0]._id,
        });
        set({ groupData: [res.data.data] });
        const newList = connectionsForGroup.filter(
          (connection) => connection._id !== userId
        );
        set({ connectionsForGroup: newList });

        toast.success("Member added successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isAddingMember: false });
      }
    },

    setGroupData: (data) => {
      set({ groupData: data });
    },

    removeMember: async (userId) => {
      const { groupData } = get();
      set({ isRemovingMember: true });
      try {
        const res = await axiosInstance.post("/group/removeMember", {
          userId,
          groupId: groupData[0]._id,
        });
        set({ groupData: [res.data.data] });
        toast.success("Member removed successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isRemovingMember: false });
      }
    },

    updateGroup: async (data) => {
      const { groupData } = get();
      set({ isUpdatingGroup: true });
      try {
        const res = await axiosInstance.patch(
          `/group/updateGroup/${groupData[0]._id}`,
          data
        );
        set({ groupData: [res.data.data] });
        toast.success("Group updated successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isUpdatingGroup: false });
      }
    },

    deleteGroup: async () => {
      const { groupData } = get();
      const { setSelectedGroup, setGroups, groups } =
        useGroupChatStore.getState();
      set({ isDeletingGroup: true });
      const deletedGroup = groupData[0];
      try {
        await axiosInstance.delete("/group/deleteGroup", {
          data: { groupId: groupData[0]._id },
        });
        const newGroups = groups.filter(
          (group) => group._id !== deletedGroup._id
        );
        setGroups(newGroups);
        setSelectedGroup(null);
        set({ groupData: [] });
        toast.success("Group deleted successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isDeletingGroup: false });
      }
    },

    exitGroup: async () => {
      const { groupData } = get();
      const { setSelectedGroup, setGroups, groups } =
        useGroupChatStore.getState();
      set({ isExitingGroup: true });
      try {
        const res = await axiosInstance.post("/group/exitGroup", {
          groupId: groupData[0]._id,
        });
        setSelectedGroup(null);
        set({ groupData: [] });
        setGroups(res.data.data);
        toast.success("Exited from group successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isExitingGroup: false });
      }
    },

    joinGroup: async (groupId) => {
      const { setGroups, groups } = useGroupChatStore.getState();
      try {
        const res = await axiosInstance.post("/group/joinGroup", { groupId });
        setGroups([...groups, res.data.data]);
        toast.success("Joined group successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },

    createGroup: async (name) => {
      const { setSelectedGroup, setGroups, groups } =
        useGroupChatStore.getState();
      const { groupData } = get();
      set({ isCreatingGroup: true });
      try {
        const res = await axiosInstance.post("/group/create", { name });
        setSelectedGroup(res.data.data);
        set({ groupData: [res.data.data] });
        setGroups([...groups, res.data.data]);
        toast.success("Group created successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isCreatingGroup: false });
      }
    },

    updateGroupDp: async (newPhoto) => {
      const { groupData } = get();
      try {
        const res = await axiosInstance.put(
          `/group/updateGroupPhoto/${groupData[0]._id}`,
          { newPhoto }
        );
        set({ groupData: [res.data.data] });
        toast.success("Group updated successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        set({ isUpdatingGroup: false });
      }
    },

    getMembersForAdding: async (connections) => {
      const { groupData } = get();
      try {
        const groupId = groupData[0]._id;
        const res = await axiosInstance.get(
          `/group/connectionForGroup/${groupId}`,
          {
            params: {
              connections: JSON.stringify(connections),
            },
          }
        );
        set({ connectionsForGroup: res.data.data });
      } catch (error) {
        set({ connectionsForGroup: [] });
      }
    },
  };
});
