// import React from "react";

// const Button = ({ text, isLoading, type = "submit", className = "" }) => {
//   return (
//     <button
//       type={type}
//       className={`w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary cursor-pointer transition ${className}`}
//       disabled={isLoading}
//     >
//       {isLoading ? (
//         <img src="loading1.gif" alt="loading" className="w-8 h-8 mx-auto" />
//       ) : (
//         text
//       )}
//     </button>
//   );
// };

// export default Button;
import React from "react";

const Button = ({
  text,
  isLoading,
  type = "submit",
  className = "",
  onClick,
  color = "primary", // Default color
}) => {
  const bgColor = {
    primary: "bg-primary hover:bg-secondary",
    secondary: "bg-secondary hover:bg-primary",
    cancel: "bg-gray-300 hover:bg-gray-200",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      type={type}
      className={`w-full text-white py-2 rounded-lg cursor-pointer transition ${
        bgColor[color] || bgColor.primary
      } ${className}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <img src="loading.gif" alt="loading" className="w-8 h-8 mx-auto" />
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
