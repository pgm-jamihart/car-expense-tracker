import React from "react";
import {
  Circle,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Props {
  center: { lat: number; lng: number };
  places: any;
}

const Map = ({ center, places }: Props) => {
  const handleMarkerClick = (place: any) => {
    console.log(place);
  };

  const options = {
    strokeColor: "yellow",
    strokeOpacity: 0.85,
    strokeWeight: 2,
    fillColor: "blue",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 100,
    zIndex: 1,
  };

  return (
    <>
      <LoadScript
        googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          {places?.slice(0, 5).map((place: any) => (
            <>
              <Circle center={center} options={options} />
              <Marker
                key={place.place_id}
                position={place.geometry.location}
                onClick={() => handleMarkerClick(place)}
              />
            </>
          ))}

          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
function setCenter(center: { lat: number; lng: number }): React.ReactNode {
  throw new Error("Function not implemented.");
}
