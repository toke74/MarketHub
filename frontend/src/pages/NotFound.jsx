// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // React Icon for a warning triangle

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center  items-center ">
      <div className="text-center">
        {/* Warning Icon */}
        <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />

        {/* 404 Heading */}
        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-500 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block bg-primary text-white py-2 px-6 rounded-lg hover:bg-secondary transition"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
