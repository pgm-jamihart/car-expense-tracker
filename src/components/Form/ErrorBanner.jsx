import React from "react";
import { BiErrorAlt } from "react-icons/bi";

const ErrorBanner = ({ error }) => {
  return (
    <div className="mb-4 py-2 rounded-md flex items-center bg-red-600 px-4">
      <span className="text-lg mr-2 text-white flex items-center justify-center">
        <BiErrorAlt />
      </span>
      <p className="text-white font-bold">{error}</p>
    </div>
  );
};

export default ErrorBanner;
