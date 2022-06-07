import React, { useState } from "react";
import { NavBar } from "../components/NavBar";

interface Props {
  children: React.ReactNode;
  loggedIn?: boolean;
  carChanged?: boolean;
}

const BaseLayout = ({ children, loggedIn, carChanged }: Props) => {
  return (
    <div className="flex">
      <NavBar loggedIn={loggedIn} carChanged={carChanged} />
      <div className="px-6 w-full h-screen relative overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
