import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import IncomingSound from "../assets/Incoming.mp3";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadCount: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/user/request/connections");
      set({ users: res.data.data });
    } catch (error) {
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUnreadCount: async (users) => {
    try {
      const unreadCounts = [];

      for (const user of users) {
        const res = await axiosInstance.get(`messages/unread/${user._id}`);
        if (res.data.data > 0) {
          unreadCounts.push({ userId: user._id, count: res.data.data });
        }
      }

      set({ unreadCount: unreadCounts });
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  },

  setUnreadCount: (data) => {
    set({ unreadCount: data });
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`messages/${userId}`);
      set({ messages: Array.isArray(res.data.data) ? res.data.data : [] });
    } catch (error) {
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setUsers: (data) => {
    set({ users: data });
  },

  setMessages: (data) => {
    set({ messages: data });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadCount } = get();

      if (newMessage.senderId !== selectedUser?._id) {
        const existingCount = unreadCount.find(
          (count) => count.userId === newMessage.senderId
        );

        if (existingCount) {
          existingCount.count += 1;
        } else {
          unreadCount.push({ userId: newMessage.senderId, count: 1 });
        }

        set({ unreadCount: [...unreadCount] });
      } else {
        socket.emit("updateLastMessageIsRead", {
          userId: selectedUser._id,
          messageId: newMessage._id,
        });
        set({
          messages: [...get().messages, newMessage],
        });

        const incomingSound = new Audio(IncomingSound);
        incomingSound.play();
      }
    });
    socket.on("updateRead", () => {
      const { messages } = get();
      const { authUser } = useAuthStore.getState();
      const updatedMessages = messages.map((message) =>
        message.senderId === authUser.data._id
          ? { ...message, isRead: true }
          : message
      );
      set({ messages: updatedMessages });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
}));
