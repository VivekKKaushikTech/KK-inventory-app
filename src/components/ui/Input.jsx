import React from "react";

const Input = ({ type, placeholder, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
    />
  );
};

export default Input;