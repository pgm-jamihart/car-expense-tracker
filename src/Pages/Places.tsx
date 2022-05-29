import React, { useEffect, useState } from "react";
import { PageTitle } from "../components";
import { Map, PlacesList } from "../components/Map";
import BaseLayout from "../Layouts/BaseLayout";

const Places = () => {
  const [location, setLocation] = useState("");
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [type, setType] = useState("gas_station");
  const [places, setPlaces] = useState([]);

  // get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
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
      try {
        const response = await fetch(query, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data.results);
        setPlaces(data.results);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [query]);

  return (
    <BaseLayout>
      <PageTitle>Places</PageTitle>

      <PlacesList type={type} setType={setType} places={places} />
      <Map center={center} places={places} />
    </BaseLayout>
  );
};

export default Places;
