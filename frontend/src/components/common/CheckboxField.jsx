import React from "react";

const CheckboxField = ({ label, register, name, className = "" }) => {
  return (
    <label
      className={`flex items-center cursor-pointer text-sm text-text ${className}`}
    >
      <input type="checkbox" {...register(name)} className="mr-2" />
      {label}
    </label>
  );
};

export default CheckboxField;
