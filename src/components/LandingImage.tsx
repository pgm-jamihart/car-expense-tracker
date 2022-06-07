import React from "react";

const LandingImage = () => {
  return (
    <div className="bg-skin-light_gray px-8 py-20 lg:w-1/2 md:block">
      <h1 className="text-3xl font-medium text-center text-skin-white">
        Welcome to the expense car tracker app.
      </h1>

      <div className="lg:flex items-center justify-center">
        <img
          alt="car"
          src="./auth_image.png"
          className="hidden md:block w-full rounded-lg mt-8 max-h-31 lg:max-w-3xl"
        />
      </div>
    </div>
  );
};

export default LandingImage;
