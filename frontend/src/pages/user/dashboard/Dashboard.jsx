import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // console.log(user.user.avatar.url);
  return (
    <div className="flex items-center justify-center flex-col">
      Dashboard
      <h1>{user?.user?.name}</h1>
      <img
        src={`${user?.user?.avatar?.url}`}
        alt="User"
        className=" w-30 h-30  object-cover rounded-full border-3  border-gray-300"
      />
    </div>
  );
};

export default Dashboard;
