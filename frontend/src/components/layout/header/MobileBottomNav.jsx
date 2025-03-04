import React, { useState } from "react";
import { FiMenu, FiShoppingBag, FiHome, FiHeart, FiGrid } from "react-icons/fi";
import MobileNav from "./MobileNav";
import CategoryMobileNav from "./CategoryMobileNav";

const MobileBottomNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <div>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] bg-white shadow-2xl flex justify-around items-center py-2 z-30 lg:hidden">
        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="relative text-2xl text-text p-2 cursor-pointer  hover:text-primary"
        >
          <FiMenu />
        </button>

        {/* Home Button */}
        <button className="relative text-2xl text-text p-2 cursor-pointer  hover:text-primary">
          <FiHome />
        </button>

        {/* Wishlist Button */}
        <button className="relative text-2xl text-text p-2 cursor-pointer  hover:text-primary">
          <FiHeart />
          <span className="absolute top-0 right-0 bg-error text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
            0
          </span>
        </button>

        {/* Shopping Bag Button */}
        <button className="relative text-2xl text-text p-2 cursor-pointer  hover:text-primary">
          <FiShoppingBag />
          <span className="absolute top-0 right-0 bg-error text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
            0
          </span>
        </button>

        {/* Grid/Menu Button */}
        <button
          onClick={() => setCategoryOpen(true)}
          className="relative text-2xl text-text p-2 cursor-pointer  hover:text-primary"
        >
          <FiGrid />
        </button>
      </div>
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CategoryMobileNav
        isOpen={categoryOpen}
        onClose={() => setCategoryOpen(false)}
      />
    </div>
  );
};

export default MobileBottomNav;
