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
import { useForgotPasswordMutation } from "../../services/authApi/authApi";

// Validation Schema using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
      setIsSubmitting(true);

      await forgotPassword(data).unwrap();

      toast.success("Password reset link sent! Check your email.");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="bg-white px-10 py-8 rounded-lg shadow-3xl  h-[350px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email, and we'll send you a password reset link.
        </p>

        {/* Forgot Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label className="block text-text">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
                placeholder="Enter your email"
                required
                {...register("email")}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaEnvelope />
              </span>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/85 cursor-pointer transition disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
