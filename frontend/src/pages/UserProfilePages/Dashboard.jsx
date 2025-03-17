import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-center flex-col">
      Dashboard
      <h1>{user?.user?.name}</h1>
    </div>
  );
};

export default Dashboard;
