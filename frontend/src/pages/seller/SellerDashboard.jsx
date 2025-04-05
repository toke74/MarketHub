import React from "react";
import { useSelector } from "react-redux";

const SellerDashboard = () => {
  const { seller } = useSelector((state) => state.seller);
  console.log(seller);
  return (
    <div className="flex items-center justify-center flex-col">
      Dashboard
      <h1>{seller?.vendor?.name}</h1>
      <img
        src={`${seller?.vendor?.storeAvatar?.url}`}
        alt="Seller"
        className=" w-15 h-15  object-cover rounded-full border-3  border-gray-300 mb-5"
      />
      <img
        src={`${seller?.vendor?.storeImage?.url}`}
        alt="Seller"
        className=" w-300 h-44  object-cover mb-5"
      />
    </div>
  );
};

export default SellerDashboard;
