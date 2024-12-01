import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  MessageSquare,
  User,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { axiosInstance } from "../lib/axios";

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [isValidatingUsername, setIsValidatingUsername] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    username: "",
  });
  const showX = formData.username !== "";

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.username) return toast.error("User name is required");
    if (formData.username.length > 18)
      return toast.error("User name cannot be greater than 18 characters");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      return toast.error("User name contains invalid characters");
    return true;
  };

  const debounceUsername = (username) => {
    setIsValidatingUsername(true);
    setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/auth/validateUserName/${username}`);
        setIsUsernameValid(res?.data?.status === "success");
      } catch {
        setIsUsernameValid(false);
      } finally {
        setIsValidatingUsername(false);
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validData = validateForm();
    if (validData === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-16">
      <div className="flex items-center justify-center flex-col p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Your Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      debounceUsername(e.target.value);
                    }}
                  />
                  {showX && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {isValidatingUsername ? (
                      <Loader className="size-5 animate-spin text-base-content/40" />
                    ) : isUsernameValid ? (
                      <Check className="size-5 text-success" />
                    ) : (
                      <X className="size-5 text-error" />
                    )}
                  </div>}
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="your@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={
                  isSigningUp || isValidatingUsername || !isUsernameValid
                }
              >
                {isSigningUp ? (
                  <>
                    <Loader className="size-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
