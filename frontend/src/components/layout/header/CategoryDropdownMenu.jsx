//Package imports
import React, { useState } from "react";
import { Link } from "react-router-dom";

//React Icons
import { FiChevronDown } from "react-icons/fi";

// Local imports
import { categories } from "../../../utils/data";

const CategoryDropdownMenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle click
  const handleClick = () => {
    setIsVisible(!isVisible); // Hide the item
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`top-0 left-0 absolute w-full h-full z-30 cursor-pointer opacity-50 transition-opacity duration-500 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        } `}
      ></div>
      <div className="relative group">
        {/* Navbar Item */}
        <button
          onClick={handleClick}
          className="flex items-center space-x-1 cursor-pointer text-gray-800 uppercase font-semibold 
      text-[15.6px] hover:text-primary transition "
        >
          <span>CATEGORIES</span>
          <FiChevronDown />
        </button>

        {/* Dropdown Content */}
        <div
          className={`absolute top-[41px] mx-auto -left-24 w-[1200px]  flex space-x-6 z-50 bg-white shadow-lg rounded-md  transition-all p-7 ${
            isVisible ? "block" : "hidden"
          } `}
        >
          <div className="p-8">
            <h1 className="text-xl font-bold mb-6 uppercase">Categories</h1>
            <ul className="grid grid-cols-5 gap-5">
              {categories?.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.url}
                    onClick={handleClick}
                    className="w-full flex justify-between items-center text-gray-800 font-medium py-2 
                          cursor-pointer hover:text-primary transition "
                  >
                    <span className="flex  flex-col ml-3 text-[16px] ">
                      <img
                        className="w-15 h-15 rounded-full object-cover mb-1"
                        src={category.image}
                        alt=""
                      ></img>
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdownMenu;
