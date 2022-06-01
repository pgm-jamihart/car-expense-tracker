import React, { useEffect, useState } from "react";
import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { Timeline } from "../components/Timeline";

const TimelinePage = () => {
  const [expenses, setExpenses] = useState<any[]>([]);

  const carId = localStorage.getItem("car");
  const carIdNumber = Number(carId);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, date, type, total")
        .eq("car_id", carIdNumber);

      if (error) {
        console.log(error);
      }

      if (data) {
        setExpenses(data);
      }
    })();
  }, [carIdNumber]);

  console.log(expenses);

  return (
    <BaseLayout>
      <PageTitle>Timeline</PageTitle>

      {/* create timeline with expenses  */}
      <div className="py-10 lg:py-0 lg:pb-10">
        {!carIdNumber && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {carIdNumber && expenses.length == 0 && (
          <p className="text-center text-gray-500">
            You have no expenses. Please add some.
          </p>
        )}

        {carIdNumber && expenses.length > 0 && (
          <div>
            <Timeline expenses={expenses} />
          </div>
        )}
      </div>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default TimelinePage;
