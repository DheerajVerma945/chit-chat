import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserRequestStore = create((set) => ({
  userRequests: [],
  groupRequests: [],
  isUserRequestsLoading: false,
  isGroupRequestsLoading: false,

  getUserRequests: async () => {
    set({ isUserRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/user/request/fetch");
      set({ userRequests: res.data.data });
    } catch (error) {
      set({ userRequests: [] });
    } finally {
      set({ isUserRequestsLoading: false });
    }
  },

  getGroupRequests: async () => {
    set({ isGroupRequestsLoading: true });
    try {
      const res = await axiosInstance.get("group/request/getRequests/user");
      set({ groupRequests: res.data.data });
    } catch (error) {
      set({ groupRequests: [] });
    } finally {
      set({ isGroupRequestsLoading: false });
    }
  },

  sendUserRequest: async () => {},

  sendGroupRequestUser: async (groupId) => {
    try {
      const res = await axiosInstance.post("/group/request/send/user", {
        groupId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  reviewGroupRequestUser: async (status, reqId, groupId) => {
    try {
      const res = await axiosInstance.post(
        `/group/request/review/user/${status}`,
        { reqId, groupId }
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
}));
