// Package imports
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//Local Import
import { useResetPasswordMutation } from "../../../services/authApi/authApi";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";

// Validation Schema using Zod
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const resetDate = {
        password: data.password,
        confirmPassword: data.confirmPassword,
        resetToken,
      };

      await resetPassword(resetDate).unwrap();

      toast.success("Password reset successfully! You can now sign in.");
      navigate("/sign_in");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="bg-white px-10 py-8 rounded-lg shadow-3xl h-[410px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter a new password for your account.
        </p>

        {/* Reset Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* New Password */}

          <InputField
            label="New Password"
            type="password"
            placeholder="Enter new password"
            register={register}
            name="password"
            errors={errors}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Confirm Password Field with Toggle */}
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Enter your Confirm password"
            register={register}
            name="confirmPassword"
            errors={errors}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Reset Password Button */}
          <Button text="Reset Password" isLoading={isLoading} />
        </form>
        {/* Back to Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <Link
            onClick={scrollToTop}
            to="/sign_in"
            className="text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
