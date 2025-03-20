//Package Import
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

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
  useLogoutUserMutation,
} from "../../services/authApi/authApi";
import { logout } from "../../features/auth/authSlice";

import Dashboard from "./Dashboard";
import Orders from "./Orders";
import AccountSettings from "./AccountSettings";
import Address from "./address/Address";
import Memberships from "./Memberships";
import ReviewsRatings from "./ReviewsRatings";
import PaymentMethods from "./PaymentMethods";
import Policy from "./Policy";
import Refunds from "./Refunds";
import Wishlist from "./Wishlist";
import { useState } from "react";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

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
    { name: "Account Settings", icon: <FaCog /> },
    { name: "Reviews Ratings", icon: <MdReviews /> },
    { name: "Policy", icon: <MdPolicy /> },
    // { name: "Logout", icon: <FaSignOutAlt /> },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <div>
      <div className="container mx-auto  mt-3">
        <div className="grid grid-cols-12 gap-2 lg:gap-3  min-h-screen pb-16">
          {/* Sidebar */}
          <div
            className="col-span-2 lg:col-span-3 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] bg-white   p-6 flex flex-col items-center
       lg:items-start"
          >
            <ul className="space-y-6">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={`group relative flex items-center justify-center lg:justify-start gap-1 
                    p-1 text-2xl lg:text-xl cursor-pointer rounded-md transition-colors
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
              <li
                className="group relative flex items-center  text-text justify-center lg:justify-start gap-1 
          p-1 text-2xl lg:text-xl cursor-pointer rounded-md transition-colors"
              >
                <span className="pr-3 text-[28px]">
                  <FaSignOutAlt />
                </span>
                <span className="absolute left-full ml-3 px-2 py-1 text-[16px] text-white bg-black/70 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity lg:hidden z-[100] whitespace-nowrap">
                  Logout
                </span>
                <span onClick={handleLogout} className="hidden lg:block">
                  Logout
                </span>
              </li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="col-span-10 lg:col-span-9 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] bg-white  p-6">
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
                    <label className="block text-text">Name</label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <label className="block text-text">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      disabled={user?.user?.provider !== "Local"}
                      placeholder="Email Address"
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 ${
                        user?.user?.provider !== "Local"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className=" w-full">
                    <label className="block text-text">Phone Number</label>
                    <input
                      {...register("phoneNumber")}
                      type="text"
                      placeholder="Update your Phone Number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
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
            {selectedTab === "Account Settings" && <AccountSettings />}
            {selectedTab === "Reviews Ratings" && <ReviewsRatings />}
            {selectedTab === "Policy" && <Policy />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
