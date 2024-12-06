import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import IncomingSound from "../assets/Incoming.mp3";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  unreadGroupCount: [],
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

  getUnreadGroupCount: async (groups) => {
    try {
      const unreadCounts = [];

      for (const group of groups) {
        const res = await axiosInstance.get(
          `/group/messages/unread/${group._id}`
        );
        if (res.data.data > 0) {
          unreadCounts.push({ groupId: group._id, count: res.data.data });
        }
      }

      set({ unreadGroupCount: unreadCounts });
    } catch (error) {
      console.error("Error fetching unread group counts:", error);
    }
  },

  setUnreadGroupCount: (data) => {
    set({ unreadGroupCount: data });
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
    const { authUser } = useAuthStore.getState();
    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (newGroupMessage) => {
      const { unreadGroupCount, selectedGroup } = get();
      if (newGroupMessage.groupId !== selectedGroup?._id) {
        const existingCount = unreadGroupCount.find(
          (count) => count.groupId === newGroupMessage.groupId
        );
        if (existingCount) {
          existingCount.count += 1;
        } else {
          unreadGroupCount.push({ groupId: newGroupMessage.groupId, count: 1 });
        }

        set({ unreadGroupCount: [...unreadGroupCount] });
      } else {
        if (newGroupMessage.senderId._id !== authUser.data._id) {
          socket.emit("updateLastGroupMessageIsRead", {
            userId: authUser.data._id,
            messageId: newGroupMessage._id,
          });
        }
        set({
          groupMessages: [...get().groupMessages, newGroupMessage],
        });
        if (newGroupMessage.senderId._id !== authUser.data._id) {
          const incomingSound = new Audio(IncomingSound);
          incomingSound.play();
        }
      }
    });
  },

  unSubscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },
}));
