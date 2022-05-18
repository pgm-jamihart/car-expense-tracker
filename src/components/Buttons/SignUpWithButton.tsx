import React from "react";
import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

const SignUpWithButton = ({ children, onClick, disabled }: ButtonProps) => {
  const btnClass = classNames("button", {
    "cursor-not-allowed opacity-50": disabled,
  });

  return (
    <button
      className={`${btnClass} border-blue-300 hover:border-blue-700 h-14 w-14 flex items-center justify-center border-2 hover:bg-blue-400 text-blue-500 font-bold py-2 px-4 rounded-full text-2xl hover:text-white ease-in-out duration-200 `}
      onClick={onClick}
    >
      <span className="text-base font-bold">{children}</span>
    </button>
  );
};

export default SignUpWithButton;
