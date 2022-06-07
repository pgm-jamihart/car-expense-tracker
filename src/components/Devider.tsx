import React from "react";

const Devider = () => {
  return (
    <div className="relative w-full min-w-[20rem] flex h-10 items-center justify-center flex-col my-10">
      <span className="bg-skin-white px-10 py-2 absolute">or</span>
      <div className="h-px bg-skin-light_blue w-full"></div>
    </div>
  );
};

export default Devider;
