//Package Import
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

//React Icons
import {
  FaUser,
  FaBox,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCog,
  // FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdPolicy } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { MdCardMembership } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";

//Local import
import {
  useUpdateAvatarMutation,
  useLoadUserQuery,
  useUpdateUserProfileMutation,
} from "../../services/authApi/authApi";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import AccountSettings from "./AccountSettings";
import Address from "./Address";
import Memberships from "./Memberships";
import ReviewsRatings from "./ReviewsRatings";
import PaymentMethods from "./PaymentMethods";
import Policy from "./Policy";
import Refunds from "./Refunds";
import Wishlist from "./Wishlist";

// Validation Schema using Zod
const schema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^[0-9]{10,15}$/.test(value), {
      message: "Phone number must be between 10 and 15 digits",
    }),
});

const UserProfile = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const { user } = useSelector((state) => state.auth);
  const [updateAvatar] = useUpdateAvatarMutation();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [loading, setLoading] = useState(false);
  const { refetch } = useLoadUserQuery();

  // ✅ Initialize React Hook Form with Validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.user?.name || "",
      email: user?.user?.email || "",
      phoneNumber: user?.user?.phoneNumber || "",
    },
  });

  // Handle file selection
  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = async () => {
      try {
        if (reader.readyState === 2) {
          const response = await updateAvatar({
            avatar: reader.result,
          }).unwrap();
          console.log(response);
          toast.success(response?.message);
          refetch();
        }
      } catch (error) {
        toast.error("Error happen when updating avatar!");
      }
    };
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await updateUserProfile(data).unwrap();
      toast.success(response?.message || "Profile updated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Sidebar menu items
  const menuItems = [
    { name: "Profile", icon: <FaUser /> },
    { name: "Dashboard", icon: <MdDashboard /> },
    { name: "Orders", icon: <FaBox /> },
    { name: "Refunds", icon: <FaMoneyBillWave /> },
    { name: "Address", icon: <FaMapMarkerAlt /> },
    { name: "Wishlist", icon: <IoIosHeart /> },
    { name: "Memberships", icon: <MdCardMembership /> },
    { name: "Payment Methods", icon: <MdOutlinePayment /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Reviews Ratings", icon: <MdReviews /> },
    { name: "Policy", icon: <MdPolicy /> },
    { name: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Sidebar */}
      <div
        className="col-span-2 lg:col-span-3 bg-white shadow-lg h-screen p-5 flex flex-col items-center
       lg:items-start"
      >
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`group relative flex items-center justify-center lg:justify-start gap-1 p-1 text-2xl lg:text-xl cursor-pointer rounded-md transition-colors
                ${
                  selectedTab === item.name
                    ? "text-primary "
                    : "text-text lg:hover:bg-primary/10 p-2"
                }`}
              onClick={() => setSelectedTab(item.name)}
            >
              <span className="pr-3 text-[28px]">{item.icon}</span>
              <span className="absolute left-full ml-3 px-2 py-1 text-[16px] text-white bg-black/70 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity lg:hidden z-[100] whitespace-nowrap">
                {item.name}
              </span>
              <span className="hidden lg:block">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="col-span-10 lg:col-span-9 shadow-3xl p-6">
        {selectedTab === "Profile" && (
          <div className="flex flex-col items-center pt-10">
            <div className="relative">
              <img
                src={`${user?.user?.avatar?.url}`}
                alt="User"
                className=" w-20 h-20 lg:w-32 lg:h-32 object-cover rounded-full border-3  border-gray-300"
              />
              <label className="absolute bottom-1 -right-1 lg:bottom-2 lg:right-2 bg-gray-200 p-[3px] lg:p-2 rounded-full cursor-pointer">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 w-full max-w-md space-y-4"
            >
              <div className="  w-full">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border rounded-md"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-2 border rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className=" w-full">
                <input
                  {...register("phoneNumber")}
                  type="text"
                  placeholder="Update your Phone Number"
                  className="w-full p-2 border rounded-md"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/85 cursor-pointer">
                Update
              </button>
            </form>
          </div>
        )}

        {selectedTab === "Dashboard" && <Dashboard />}
        {selectedTab === "Orders" && <Orders />}
        {selectedTab === "Refunds" && <Refunds />}
        {selectedTab === "Address" && <Address />}
        {selectedTab === "Wishlist" && <Wishlist />}
        {selectedTab === "Memberships" && <Memberships />}
        {selectedTab === "Payment Methods" && <PaymentMethods />}
        {selectedTab === "Settings" && <AccountSettings />}
        {selectedTab === "Reviews Ratings" && <ReviewsRatings />}
        {selectedTab === "Policy" && <Policy />}
        {selectedTab === "Logout" && <p>Logging out...</p>}
      </div>
    </div>
  );
};

export default UserProfile;
