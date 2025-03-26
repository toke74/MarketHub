//Package Imports
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

// React Icons
import { FaStar, FaRegStar } from "react-icons/fa";

// Dummy Deals Data
const deals = [
  {
    id: 1,
    image: "images/products/shampoo.jpg",
    title: "Shampoo, Conditioner & Facewash Packs",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor",
    price: 150,
    originalPrice: 200,
    sold: 20,
    available: 40,
    endTime: new Date().getTime() + 3600 * 1000, // 1 hour from now
    rating: 4, // out of 5
  },
  {
    id: 2,
    image: "images/products/jewelry-1.jpg",
    title: "Rose Gold Diamonds Earring",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor",
    price: 1990,
    originalPrice: 2000,
    sold: 15,
    available: 40,
    endTime: new Date().getTime() + 7200 * 1000, // 2 hours from now
    rating: 3, // out of 5
  },
];

const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = (endTime) => {
      const difference = endTime - new Date().getTime();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return timeLeft;
    };

    const updateCountdowns = () => {
      const newTimeLeft = {};
      deals.forEach((deal) => {
        newTimeLeft[deal.id] = calculateTimeLeft(deal.endTime);
      });
      setTimeLeft(newTimeLeft);
    };

    updateCountdowns(); // Initialize the countdowns
    const timer = setInterval(updateCountdowns, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold capitalize mb-4">Deal of the day</h2>

      <div
        className="has-scrollbar flex items-center gap-5 overflow-x-auto [overscroll-behavior-inline:contain]
  [scroll-snap-type:inline] snap-mandatory"
      >
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="min-w-full w-[160px] min-[480px]:ml-12 p-8 border border-gray-200 rounded-lg snap-start"
          >
            <div className="md:flex items-center md:gap-4">
              {/* Image */}
              <div className="mb-7">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full  object-cover"
                />
              </div>

              {/* Content */}
              <div className="">
                {/* Rating */}
                <div className="flex text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) =>
                    i < deal.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>

                {/* {Tittle} */}
                <Link to="">
                  <h3 className="text-base md:text-lg font-semibold truncate uppercase">
                    {deal.title}
                  </h3>
                </Link>
                {/* Description */}
                <p className="text-gray-500 text-sm mt-1">{deal.description}</p>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-primary font-bold text-xl">
                    ${deal.price}
                  </p>
                  <del className="text-gray-400 text-sm">
                    ${deal.originalPrice}
                  </del>
                </div>

                {/* Add to Cart Button */}
                <button className="mt-4 w-full bg-primary cursor-pointer text-white py-2 rounded-md hover:bg-secondary transition">
                  Add to Cart
                </button>

                {/* Status */}
                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    Already Sold: <b>{deal.sold}</b>
                  </p>
                  <p className="text-sm text-gray-700">
                    Available: <b>{deal.available}</b>
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(deal.sold / deal.available) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Countdown */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold uppercase">
                      Hurry Up! Offer ends in:
                    </p>

                    <div className="flex gap-2 mt-2">
                      {timeLeft[deal.id] &&
                        Object.entries(timeLeft[deal.id]).map(
                          ([unit, value]) => (
                            <div
                              key={unit}
                              className="bg-gray-100 p-2 rounded-md text-center"
                            >
                              <p className="text-lg font-semibold">{value}</p>
                              <p className="text-xs uppercase">{unit}</p>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealOfTheDay;

// {timeLeft[deal.id] &&
//    Object.entries(timeLeft[deal.id]).map(
//      ([unit, value]) => (
