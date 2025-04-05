//Package imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

//React icons
import { FiEye, FiEyeOff } from "react-icons/fi";

//Local imports
import { useRegisterUserMutation } from "../../../services/authApi/authApi";
import { activateToken } from "../../../features/auth/authSlice";
import GitHubLogin from "../../../components/common/GitHubLogin";
import GoogleLogin from "../../../components/common/GoogleLogin";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";

// Zod Schema for Validation
const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      dispatch(activateToken(response.activationToken));

      toast.success("Check your email to verify your account");
      navigate("/verify_email");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center  min-h-screen ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl w-full max-w-md h-[659px] mt-12 ">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        {/* Social Login */}
        <div className="text-center mt-8 mb-4">
          <div className="flex justify-center gap-4 mb-8">
            <GoogleLogin />
            <GitHubLogin />
          </div>
          <p className="text-text text-xl">Or sign up with</p>
        </div>
        {/* Sign-Up Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Name Field */}
          <InputField
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            register={register}
            name="name"
            errors={errors}
          />
          {/* Email Field */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register}
            name="email"
            errors={errors}
          />

          {/* Password Field */}
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
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

          {/* Sign-Up Button */}
          <Button text="Sign Up" isLoading={isLoading} />
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-4 ">
          Already have an account?{" "}
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

export default SignUp;
