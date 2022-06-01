import React, { useEffect, useState } from "react";
import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { Timeline } from "../components/Timeline";

const TimelinePage = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  useEffect(() => {
    if (!currentCar.id) return;

    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, date, type, total")
        .eq("car_id", currentCar.id);

      if (error) {
        console.log(error);
      }

      if (data) {
        setExpenses(data);
      }
    })();
  }, [currentCar.id]);

  console.log(expenses);

  return (
    <BaseLayout>
      <PageTitle>Timeline</PageTitle>

      {/* create timeline with expenses  */}
      <div className="py-10 lg:py-0 lg:pb-10">
        {!currentCar.id && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {currentCar.id && expenses.length == 0 && (
          <p className="text-center text-gray-500">
            You have no expenses. Please add some.
          </p>
        )}

        {currentCar.id && expenses.length > 0 && (
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
