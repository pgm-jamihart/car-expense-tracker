import React from "react";

interface Props {
  type: string;
  setType: (type: string) => void;
}

const PlaceSelect = ({ type, setType }: Props) => {
  return (
    <div className="my-8">
      <select
        className="bg-skin-black rounded-md mt-2 py-1 px-4 text-skin-white cursor-pointer hover:bg-skin-dark_gray transition-all duration-200 ease-in-out"
        name="type"
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value={"gas_station"}>Gas Station</option>
        <option value={"parking"}>Parking</option>
        <option value={"car_repair"}>Garage</option>
        <option value={"car_wash"}>Car Wash</option>
      </select>
    </div>
  );
};

export default PlaceSelect;
