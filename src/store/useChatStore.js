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

  getUnreadCount: (users) => {
    try {
      const unreadCount = [];
      users.forEach(async (user) => {
        const res = await axiosInstance.get(`messages/unread/${user._id}`);
        if (res.data.data > 0) {
          unreadCount[user._id] = res.data.data;
          set({ unreadCount });
        }
      });
    } catch (error) {
      console.log(error);
    }
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
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
      const incomingSound = new Audio(IncomingSound);
      incomingSound.play();
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
