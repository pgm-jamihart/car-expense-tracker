import React from "react";

interface Props {
  currentCar: {
    id: number;
    brand: string;
    model: string;
    year: number;
    mileage: number;
  };
}

const CarDetails = ({ currentCar }: Props) => {
  return (
    <div className="">
      <div className="flex items-baseline">
        <h1>{currentCar.brand}</h1>
        <span className="ml-2 text-xl font-light md:italic block md:inline ">
          {currentCar.model}
        </span>
      </div>

      <div className="flex items-center justify-center  bg-slate-500/50 rounded-md py-2">
        <img className="w-1/2" src="./car_illustration.png" alt="car" />
      </div>

      <div className="mt-1">
        <div>
          <span className="text-xs block text-skin-blue">Mileage</span>
          <span className="text-4xl font-bold number">
            {currentCar.mileage}
          </span>
          <span className="text-xs ml-2 text-skin-blue">km</span>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
