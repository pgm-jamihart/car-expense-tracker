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
      className={`${btnClass} border-skin-light_blue hover:border-skin-blue h-14 w-14 flex items-center justify-center border-2 hover:bg-skin-light_blue text-skin-blue font-bold py-2 px-4 rounded-full text-2xl hover:text-skin-blue ease-in-out duration-200 `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SignUpWithButton;
