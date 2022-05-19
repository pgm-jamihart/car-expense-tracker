import React from "react";

const Devider = () => {
  return (
    <div className="relative min-w-full flex h-10 items-center justify-center flex-col my-10">
      <span className="bg-white px-10 py-2 absolute">or</span>
      <div className="h-px bg-slate-200 w-full"></div>
    </div>
  );
};

export default Devider;
