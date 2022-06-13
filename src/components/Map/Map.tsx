import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface Props {
  center: any;
  places: any;
  setClicked: (value: string | number) => void;
}

const Map = ({ center, places, setClicked }: Props) => {
  const handleMarkerClick = (index: string | number) => {
    setClicked(index);
  };

  const options = {
    fillColor: "blue",
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 100,
    zIndex: 1,
  };

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerClassName="mapContainerClassName"
        center={center}
        zoom={14}
      >
        <>
          {center &&
            places?.map((place: any, i: number | string) => (
              <div key={place.place_id}>
                <Marker
                  position={center}
                  options={options}
                  icon={{
                    url: `https://cdn1.iconfinder.com/data/icons/travello-map-navigation/64/Nearby-512.png`,
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
                <Marker
                  key={place.place_id}
                  position={place.geometry.location}
                  onClick={() => handleMarkerClick(i)}
                />
              </div>
            ))}
        </>
      </GoogleMap>
    </div>
  );
};

export default Map;
