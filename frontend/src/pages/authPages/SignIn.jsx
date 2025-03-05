//Package imports

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//react icons
import { FaGoogle, FaGithub } from "react-icons/fa";

// Zod Schema for Validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false, // Default is unchecked
    },
  });

  const rememberMe = watch("rememberMe"); // Watch the "rememberMe" field

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    if (data.rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
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
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
              {...register("password")}
            />
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
            Sign In
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
