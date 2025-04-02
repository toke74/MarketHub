// Package imports
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Local imports
import { useResendSellerVerificationTokenMutation } from "../../services/sellerApi/sellerApi";
// import { activateSellerToken } from "../../features/seller/sellerSlice";

// Zod Schema for email validation
const resendSellerActivationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResendSellerToken = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resendSellerVerificationToken] =
    useResendSellerVerificationTokenMutation();
  const { isSellerAuthenticated } = useSelector((state) => state.seller);

  // Redirect if already authenticated
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
    resolver: zodResolver(resendSellerActivationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer text-white py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Link"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-5 space-y-2">
          {/* <p className="text-sm text-gray-600">
            <Link
              to="/seller/verify_email"
              className="text-primary hover:underline"
            >
              Back to Email Verification
            </Link>
          </p> */}
          <p className="text-sm text-gray-600">
            Already verified?{" "}
            <Link to="/seller_login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendSellerToken;
