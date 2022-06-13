import React from "react";
import classNames from "classnames";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type: "submit" | "button" | "reset" | undefined;
  className?: string;
}

const PrimaryButton = ({
  children,
  onClick,
  disabled,
  type,
  className = "",
}: PrimaryButtonProps) => {
  const btnClass = classNames("button", className, {
    "cursor-not-allowed opacity-50": disabled,
  });

  return (
    <button
      type={type}
      className={`${btnClass} hover:opacity-70 text-skin-white font-normal text-sm w-full py-4 rounded-md ease-out duration-200`}
      onClick={onClick}
    >
      <span className="text-base">{children}</span>
    </button>
  );
};

export default PrimaryButton;
