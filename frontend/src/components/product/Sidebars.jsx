import { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const categories = [
  {
    name: "Clothes",
    icon: "images/icons/dress.svg",
    subcategories: [
      { name: "Shirt", stock: 300 },
      { name: "Shorts & Jeans", stock: 60 },
      { name: "Jacket", stock: 50 },
      { name: "Dress & Frock", stock: 87 },
    ],
  },
  {
    name: "Footwear",
    icon: "images/icons/shoes.svg",
    subcategories: [
      { name: "Sports", stock: 45 },
      { name: "Formal", stock: 75 },
      { name: "Casual", stock: 35 },
      { name: "Safety Shoes", stock: 26 },
    ],
  },
  {
    name: "Jewelry",
    icon: "images/icons/jewelry.svg",
    subcategories: [
      { name: "Earrings", stock: 46 },
      { name: "Couple Rings", stock: 73 },
      { name: "Necklace", stock: 61 },
    ],
  },
  {
    name: "Perfume",
    icon: "images/icons/perfume.svg",
    subcategories: [
      { name: "Clothes Perfume", stock: 12 },
      { name: "Deodorant", stock: 60 },
      { name: "Jacket", stock: 50 },
      { name: "Dress & Frock", stock: 87 },
    ],
  },
  {
    name: "Cosmetics",
    icon: "images/icons/cosmetics.svg",
    subcategories: [
      { name: "Shampoo", stock: 68 },
      { name: "Sunscreen", stock: 46 },
      { name: "Body Wash", stock: 79 },
      { name: "Makeup Kit", stock: 23 },
    ],
  },
  {
    name: "Glasses",
    icon: "images/icons/glasses.svg",
    subcategories: [
      { name: "Sunglasses", stock: 68 },
      { name: "Lenses", stock: 46 },
      { name: "Body Wash", stock: 79 },
      { name: "Makeup Kit", stock: 23 },
    ],
  },
  {
    name: "Bags",
    icon: "images/icons/bag.svg",
    subcategories: [
      { name: "Shopping Bag", stock: 45 },
      { name: "Gym Backpack", stock: 75 },
      { name: "Purse", stock: 87 },
      { name: "Wallet", stock: 75 },
    ],
  },
];

const products = [
  {
    id: 1,
    image: "images/products/1.jpg",
    title: "Baby Fabric Shoes",
    oldPrice: "$5.00",
    newPrice: "$4.00",
    rating: 5,
  },
  {
    id: 2,
    image: "images/products/2.jpg",
    title: "Men's Hoodies T-Shirt",
    oldPrice: "$17.00",
    newPrice: "$7.00",
    rating: 4.5,
  },
  {
    id: 3,
    image: "images/products/3.jpg",
    title: "Girls T-Shirt",
    oldPrice: "$5.00",
    newPrice: "$3.00",
    rating: 4.5,
  },
  {
    id: 4,
    image: "images/products/4.jpg",
    title: "Woolen Hat for Men",
    oldPrice: "$15.00",
    newPrice: "$12.00",
    rating: 5,
  },
];

export const CategorySidebar = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleAccordion = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="p-5 w-[360px] border border-gray-200 mb-7 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          Category
        </h2>
      </div>

      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="text-xl">
            <button
              className="flex justify-between items-center w-full py-3"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-7 h-7"
                />
                <p className="text-gray-700 font-medium">{category.name}</p>
              </div>
              <div>
                {openCategory === index ? (
                  <AiOutlineMinus className="text-gray-500 cursor-pointer" />
                ) : (
                  <AiOutlinePlus className="text-gray-500 cursor-pointer" />
                )}
              </div>
            </button>

            <ul
              className={`transition-all duration-300 ${
                openCategory === index
                  ? "max-h-40 opacity-100 py-2 border-t border-gray-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {category.subcategories.map((sub, subIndex) => (
                <li
                  key={subIndex}
                  className="flex justify-between px-5 py-1 hover:bg-gray-100 "
                >
                  <p className="capitalize text-gray-600">{sub.name}</p>
                  <span className="text-gray-500">{sub.stock}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
export const ProductShowcaseSidebar = () => {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-lg w-[360px]">
      <h3 className="text-gray-900 font-bold text-lg uppercase tracking-wide mb-4">
        Best Sellers
      </h3>
      <div>
        {products.map((product) => (
          <ProductShowcaseItem key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

const ProductShowcaseItem = ({ image, title, oldPrice, newPrice, rating }) => {
  return (
    <div className="flex items-center gap-6  pb-3 ">
      <a href="#" className="w-25 h-25">
        <img
          src={image}
          alt={title}
          className="rounded-lg w-full h-full object-cover"
        />
      </a>
      <div className="flex-1 ">
        <a href="#" className="block">
          <h4 className="text-text font-semibold text-lg truncate">{title}</h4>
        </a>
        <div className="flex text-yellow-500 text-sm pt-2 pb-3">
          {[...Array(5)].map((_, i) =>
            i + 1 <= rating ? <FaStar key={i} /> : <FaStarHalfAlt key={i} />
          )}
        </div>
        <div className="flex items-center space-x-3">
          <del className="text-gray-500 text-sm">{oldPrice}</del>
          <p className="text-gray-700 font-bold text-sm">{newPrice}</p>
        </div>
      </div>
    </div>
  );
};
