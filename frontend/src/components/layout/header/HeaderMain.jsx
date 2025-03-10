//package imports
import React, { useState } from "react";
import { Link } from "react-router-dom";

//React icons
import { FaRegHeart } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";

//Local imports

const HeaderMain = () => {
  return (
    <div className="border-b border-gray-200 py-3">
      <div className="container mx-auto flex justify-between items-center pl-4 pr-6">
        {/* Logo */}
        <Link to="/" className="">
          <img
            src="logo.png"
            alt="MarketHub"
            width="70"
            height="36"
            className="mx-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="relative w-1/3 hidden sm:block ">
          <input
            type="search"
            name="search"
            placeholder="Enter your product name..."
            className="w-full text-sm text-gray-700 py-2 px-4 pr-12 border border-gray-200 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-primary text-lg cursor-pointer">
            <IoSearchOutline size={22} />
          </button>
        </div>

        {/* User Actions */}
        <div className="flex space-x-8">
          <button className="relative  hover:text-primary text-xl cursor-pointer sm:hidden ">
            <IoSearchOutline size={26} />
          </button>

          <Link
            to="/sign_in"
            className="relative   hover:text-primary text-xl cursor-pointer"
          >
            Sign in
          </Link>

          <button className="relative  hover:text-primary text-xl cursor-pointer hidden lg:block">
            <FaRegHeart size={26} />
            <span className="absolute -top-2 -right-2 bg-error text-white text-[13px] font-semibold px-[6px] pb-[1px] pt-[1.5px] rounded-full">
              0
            </span>
          </button>

          <button className="relative  hover:text-primary text-xl cursor-pointer hidden lg:block">
            <FiShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-error text-white text-[13px] font-semibold px-[6px] pb-[1px] pt-[1.5px] rounded-full">
              0
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMain;
