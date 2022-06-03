import React from "react";
import { BiErrorAlt } from "react-icons/bi";

interface ErrorMessageProps {
  errorText: string;
}

const ErrorMessage = ({ errorText }: ErrorMessageProps) => {
  return (
    <div className="flex items-center mt-2">
      <span className="mr-2 text-skin-red flex items-center justify-center">
        <BiErrorAlt />
      </span>
      <span className="text-skin-red text-xs font-semibold">{errorText}</span>
    </div>
  );
};

export default ErrorMessage;
