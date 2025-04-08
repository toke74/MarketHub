// Package imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

// Local imports
import { useLoginSellerMutation } from "../../../services/sellerApi/sellerApi";
import { loadSellerFailure } from "../../../features/seller/sellerSlice";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";

// Zod Schema for Seller Login Validation
const sellerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SellerLogin = () => {
  const [loginSeller, { isLoading }] = useLoginSellerMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isSellerAuthenticated) {
      navigate("/seller/dashboard");
    }
  }, [isSellerAuthenticated, navigate]);

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
    resolver: zodResolver(sellerLoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginSeller(data).unwrap();
      if (response.success) {
        setTimeout(() => {
          navigate("/seller/dashboard");
          window.location.reload(true);
        }, 5000);
        return;
      } else {
        toast.success("Check your email to verify your account");
        navigate("/seller_login");
        return;
      }
    } catch (err) {
      dispatch(loadSellerFailure(err?.data?.message));
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="flex justify-center min-h-screen mb-7">
      <div
        className="bg-white px-5 xs:px-10 pt-10 rounded-lg shadow-3xl w-full min-[390px]:w-[95%] md:w-full 
      max-w-md mt-12 h-[480px]"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Seller Login
        </h2>

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

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              onClick={scrollToTop}
              to="/seller/forgot_password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button text="Login as a Seller" isLoading={isLoading} />
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6 pb-10">
          Don't have a seller account?{" "}
          <Link
            onClick={scrollToTop}
            to="/seller/register"
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Resend Verification Link */}
        <p className="text-center text-gray-600 pb-4">
          Need to verify your email?{" "}
          <Link
            onClick={scrollToTop}
            to="/resend_seller_token"
            className="text-xs md:text-base text-primary hover:underline"
          >
            Resend Verification Link
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
