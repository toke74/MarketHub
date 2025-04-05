//Package Imports
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//React Icons
import {
  FaUser,
  FaBox,
  FaCreditCard,
  FaCog,
  FaMapMarkerAlt,
  FaHeart,
  FaStar,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

//Local import
import { useLogoutUserMutation } from "../../../services/authApi/authApi";
import { logout } from "../../../features/auth/authSlice";

const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/sign_in");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer ">
        <img
          src={`${user?.user?.avatar?.url}`}
          alt="User"
          className=" w-10 h-10  object-cover rounded-full border-3  border-gray-300"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute -right-5 mt-1 w-65 bg-white border border-gray-200 rounded-lg shadow-3xl z-50">
          <ul className="py-4 text-text">
            <DropdownItem to="/profile" icon={<FaUser />} text="User Profile" />
            <DropdownItem
              to="/dashboard"
              icon={<MdDashboard />}
              text="Dashboard"
            />
            <DropdownItem to="/orders" icon={<FaBox />} text="Orders" />
            <DropdownItem
              to="/payments"
              icon={<FaCreditCard />}
              text="Payment Methods"
            />
            <DropdownItem
              to="/settings"
              icon={<FaCog />}
              text="Account Settings"
            />
            <DropdownItem
              to="/address"
              icon={<FaMapMarkerAlt />}
              text="Address"
            />
            <DropdownItem to="/wishlist" icon={<FaHeart />} text="Wishlist" />
            <DropdownItem
              to="/reviews"
              icon={<FaStar />}
              text="Reviews & Ratings"
            />
            <DropdownItem
              to="/memberships"
              icon={<FaUsers />}
              text="Memberships"
            />
            <hr className="my-2 border-gray-300" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full cursor-pointer px-4 py-2 hover:bg-primary/5 transition "
            >
              <span className="mr-3 text-[19px]">
                <FaSignOutAlt />
              </span>{" "}
              Logout
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
const DropdownItem = ({ to, icon, text }) => (
  <li>
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="flex items-center px-4 py-2 hover:bg-primary/5 transition"
    >
      <span className="mr-3 text-[19px]">{icon}</span> {text}
    </Link>
  </li>
);

export default UserProfileMenu;
