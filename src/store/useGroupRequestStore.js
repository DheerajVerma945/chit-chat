import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const groupReqUserStore = create((set) => ({
  groupRequests: [],
  isGroupRequestsLoading: false,

  getGroupRequests: async () => {
    set({ isGroupRequestsLoading: true });
    try {
      const res = await axiosInstance.get("group/request/getRequests/user");
      set({ groupRequests: res?.data?.data });
    } catch (error) {
      set({ groupRequests: [] });
    } finally {
      set({ isGroupRequestsLoading: false });
    }
  },

  sendGroupRequest: async (groupId ) => {
    try {
      const res = await axiosInstance.post("/group/request/send/user", {
        groupId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
}));
