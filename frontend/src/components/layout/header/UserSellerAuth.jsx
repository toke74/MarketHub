//Package Imports
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

//React Icons
import { FaUser } from "react-icons/fa";
import { BsShop } from "react-icons/bs";

const UserSellerAuth = () => {
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
      {/* Sign In Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer ">
        Sign In
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute -right-5 mt-1 w-65 bg-white border border-gray-200 rounded-lg shadow-3xl z-50">
          <ul className="py-4 text-text">
            <DropdownItem to="/sign_in" icon={<FaUser />} text="User Login" />
            <DropdownItem
              to="/seller_login"
              icon={<BsShop />}
              text="Seller Login"
            />
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
      className="flex  items-center  px-4 py-2 hover:bg-primary/5 transition"
    >
      <span className="ml-4 mr-3 text-[19px]">{icon}</span> {text}
    </Link>
  </li>
);

export default UserSellerAuth;
