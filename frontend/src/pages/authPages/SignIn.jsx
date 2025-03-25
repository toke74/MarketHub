//Package imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//react icons
import { FiEye, FiEyeOff } from "react-icons/fi";

//Local imports
import { useLoginUserMutation } from "../../services/authApi/authApi";
import { activateToken, loadUserFailure } from "../../features/auth/authSlice";
import GoogleLogin from "../../components/common/GoogleLogin";
import GitHubLogin from "../../components/common/GitHubLogin";

// Zod Schema for Validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
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
    <div className="min-h-screen flex  justify-center ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl  h-[530px] mt-12 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {/* Social Login */}
        <div className="text-center mt-8">
          <div className="flex  justify-center gap-4 mb-8">
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
          <div>
            <label className="block text-text">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
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
              to="/forgot_password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary cursor-pointer transition"
          >
            {isLoading ? (
              <img src="loading1.gif" alt="logo" className="w-8 h-8 mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

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
