// Package imports
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// React Icons
import { FaEnvelope } from "react-icons/fa";

//Local Import
import { useForgotPasswordMutation } from "../../../services/authApi/authApi";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";

// Validation Schema using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isSellerAuthenticated) {
      navigate("/seller/dashboard");
    }
  }, [isSellerAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();

      toast.success("Password reset link sent! Check your email.");
      navigate("/sign_in");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="bg-white px-10 py-8 rounded-lg shadow-3xl  h-[350px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-xs text-center mb-4">
          Enter your email, and we'll send you a password reset link.
        </p>

        {/* Forgot Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Email Field */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register}
            name="email"
            icon={<FaEnvelope />}
            errors={errors}
          />
          {/* Reset Link Button */}
          <Button text="Send Reset Link" isLoading={isLoading} />
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <Link
            onClick={scrollToTop}
            to="/Sign_in"
            className="text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
