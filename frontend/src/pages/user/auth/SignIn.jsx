// Package imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Local imports
import { useLoginUserMutation } from "../../../services/authApi/authApi";
import {
  activateToken,
  loadUserFailure,
} from "../../../features/auth/authSlice";
import GoogleLogin from "../../../components/common/GoogleLogin";
import GitHubLogin from "../../../components/common/GitHubLogin";
import InputField from "../../../components/common/InputField";
import Button from "../../../components/common/Button";
import CheckboxField from "../../../components/common/CheckboxField";

// Zod Schema for Validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const response = await loginUser(data).unwrap();

      if (response.success) {
        navigate("/");
        window.location.reload(true);
        return;
      } else {
        dispatch(activateToken(response.activationToken));
        toast.success("Check your email to verify your account");
        navigate("/verify_email");
        return;
      }
    } catch (err) {
      dispatch(loadUserFailure(err?.data?.message));
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl h-[530px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {/* Social Login */}
        <div className="text-center mt-8">
          <div className="flex justify-center gap-4 mb-8">
            <GoogleLogin />
            <GitHubLogin />
          </div>
          <p className="text-text text-xl">Or sign in with</p>
        </div>

        {/* Sign-In Form */}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm text-text">
            <CheckboxField
              label="Remember Me"
              register={register}
              name="rememberMe"
            />
            <Link
              to="/forgot_password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign-In Button */}
          <Button text="Sign In" isLoading={isLoading} />
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            onClick={scrollToTop}
            to="/sign_up"
            className="text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
