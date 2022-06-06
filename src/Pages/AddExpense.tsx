import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PushToTalkButton } from "@speechly/react-ui";
import { BigTranscript } from "@speechly/react-ui";

import BaseLayout from "../Layouts/BaseLayout";
import { PageTitle } from "../components";
import {
  FuelExpenseForm,
  InsuranceExpenseForm,
  MaintenanceExpenseForm,
  OtherExpenseForm,
  ParkingExpenseForm,
  ReminderFrom,
} from "../components/Form";

const AddExpense = () => {
  const location: any = useLocation();

  const switchFormAction = (action: string) => {
    switch (location.state.action) {
      case "Fuel":
        return <FuelExpenseForm />;
      case "Insurance":
        return <InsuranceExpenseForm />;
      case "Maintenance":
        return <MaintenanceExpenseForm />;
      case "Parking":
        return <ParkingExpenseForm />;
      case "Other":
        return <OtherExpenseForm />;
      case "Reminder":
        return <ReminderFrom />;
    }
  };

  return (
    <BaseLayout>
      <PageTitle>{`Add ${location.state.action} ${
        location.state.action === "Reminder" ? "" : "expense"
      }`}</PageTitle>

      <div className="z-[101] bg-skin-dark_gray relative pl-2 rounded-sm">
        <BigTranscript
          highlightColor="#FCA311"
          backgroundColor="none"
          formatText={true}
        />
      </div>

      {switchFormAction(location.state.action) ? (
        switchFormAction(location.state.action)
      ) : (
        <div>
          <h1>No form found</h1>
        </div>
      )}

      <div className="z-[101] fixed right-10 bottom-[1.85rem]">
        <PushToTalkButton size="60px"></PushToTalkButton>
      </div>
    </BaseLayout>
  );
};

export default AddExpense;
