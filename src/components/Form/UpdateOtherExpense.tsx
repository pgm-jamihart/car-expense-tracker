import React from "react";

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
  };
}

const UpdateOtherExpense = ({ expense }: Props) => {
  return <div>{expense.date}</div>;
};

export default UpdateOtherExpense;
