import React from "react";
import { PrimaryButton } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const Garage = () => {
  const handleAddCar = () => {
    console.log("Add car");
  };

  return (
    <BaseLayout>
      <div className="flex flex-col justify-between h-full pb-8">
        <h1 className="text-center mt-6 md:text-left">My Garage</h1>

        <PrimaryButton
          onClick={handleAddCar}
          className="bg-skin-dark_blue md:max-w-xs"
          type="button"
        >
          Add car
        </PrimaryButton>
      </div>
    </BaseLayout>
  );
};

export default Garage;
