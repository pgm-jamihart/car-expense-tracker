import React from "react";

interface Props {
  id: number;
  name: string;
}

const PlaceCard = ({ id, name }: Props) => {
  return <div>{name}</div>;
};

export default PlaceCard;
