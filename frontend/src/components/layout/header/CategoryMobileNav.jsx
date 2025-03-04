import React, { useState } from "react";
import { FiX, FiPlus, FiMinus, FiChevronLeft } from "react-icons/fi";
import { categories } from "../../../utils/data";

const CategoryMobileNav = ({ isOpen, onClose }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div>
      <div
        onClick={onClose}
        className={`top-0 left-0 absolute w-full h-full z-30 cursor-pointer bg-black opacity-50 transition-opacity duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      ></div>
      <nav
        className={`has-scrollbar fixed top-0 left-0 w-[350px] h-screen bg-white shadow-lg p-5   overflow-y-auto z-50 transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center  pb-4 mb-4">
          <h2 className="text-lg font-semibold text-pink-500 ">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-700 text-xl cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        {/* Categories Section */}
        <ul className="space-y-3 border-b border-gray-200 pb-4">
          {categories?.map((category, index) => (
            <li key={index}>
              <button
                onClick={() => toggleCategory(index)}
                className="w-full flex justify-between items-center text-gray-800 font-medium py-2 
                cursor-pointer hover:text-primary transition "
              >
                <span className="flex items-center ml-3 text-[18px] ">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={category.image}
                    alt=""
                  ></img>
                  <span className="pl-4">{category.name}</span>
                </span>
                {category.items.length > 0 ? (
                  openCategory === index ? (
                    <FiMinus />
                  ) : (
                    <FiPlus />
                  )
                ) : null}
              </button>

              {openCategory === index && category.items.length > 0 && (
                <ul className="pl-8 pt-2 space-y-2 transition-all duration-500 border-t border-gray-100 pb-1">
                  {category.items.map((item, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href="#"
                        className="block text-gray-600 hover:text-primary py-1"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CategoryMobileNav;
