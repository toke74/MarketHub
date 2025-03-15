//Package imports
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Local imports
import { useActivateUserMutation } from "../../services/authApi/authApi";

// Zod Schema for OTP validation
const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

const EmailVerification = () => {
  const [activateUser] = useActivateUserMutation();
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Access user data from Redux store
  const activationToken = useSelector((state) => state.auth.activationToken);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Automatically move to the next field
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Update hidden OTP field
    setValue("otp", newOtp.join(""));
  };

  // Handle OTP submission
  const onSubmit = async (data) => {
    try {
      const activationData = {
        activation_token: activationToken,
        activation_code: data.otp,
      };
      const response = await activateUser(activationData).unwrap();

      toast.success("Email verified successfully");
      navigate("/sign_in");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex  justify-center ">
      <div className="bg-white  px-10 pt-10 rounded-lg shadow-3xl w-full max-w-md h-[350px] mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Email Verification
        </h2>
        <p className="text-text text-center mb-4">
          Enter the 4-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otpValues.map((val, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={val}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-lg border rounded-lg focus:ring focus:ring-blue-200"
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-red-500 text-sm text-center">
              {errors.otp.message}
            </p>
          )}

          {/* Resend OTP */}
          <p className="text-sm text-center text-text">
            Didn't receive the OTP?{" "}
            <Link
              to="/resend_activation"
              className="text-primary hover:underline"
            >
              Resend
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg hover:bg-primary/85"
          >
            Verify OTP
          </button>
        </form>

        {/* Go Back to Sign In */}
        <p className="text-sm text-gray-600 text-center mt-4">
          <Link to="/sign_in" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
