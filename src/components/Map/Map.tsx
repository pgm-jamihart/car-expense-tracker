import React from "react";
import { Circle, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
      <LoadScript
        googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
      >
        <GoogleMap
          mapContainerClassName="mapContainerClassName"
          //   mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          <>
            {center &&
              places?.map((place: any, i: number | string) => (
                <div key={place.place_id}>
                  <Circle center={center} options={options} />
                  <Marker
                    key={place.place_id}
                    position={place.geometry.location}
                    onClick={() => handleMarkerClick(i)}
                  />
                </div>
              ))}
          </>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
