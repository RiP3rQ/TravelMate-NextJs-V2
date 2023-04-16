import React from "react";

const Button = ({ label, onClick, disabled, outline, small, icon: Icon }) => {
  return (
    <button
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full 
            ${outline ? "bg-white" : "bg-green-600"} 
            ${outline ? "border-black" : "border-green-600"} 
            ${outline ? "text-black" : "text-white"} 
            ${small ? "py-1" : "py-3"} 
            ${small ? "text-sm" : "text-md"} 
            ${small ? "font-light" : "font-semibold"}
            ${small ? "border-[1px]" : "border-2"}
          `}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="absolute left-4 top-3 h-12" />}
      {label}
    </button>
  );
};

export default Button;
