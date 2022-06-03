import React, { useEffect, useRef, useState } from "react";
import { PageTitle } from "../components";
import { Map, PlacesList } from "../components/Map";
import PlaceSelect from "../components/Map/PlaceSelect";
import BaseLayout from "../Layouts/BaseLayout";

const Places = () => {
  const [location, setLocation] = useState("");
  //   const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [type, setType] = useState("gas_station");
  const [places, setPlaces] = useState([]);
  const center = useRef<any>();

  const [clicked, setClicked] = useState<string | number | null>(null);

  // get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //   setCenter({ lat: latitude, lng: longitude });

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
      } catch (error) {
        console.log(error);
      }
    })();
  }, [query]);

  return (
    <BaseLayout>
      <PageTitle>Places</PageTitle>
      <PlaceSelect type={type} setType={setType} />

      <div className="flex flex-col-reverse lg:flex-row-reverse">
        <PlacesList places={places} clicked={clicked} />
        <Map center={center.current} places={places} setClicked={setClicked} />
      </div>
    </BaseLayout>
  );
};

export default Places;
