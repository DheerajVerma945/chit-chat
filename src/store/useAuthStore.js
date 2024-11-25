import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingPassword: false,
  isUpdatingProfile: false,
  isSendingMail: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePassword: async (data) => {
    set({ isUpdatingPassword: true });
    try {
      const res = await axiosInstance.patch("/auth/update-password", data);
      toast.success("Password updated successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingPassword: false });
    }
  },

  sendVerificationMail: async (email) => {
    set({ isSendingMail: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password/mail",{ email });
      toast.success("Verification mail sent");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSendingMail: false });
    }
  },

  verifyAndReset:async(email,token,newPass)=>{
    try {
      console.log("email-",email," token-",token," newPass-",newPass);
      const res = await axiosInstance.post("/auth/forgot-password/verify",{email,token,newPass});
      toast.success("Password updated");
      return res;
    } catch (error) {
      toast.error(error.response.data.message);
      return error.response.data;
    }
  }
}));
