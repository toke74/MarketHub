//Package Imports
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//React Icons
<<<<<<< HEAD
import { FaUser, FaBox, FaSignOutAlt } from "react-icons/fa";
import {
  FiPackage,
  FiDollarSign,
  FiMessageSquare,
  FiPercent,
  FiPieChart,
  FiHelpCircle,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { MdOutlineReviews } from "react-icons/md";
import { FaStore } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { RiCoupon3Line } from "react-icons/ri";
=======
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
>>>>>>> ca76b54b366d2cce5f4c4c0e1ad2a955f2f297af

//Local import
import { useLogoutSellerMutation } from "../../../services/sellerApi/sellerApi";
import { logout } from "../../../features/seller/sellerSlice";

const SellerProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const [logoutSeller] = useLogoutSellerMutation();
=======
  const [logoutSeller, { isLoading }] = useLogoutSellerMutation();
>>>>>>> ca76b54b366d2cce5f4c4c0e1ad2a955f2f297af

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
      await logoutSeller().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/seller_login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer ">
        <img
          src={`${seller?.vendor?.storeAvatar?.url}`}
          alt="Seller"
          className=" w-10 h-10  object-cover rounded-full border-3  border-gray-300"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
<<<<<<< HEAD
        <div
          className="absolute -right-5 mt-1 w-65 bg-white border border-gray-200 rounded-lg shadow-3xl 
        z-50 has-scrollbar overflow-y-auto  max-h-[80vh]"
        >
          <ul className="py-4 text-text">
            <li>
              <Link
                to="/seller/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FaUser />}</span> Seller
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/seller/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<MdDashboard />}</span>{" "}
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/product_management"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiPackage />}</span>{" "}
                Product Management
              </Link>
            </li>
            <li>
              <Link
                to="/order_management"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FaBox />}</span> Order
                Management
              </Link>
            </li>
            <li>
              <Link
                to="/sales"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiDollarSign />}</span>{" "}
                Sales & Earnings
              </Link>
            </li>
            <li>
              <Link
                to="/refunds"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">
                  {<HiOutlineReceiptRefund />}
                </span>{" "}
                Refunds
              </Link>
            </li>
            <li>
              <Link
                to="/withdraw_money"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<BiMoneyWithdraw />}</span>{" "}
                WithDraw Money
              </Link>
            </li>
            <li>
              <Link
                to="/coupons"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<RiCoupon3Line />}</span>{" "}
                Coupons
              </Link>
            </li>
            <li>
              <Link
                to="/customer_messages"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiMessageSquare />}</span>{" "}
                Customer Messages
              </Link>
            </li>
            <li>
              <Link
                to="/customer_reviews"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<MdOutlineReviews />}</span>{" "}
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link
                to="/marketing"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiPercent />}</span>{" "}
                Marketing
              </Link>
            </li>
            <li>
              <Link
                to="/store_settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FaStore />}</span> Store
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiPieChart />}</span>{" "}
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/help_center"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
              >
                <span className="mr-3 text-[19px]">{<FiHelpCircle />}</span>{" "}
                Help Center
              </Link>
            </li>

            <hr className="my-2 border-gray-300" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full cursor-pointer px-4 py-2 hover:bg-gray-100 transition "
=======
        <div className="absolute -right-5 mt-1 w-65 bg-white border border-gray-200 rounded-lg shadow-3xl z-50">
          <ul className="py-4 text-text">
            <DropdownItem to="/profile" icon={<FaUser />} text="User Profile" />
            <DropdownItem
              to="/seller/dashboard"
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
>>>>>>> ca76b54b366d2cce5f4c4c0e1ad2a955f2f297af
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
<<<<<<< HEAD
=======
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
>>>>>>> ca76b54b366d2cce5f4c4c0e1ad2a955f2f297af

export default SellerProfileMenu;
