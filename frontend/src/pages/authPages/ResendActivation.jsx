import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// Local imports
import { useResendActivationToUserMutation } from "../../services/authApi/authApi";
import { activateToken } from "../../features/auth/authSlice";

// Zod Schema for email validation
const resendActivationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResendActivation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resendActivationToUser] = useResendActivationToUserMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
    resolver: zodResolver(resendActivationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await resendActivationToUser(data).unwrap();
      dispatch(activateToken(response.activationToken));

      toast.success("Please check your email for activation code");
      navigate("/verify_email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend activation code");
    } finally {
      setLoading(false);
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
          <div>
            <label className="block text-text">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg hover:bg-secondary disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Activation Code"}
          </button>
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
