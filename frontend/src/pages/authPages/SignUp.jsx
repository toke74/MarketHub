//Package imports
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//React icons
import { FaGoogle, FaGithub } from "react-icons/fa";

// Zod Schema for Validation
const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data) => {
    console.log("Sign Up Data:", data);
    // Handle sign-up logic here
  };

  return (
    <div className="flex justify-center  min-h-screen ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-3xl w-full max-w-md h-[540px] mt-12">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        {/* Sign-Up Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label className="block text-text">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter your name"
              required
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-text">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
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
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer text-white py-2 rounded-lg hover:bg-primary/85 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Social Login */}
        <div className="text-center mt-4">
          <p className="text-text">Or sign up with</p>
          <div className="flex justify-center gap-4 mt-2">
            <button className="flex items-center cursor-pointer w-full gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              <FaGoogle /> Google
            </button>
            <button className="flex items-center cursor-pointer w-full gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
              <FaGithub /> GitHub
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/sign_in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
