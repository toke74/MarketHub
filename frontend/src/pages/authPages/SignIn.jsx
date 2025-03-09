//Package imports
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

//react icons
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

//Local imports
import { useLoginUserMutation } from "../../services/authApi/authApi";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  activateToken,
} from "../../features/auth/authSlice";

// Zod Schema for Validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false, // Default is unchecked
    },
  });

  // Watch the "rememberMe" field
  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    //Start loading state
    dispatch(loginRequest());

    try {
      const response = await loginUser(data).unwrap();

      if (response.success && response.user) {
        // Store user data in Redux store
        dispatch(loginSuccess(response.user));
        navigate("/dashboard");
        return;
      } else {
        // Store activation Token in Redux store
        dispatch(activateToken(response.activationToken));

        toast.success("Check your email to verify your account");
        navigate("/verify_email");
        return;
      }
    } catch (err) {
      // Store error data in Redux store
      dispatch(loginFailure(err.data?.message || "Login failed!"));

      toast.error(err?.data?.message);
    }
  };
  return (
    <div className="min-h-screen flex  justify-center ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl  h-[500px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {/* Sign-In Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label className="block text-text">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
              placeholder="Enter your email"
              required
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-text">Password</label>
            <div className="relative">
              <input
                // type="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Enter your password"
                required
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm text-text">
            <label className="flex items-center cursor-pointer ">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="mr-2 "
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/85 cursor-pointer transition"
          >
            {isLoading ? (
              <img src="loading1.gif" alt="logo" className="w-8 h-8 mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Social Login */}
        <div className="text-center mt-4">
          <p className="text-gray-500">Or sign in with</p>
          <div className="flex justify-center gap-4 mt-2">
            <button className="flex items-center w-full cursor-pointer gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              <FaGoogle /> Google
            </button>
            <button className="flex items-center gap-2 w-full cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
              <FaGithub /> GitHub
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/sign_up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
