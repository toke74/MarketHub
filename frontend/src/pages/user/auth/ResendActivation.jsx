import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// Local imports
import { useResendActivationToUserMutation } from "../../../services/authApi/authApi";
import { activateToken } from "../../../features/auth/authSlice";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";

// Zod Schema for email validation
const resendActivationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResendActivation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resendActivationToUser, { isLoading }] =
    useResendActivationToUserMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resendActivationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await resendActivationToUser(data).unwrap();
      dispatch(activateToken(response.activationToken));

      toast.success("Please check your email for activation code");
      navigate("/verify_email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend activation code");
    }
  };

  return (
    <div className="min-h-screen flex  justify-center ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl w-full max-w-md h-[350px] mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Resend Activation Code
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email to receive a new activation code.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register}
            name="email"
            errors={errors}
          />

          {/* Submit Button */}
          <Button text="Resend Activation Code" isLoading={isLoading} />
        </form>

        {/* Go Back to Email Verification */}
        <p className="text-sm text-gray-600 text-center mt-4">
          <Link to="/verify_email" className="text-primary hover:underline">
            Back to Email Verification
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResendActivation;
