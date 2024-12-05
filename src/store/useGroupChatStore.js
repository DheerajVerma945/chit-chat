import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import IncomingSound from "../assets/Incoming.mp3";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  showInfo: false,

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
  setGroupMessages: (data) => {
    set({ groupMessages: data });
  },

  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
  },

  setShowInfo: (data) => {
    set({ showInfo: data });
  },

  setGroups: (data) => {
    set({ groups: data });
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(
        `/group/messages/getMessages/${groupId}`
      );
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

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (newGroupMessage) => {
      if (newGroupMessage.groupId !== selectedGroup._id) return;

      set({
        groupMessages: [...get().groupMessages, newGroupMessage],
      });
      console.log(newGroupMessage);
      console.log(authUser);
      if (newGroupMessage.senderId._id !== authUser.data._id) {
        const incomingSound = new Audio(IncomingSound);
        incomingSound.play();
      }
    });
  },

  unSubscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },
}));
