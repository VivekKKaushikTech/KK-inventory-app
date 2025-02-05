import React from "react";

const Input = ({ type, placeholder, value, maxLength, onChange, className }) => {
  return (
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
    />
  );
};

export default Input;