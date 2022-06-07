import React from "react";
import { BiMicrophone } from "react-icons/bi";

interface SpeechlyExampleTextProps {
  children: React.ReactNode;
}

const SpeechlyExampleText = ({ children }: SpeechlyExampleTextProps) => {
  return (
    <div className=" flex items-center bg-skin-light_blue pl-4 text-skin-dark_blue py-1 rounded-sm mb-4">
      <span className="flex items-center justify-center mr-2">
        <BiMicrophone />
      </span>
      <span>{children}</span>
    </div>
  );
};

export default SpeechlyExampleText;
