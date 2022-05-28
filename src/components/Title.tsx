import React from "react";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return <h1 className="text-center my-6 md:text-left">{children}</h1>;
};

export default Title;
