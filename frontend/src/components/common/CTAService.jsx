import React from "react";
import {
  FaShippingFast,
  FaRocket,
  FaPhone,
  FaUndo,
  FaTicketAlt,
} from "react-icons/fa";

const CTAService = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-12 md:flex gap-4">
        {/* CTA */}
        <div className="relative w-full max-w-lg mx-auto">
          <img
            src="images/cta-banner.jpg"
            alt="Summer Collection"
            className="w-full h-full object-cover rounded-md shadow-md"
          />
          <div
            className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center  transform -translate-x-1/2 -translate-y-1/2
          bg-white/75 w-fit py-3 px-5 md:p-10 rounded-md cursor-pointer"
          >
            <p className="bg-gray-900 text-white text-xs md:text-lg uppercase font-semibold px-3 py-1 rounded mb-4">
              25% Discount
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 text-center">
              Summer Collection
            </h2>
            <p className="text-gray-500 text-sm md:text-lg mb-4">
              Starting @ $10
            </p>
            <button className="text-primary text-sm md:text-xl uppercase font-bold cursor-pointer">
              Shop Now
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="">
          <h2 className="text-lg font-bold uppercase text-gray-700 mb-6 border-b border-gray-100 pb-3">
            Our Services
          </h2>
          <div className="p-5 md:w-[320px] xl:w-[400px] border border-gray-200 mb-7 rounded-lg">
            <ServiceItem
              icon={
                <FaShippingFast className="text-primary  text-3xl transition duration-300 group-hover:text-gray-900" />
              }
              title="Worldwide Delivery"
              desc="For Order Over $100"
            />

            <ServiceItem
              icon={
                <FaRocket className="text-primary text-3xl transition duration-300 group-hover:text-gray-900" />
              }
              title="Next Day Delivery"
              desc="UK Orders Only"
            />

            <ServiceItem
              icon={
                <FaPhone className="text-primary text-3xl transition duration-300 group-hover:text-gray-900" />
              }
              title="Best Online Support"
              desc="Hours: 8AM - 11PM"
            />

            <ServiceItem
              icon={
                <FaUndo className="text-primary text-3xl transition duration-300 group-hover:text-gray-900" />
              }
              title="Return Policy"
              desc="Easy & Free Return"
            />

            <ServiceItem
              icon={
                <FaTicketAlt className="text-primary text-3xl transition duration-300 group-hover:text-gray-900" />
              }
              title="30% Money Back"
              desc="For Orders Over $100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Item Component
const ServiceItem = ({ icon, title, desc }) => {
  return (
    <div className="flex  items-center gap-4 group pb-3 pl-10 ">
      <div className="pr-1 text-3xl">{icon}</div>
      <div>
        <h3 className="text-gray-700 font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </div>
  );
};

export default CTAService;
