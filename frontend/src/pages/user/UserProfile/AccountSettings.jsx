// Package imports
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// React Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

//Local Imports
import {
  useDeleteUserAccountMutation,
  useUpdatePasswordMutation,
} from "../../../services/authApi/authApi";
import DeleteAccount from "./DeleteAccount";

// Validation Schema using Zod
const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Old Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const AccountSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword] = useUpdatePasswordMutation();
  const [deleteUserAccount] = useDeleteUserAccountMutation();
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const response = await updatePassword(data).unwrap();
      toast.success(response?.message || "Password updated successfully!");
      reset();
    } catch (error) {
      toast.error(error?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountDeletion = async () => {
    await deleteUserAccount().unwrap();
  };
  return (
    <div className="min-h-screen flex justify-center">
      <div className="pl-27  py-8 w-full mt-12 max-w-2xl bg-white h-[30%]">
        <div className="py-8 h-[450px] mt-12 w-full max-w-md ">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Password
          </h2>
          <p className="text-gray-600  mb-4">Change your password securely.</p>

          {/* Update Password Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4 "
          >
            {/* Old Password */}
            <div>
              <label className="block text-text">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  // className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
                  placeholder="Enter old password"
                  disabled={user?.user?.provider !== "Local"}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 ${
                    user?.user?.provider !== "Local"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  required
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-text">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  // className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
                  placeholder="Enter new password"
                  disabled={user?.user?.provider !== "Local"}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 ${
                    user?.user?.provider !== "Local"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  required
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-text">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  // className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
                  placeholder="Confirm new password"
                  disabled={user?.user?.provider !== "Local"}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 ${
                    user?.user?.provider !== "Local"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  required
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/85  transition disabled:bg-gray-400 ${
                user?.user?.provider !== "Local"
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={isSubmitting || user?.user?.provider !== "Local"}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
        <div className="border-b border-gray-300 mt-12  max-w-md"></div>
        <div className="py-8 h-[450px] mt-12 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Delete Account
          </h2>
          <p className="text-gray-600 mt-2">Manage your account preferences.</p>

          <div className="mt-6">
            <DeleteAccount onDelete={handleAccountDeletion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
