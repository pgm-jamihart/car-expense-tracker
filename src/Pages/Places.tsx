import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { PageTitle } from "../components";
import { Map, PlacesList } from "../components/Map";
import PlaceSelect from "../components/Map/PlaceSelect";


const Places = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("gas_station");
  const [places, setPlaces] = useState([]);
  const center = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState<string | number | null>(null);

  // get current location
  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (latitude && longitude) {
            center.current = { lat: latitude, lng: longitude };
          }
          setLocation(`${latitude}%2C${longitude}`);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const query = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=${type}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://still-bastion-49630.herokuapp.com/" + query,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setPlaces(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [query]);

  return (
    <>
      <PageTitle>Places</PageTitle>
      <PlaceSelect type={type} setType={setType} />

      {loading && (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-skin-white z-20 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      <div className="flex flex-col-reverse lg:flex-row-reverse">
        <PlacesList places={places} clicked={clicked} />
        <Map center={center.current} places={places} setClicked={setClicked} />
      </div>
    </>
  );
};

export default Places;
