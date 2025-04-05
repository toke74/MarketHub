// Package imports
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//React Icons
import { FaEnvelope } from "react-icons/fa";

// Local imports
import { useResendSellerVerificationTokenMutation } from "../../../services/sellerApi/sellerApi";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";

// Zod Schema for email validation
const resendSellerActivationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResendSellerToken = () => {
  const navigate = useNavigate();
  const [resendSellerVerificationToken, { isLoading }] =
    useResendSellerVerificationTokenMutation();
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isSellerAuthenticated) {
      navigate("/seller/dashboard");
    }
  }, [isSellerAuthenticated, navigate]);

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
    resolver: zodResolver(resendSellerActivationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await resendSellerVerificationToken(data).unwrap();
      toast.success(response?.message, {
        id: "resend-seller-activation", // Unique ID to avoid duplicate toasts
      });
      navigate("/seller_login");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to resend verification link",
        {
          id: "resend-seller-activation",
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div
        className="bg-white px-7 md:px-10 pt-10 rounded-lg shadow-3xl w-[90%] md:w-full max-w-md h-[390px] 
        min-[390px]:h-[350px]  mt-12"
      >
        <h2 className="text-lg md:text-2xl font-semibold text-center mb-6">
          Resend Seller Verification Link
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email to receive a new verification link for your seller
          account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Submit Button */}
          <Button text="Resend Verification Link" isLoading={isLoading} />
        </form>

        {/* Links */}
        <div className="text-center mt-5 space-y-2">
          <p className="text-sm text-gray-600">
            Already verified?{" "}
            <Link
              onClick={scrollToTop}
              to="/seller_login"
              className="text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendSellerToken;
