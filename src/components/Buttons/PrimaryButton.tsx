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
    <button type={type} className={btnClass} onClick={onClick}>
      <span className="text-base">{children}</span>
    </button>
  );
};

export default PrimaryButton;
