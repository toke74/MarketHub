//package import
import React, { useState } from "react";
import { Link } from "react-router-dom";

//react-icons
import { FiX, FiChevronLeft } from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

//local files
import { navigationMenu } from "../../../utils/data";

const MobileNav = ({ isOpen, onClose }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div
        onClick={onClose}
        className={`top-0 left-0 absolute w-full h-full z-30 cursor-pointer lg:hidden bg-black opacity-50 transition-opacity duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      ></div>
      <nav
        className={`has-scrollbar fixed lg:hidden top-0 left-0 w-[350px] h-screen bg-white shadow-lg p-5 overflow-y-auto z-50 transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center border-b border-gray-200  pb-4 mb-4">
          <h2 className="text-lg font-semibold text-primary">MENU</h2>
          <button
            onClick={onClose}
            className="text-text text-xl cursor-pointer hover:text-primary transition"
          >
            <FiX />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2 ">
          {navigationMenu.map((item, index) => (
            <li key={index} onClick={onClose}>
              <Link
                to={item.url}
                onClick={scrollToTop}
                className="block text-text font-semibold py-2 hover:text-primary transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language & Currency */}
        <div className="mt-6 border-t  border-gray-200 pt-4">
          {[
            { title: "Language", items: ["English", "Español", "French"] },
            { title: "Currency", items: ["USD $", "EUR €"] },
          ].map((section, index) => (
            <div key={index} className="mb-4 ">
              <button
                onClick={() => toggleCategory(section.title)}
                className="w-full flex justify-between items-center text-text font-semibold py-2 cursor-pointer hover:text-primary transition"
              >
                {section.title}
                <FiChevronLeft
                  className={`${
                    openCategory === section.title ? "rotate-90" : ""
                  } transition-transform`}
                />
              </button>
              <ul
                className={`pl-4 space-y-2 transition-all duration-500 ${
                  openCategory === section.title
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {section.items.map((item, subIndex) => (
                  <li key={subIndex}>
                    <a
                      href="#"
                      className="block text-text  py-1 hover:text-primary transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 my-8 border-t border-gray-200 pt-4">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, index) => (
              <a
                key={index}
                href="#"
                className="bg-gray-200 p-3 rounded-full text-text text-lg hover:bg-primary cursor-pointer hover:text-white transition"
              >
                <Icon />
              </a>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;
