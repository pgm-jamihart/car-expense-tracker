import React from "react";
import { NavBar } from "../components/NavBar";

interface Props {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default BaseLayout;
