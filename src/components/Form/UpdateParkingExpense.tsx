import React from "react";

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
  };
}

const UpdateParkingExpense = ({ expense }: Props) => {
  return <div>{expense.date}</div>;
};

export default UpdateParkingExpense;
