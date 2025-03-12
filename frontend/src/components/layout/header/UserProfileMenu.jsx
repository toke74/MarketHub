import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { FaRegUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer ">
        <FaRegUser
          size={26}
          className=" text-text hover:text-primary transition"
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
            <DropdownItem to="/logout" icon={<FaSignOutAlt />} text="Logout" />
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
