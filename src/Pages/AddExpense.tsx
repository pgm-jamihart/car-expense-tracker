import React, { useState } from "react";
import BaseLayout from "../Layouts/BaseLayout";
import { useLocation } from "react-router-dom";
import { PageTitle } from "../components";
import { FuelExpenseForm, ParkingExpenseForm } from "../components/Form";

const AddExpense = () => {
  const location: any = useLocation();

  const switchFormAction = (action: string) => {
    switch (location.state.action) {
      case "Fuel":
        return <FuelExpenseForm />;
      // case "Insurance":
      // // return <Insurance />;
      // case "Maintainence":
      // // return <Maintainence />;
      case "Parking":
        return <ParkingExpenseForm />;
      // case "Other":
      // // return <Other />;
    }
  };

  return (
    <BaseLayout>
      <PageTitle>{`Add ${location.state.action} expense`}</PageTitle>

      {switchFormAction(location.state.action) ? (
        switchFormAction(location.state.action)
      ) : (
        <div>
          <h1>No form found</h1>
        </div>
      )}
    </BaseLayout>
  );
};

export default AddExpense;
