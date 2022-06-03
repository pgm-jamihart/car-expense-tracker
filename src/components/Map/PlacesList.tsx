import React, { createRef, useEffect, useState } from "react";

import PlaceCard from "./PlaceCard";

interface Props {
  places: any;
  clicked: string | number | null;
}

const PlacesList = ({ places, clicked }: Props) => {
  const [elRefs, setElRefs] = useState<any>([]);

  useEffect(() => {
    const refs = Array(places.length)
      .fill(null)
      .map((_, i) => elRefs[i] || createRef());

    setElRefs(refs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);
  return (
    <div className="mb-8 lg:mb-0 lg:ml-4 lg:h-[31rem]">
      <div className="pb-2 lg:pb-0 lg:pr-2 rounded-md scrollbar flex overflow-x-auto lg:flex-col lg:overflow-y-auto h-full lg:overflow-x-hidden">
        {places?.map((place: any, i: string | number) => (
          <div
            className={`${
              clicked === i
                ? "bg-cyan-700/20 border-2 border-skin-blue"
                : "bg-skin-dark_gray"
            } rounded-md shadow-lg mr-4 min-w-18 h-34 lg:mr-0 lg:mb-4`}
            key={place.place_id}
            ref={elRefs[i]}
          >
            <PlaceCard
              name={place.name}
              address={place.vicinity}
              rating={place.rating ? place.rating + " / 5" : ""}
              openNow={place.opening_hours?.open_now}
              image={place.photos?.[0]?.photo_reference}
              selected={clicked === i}
              refProp={elRefs[i]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesList;
