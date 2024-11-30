import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useGroupChatStore } from "./useGroupChatStore";

export const useGroupConfigStore = create((set) => ({
  groupData: [],
  isAddingMember: false,
  isUpdatingGroup: false,
  isRemovingMember: false,
  isExitingGroup: false,
  isDeletingGroup: false,
  isJoiningGroup: false,
  isCreatingGroup: false,

  addMember: async (userId) => {
    const { selectedGroup } = useGroupChatStore.getState();
    set({ isAddingMember: true });
    try {
      const res = await axiosInstance.post("/group/addMember", {
        userId,
        groupId: selectedGroup._id,
      });
      set({ groupData: res.data.data });
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
    const { selectedGroup } = useGroupChatStore.getState();
    set({ isRemovingMember: true });
    try {
      const res = await axiosInstance.post("/group/removeMember", {
        userId,
        groupId: selectedGroup._id,
      });
      set({ groupData: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isRemovingMember: false });
    }
  },

  updateGroup: async (data) => {
    set({ isUpdatingGroup: true });
    try {
      const res = await axiosInstance.patch("/group/updateGroup", data);
      set({ groupData: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingGroup: false });
    }
  },

  deleteGroup: async () => {
    const { selectedGroup, setSelectedGroup } = useGroupChatStore.getState();
    set({ isDeletingGroup: true });
    try {
      await axiosInstance.delete("/group/deleteGroup", {
        data: { groupId: selectedGroup._id },
      });
      setSelectedGroup(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isDeletingGroup: false });
    }
  },

  exitGroup: async () => {
    const { selectedGroup, setSelectedGroup, setGroups } =
      useGroupChatStore.getState();
    set({ isExitingGroup: true });
    try {
      const res = await axiosInstance.post("/group/exitGroup", {
        groupId: selectedGroup._id,
      });
      setSelectedGroup(null);
      setGroups(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isExitingGroup: false });
    }
  },

  joinGroup: async (groupId) => {
    const { setGroups, groups } = useGroupChatStore.getState();
    set({ isJoiningGroup: true });
    try {
      const res = await axiosInstance.post("/group/joinGroup", { groupId });
      setGroups(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isJoiningGroup: false });
    }
  },

  createGroup: async (name) => {
    const { setSelectedGroup, setGroups, groups } =
      useGroupChatStore.getState();
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/group/create", { name });
      setSelectedGroup(res.data.data);
      setGroups([...groups, res.data.data]);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isCreatingGroup: false });
    }
  },
}));
