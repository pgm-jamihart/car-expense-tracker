import React from "react";

interface Props {
  name: string;
  address: string;
  rating: string;
  openNow: boolean;
  image: string;
  selected: boolean;
  refProp: any;
}

const PlaceCard = ({
  name,
  address,
  rating,
  openNow,
  image,
  selected,
  refProp,
}: Props) => {
  if (selected) {
    refProp?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div
      className={`flex h-32 items-center ${selected ? "text-skin-white" : ""}`}
    >
      <div className="w-24 mx-2">
        {image ? (
          <div className="w-full h-24 overflow-hidden rounded-md">
            <img
              className="w-full h-full"
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=96&maxheight=96&photo_reference=${image}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
              alt={name}
            />
          </div>
        ) : (
          <div className="w-full h-24 overflow-hidden rounded-md">
            <img
              className="w-full h-full"
              src="https://via.placeholder.com/96x96"
              alt={name}
            />
          </div>
        )}
      </div>

      <div
        className={`${
          selected ? "text-skin-gray" : "text-skin-light_gray"
        } w-40 `}
      >
        <h3
          className={`${
            selected ? "text-skin-black" : "text-skin-white"
          } mb-2 text-base  truncate font-semibold capitalize`}
        >
          {name}
        </h3>
        <p className="text-sm">{address}</p>
        <div className="flex justify-between mt-1">
          <p className="text-sm">{rating}</p>
          <p
            className={`text-sm font-medium border py-px px-2 rounded-sm  mr-3 ${
              openNow
                ? "text-skin-dark_green border-skin-dark_green bg-green-400/20"
                : "text-skin-red border-skin-red bg-red-700/25"
            }`}
          >
            {openNow ? "Open" : "Closed"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
