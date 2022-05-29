import React, { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import PlaceCard from "./PlaceCard";

interface Props {
  type: string;
  setType: (type: string) => void;
  places: any;
}

const PlacesList = ({ type, setType, places }: Props) => {
  return (
    <div className="mb-8">
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value={"gas_station"}>Gas Station</MenuItem>
          <MenuItem value={"parking"}>Parking</MenuItem>
          <MenuItem value={"car_repair"}>Garage</MenuItem>
          <MenuItem value={"car_wash"}>Car Wash</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {places?.slice(0, 5).map((place: any) => (
          <Grid item xs={12} container spacing={3} key={place.place_id}>
            <PlaceCard id={place.id} name={place.name} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PlacesList;
