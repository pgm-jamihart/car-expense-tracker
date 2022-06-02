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
      // return all expenses for the current car with the category type
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("id, date, total, category_id")
        .eq("car_id", currentCar.id);

      if (expensesError) {
        console.log(expensesError);
      }

      if (expenses) {
        const categoryIds = expenses.map((expense) => expense.category_id);

        const promises = categoryIds.map(async (categoryId) => {
          const { data, error } = await supabase
            .from("categories")
            .select("id, type")
            .eq("id", categoryId);

          if (error) {
            console.log(error);
          }

          if (data) {
            return data[0];
          }
        });

        const categories = await Promise.all(promises);

        setExpenses(
          expenses.map((expense, index) => ({
            ...expense,
            category: categories[index],
          }))
        );
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
