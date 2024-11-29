import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/group/findMyGroups");
      set({ groups: res.data.data });
    } catch (error) {
      set({ groups: [] });
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  setSelectedGroup: (group) => {
    set({ selectedgroup: group });
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/group/messages/getMessages/${groupId}`);
      set({ groupMessages: Array.isArray(res.data.data) ? res.data.data : [] });
    } catch (error) {
      set({ groupMessages: [] });
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (data) => {
    const { selectedGroup, groupMessages } = get();
    try {
      const res = await axiosInstance.post(
        `/group/messages/send/${selectedGroup._id}`,
        data
      );
      set({ groupMessages: [...groupMessages, res.data.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

}));
