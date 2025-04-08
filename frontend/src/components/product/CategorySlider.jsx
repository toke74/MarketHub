import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { FaTshirt } from "react-icons/fa";
import { GiWinterHat, GiSunglasses, GiArmoredPants } from "react-icons/gi";
import "swiper/css";
import "swiper/css/scrollbar";

const categories = [
  { id: 1, icon: "images/icons/dress.svg", name: "DRESS & FROCK", count: 53 },
  { id: 2, icon: "images/icons/coat.svg", name: "WINTER WEAR", count: 58 },
  {
    id: 3,
    icon: "images/icons/glasses.svg",
    name: "GLASSES & LENS",
    count: 68,
  },
  {
    id: 4,
    icon: "images/icons/shorts.svg",
    name: "SHORTS & JEANS",
    count: 84,
  },
  {
    id: 5,
    icon: "images/icons/tee.svg",
    name: "T-shirts",
    count: 35,
  },
  {
    id: 6,
    icon: "images/icons/jacket.svg",
    name: "Jacket",
    count: 16,
  },
  {
    id: 7,
    icon: "images/icons/hat.svg",
    name: "Hat & caps",
    count: 30,
  },
];

const CategorySlider = () => {
  return (
    <div className="mt-12 mb-5">
      <div className="container mx-auto px-4">
        <div className="has-scrollbar min-w-full flex items-center gap-3 sm:gap-5 lg:gap-10 overflow-auto snap-mandatory overscroll-contain">
          {categories.map((category) => (
            <div
              key={category.id}
              className="min-w-full sm:min-w-[47.3%] lg:min-w-[23%] flex items-center gap-3 p-4 border border-gray-100 rounded-md snap-start overflow-hidden"
            >
              <div className="bg-gray-100 border border-gray-200 p-6 rounded-sm">
                <img src={category.icon} alt={category.name} width="35" />
              </div>

              <div className="w-full">
                <div className="category-content-flex flex justify-between items-center mb-2.5">
                  <h3 className="category-item-title text-black text-base font-semibold uppercase">
                    {category.name}
                  </h3>

                  <p className="text-text text-base"> ({category.count})</p>
                </div>

                <a
                  href="#"
                  className="text-primary capitalize text-base font-medium"
                >
                  Show all
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
