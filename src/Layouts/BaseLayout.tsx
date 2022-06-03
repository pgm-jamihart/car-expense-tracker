import React from "react";
import { NavBar } from "../components/NavBar";

interface Props {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <NavBar />
      <div className="px-6 w-full h-screen relative overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
