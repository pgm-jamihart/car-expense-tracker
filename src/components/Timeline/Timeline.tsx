import React from "react";

interface Props {
  expenses: any[];
}

const Timeline = ({ expenses }: Props) => {
  return (
    <div>
      {expenses.map((expense, index) => {
        return (
          <div key={index}>
            <p>{expense.date}</p>
            <p>{expense.type}</p>
            <p>{expense.total}</p>
            <p>{expense.category.type}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
