import React from "react";
import classNames from "classnames";
import { PrimaryButtonProps } from "../../interfaces/interfacesComponents";

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
