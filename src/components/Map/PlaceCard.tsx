import React from "react";

interface Props {
  name: string;
  address: string;
  rating: number;
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
          <img
            className="w-full max-h-14"
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=96&maxheight=96&photo_reference=${image}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
            alt={name}
          />
        ) : (
          <img
            className="w-full max-h-14"
            src="https://via.placeholder.com/96x96"
            alt={name}
          />
        )}
      </div>

      <div className="w-40">
        <h3 className="truncate font-semibold lowercase">{name}</h3>
        <p className="text-sm">{address}</p>
        <div className="flex justify-between">
          <p className="text-sm">{rating} / 5</p>
          <p className="text-sm mr-3">{openNow ? "Open" : "Closed"}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
