import React, { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  type: string;
  setType: (type: string) => void;
}

const PlaceSelect = ({ type, setType }: Props) => {
  return (
    <div className="my-8">
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value={"gas_station"}>Gas Station</MenuItem>
          <MenuItem value={"parking"}>Parking</MenuItem>
          <MenuItem value={"car_repair"}>Garage</MenuItem>
          <MenuItem value={"car_wash"}>Car Wash</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default PlaceSelect;
