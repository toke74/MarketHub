// Package imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

// React icons
import { FiEye, FiEyeOff } from "react-icons/fi";

// Local imports
import { useRegisterSellerMutation } from "../../../services/sellerApi/sellerApi";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";

// Zod Schema for seller Registration Validation
const sellerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Must be at least 6 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
      state: z.string().min(2, "State is required"),
      country: z.string().min(2, "Country is required"),
    }),
    storeName: z.string().min(3, "Store name must be at least 3 characters"),
    storeDescription: z
      .string()
      .min(10, "Store description must be at least 10 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterSeller = () => {
  const [registerSeller, { isLoading }] = useRegisterSellerMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    resolver: zodResolver(sellerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerSeller(data).unwrap();

      toast.success(
        response.message || "Check your email to verify your account"
      );
      navigate("/seller_login");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center min-h-screen mb-7 ">
      <div
        className="bg-white px-5 xs:px-10 pt-10 rounded-lg shadow-3xl w-full min-[390px]:w-[95%] md:w-full 
      max-w-2xl mt-12"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Register as Seller
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Phone Number */}
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            register={register}
            name="phone"
            errors={errors}
          />

          {/* Address Fields */}
          <div className="space-y-4 border border-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Store Address</h3>

            <div>
              <label className="block text-text">Street</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
                placeholder="Enter street address"
                {...register("address.street")}
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm">
                  {errors.address.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text">City</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter city"
                  {...register("address.city")}
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-text">Zip Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter zip code"
                  {...register("address.zipCode")}
                />
                {errors.address?.zipCode && (
                  <p className="text-red-500 text-sm">
                    {errors.address.zipCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text">State</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter state"
                  {...register("address.state")}
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-sm">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-text">Country</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter country"
                  {...register("address.country")}
                />
                {errors.address?.country && (
                  <p className="text-red-500 text-sm">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Store Information */}
          <InputField
            label="Store Name"
            type="text"
            placeholder="Enter your store name"
            register={register}
            name="storeName"
            errors={errors}
          />

          <div>
            <label className="block text-text">Store Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Describe your store"
              rows="4"
              {...register("storeDescription")}
            />
            {errors.storeDescription && (
              <p className="text-red-500 text-sm">
                {errors.storeDescription.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button text="Register as a Seller" isLoading={isLoading} />
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-6 pb-10">
          Already have a seller account?{" "}
          <Link
            onClick={scrollToTop}
            to="/seller_login"
            className="text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSeller;
