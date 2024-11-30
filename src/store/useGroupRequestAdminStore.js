import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useGroupChatStore } from "./useGroupChatStore.js";

const { selectedGroup } = useGroupChatStore();

export const groupRequestAdminStore = create((set) => ({
  adminGroupRequests: [],
  isGroupRequestsAdminLoading: false,

  getGroupRequestsAdmin: async () => {
    set({ isGroupRequestsAdminLoading: true });
    try {
      const res = await axiosInstance.get(
        `/group/request/getRequests/admin/${selectedGroup._id}`
      );
      set({ adminGroupRequests: res?.data?.data });
    } catch (error) {
      set({ adminGroupRequests: [] });
    } finally {
      set({ isGroupRequestsAdminLoading: false });
    }
  },

  sendGroupRequestAdmin: async (userId) => {
    try {
      const res = await axiosInstance.post("/group/request/send/admin", {
        groupId: selectedGroup._id,
        userId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  reviewGroupRequestAdmin: async (status, reqId) => {
    try {
      const res = await axiosInstance.post(
        `group/request/review/admin/${status}`,
        { reqId, groupId: selectedGroup._id }
      );
      setGroupData(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
}));
