import React from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";

const SignIn = () => {
  return (
    <div className="flex justify-center  min-h-screen ">
      <div className="bg-white px-10 pt-10 rounded-lg shadow-lg w-96 h-[460px] mt-12">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        {/* Sign-In Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary cursor-pointer text-white py-2 rounded-lg hover:bg-primary/85 transition"
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
            <button className="flex items-center w-full cursor-pointer gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
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
