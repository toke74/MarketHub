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
        className=" w-30 h-30  object-cover rounded-full border-3  border-gray-300"
      />
    </div>
  );
};

export default SellerDashboard;
