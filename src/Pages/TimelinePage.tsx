import React, { useEffect, useState } from "react";
import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { Timeline } from "../components/Timeline";

import { FiMoreVertical } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const TimelinePage = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [currentCar, setCurrentCar] = useState<any>({});
  const limit = 6;
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(limit);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    setFrom(from + limit);
    setTo(to + limit);
  };

  const handlePrev = () => {
    setFrom(from - limit);
    setTo(to - limit);
  };

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  useEffect(() => {
    if (!currentCar.id) return;

    (async () => {
      const { data: expensesCount, error: expensesErrorCount } = await supabase
        .from("expenses")
        .select("id")
        .eq("car_id", currentCar.id);

      if (expensesErrorCount) {
        console.log(expensesErrorCount);
      }

      if (expensesCount) {
        setCount(expensesCount.length);
      }

      // return all expenses for the current car with the category type
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("car_id", currentCar.id)
        .range(from, to)
        .order("date", {
          ascending: false,
        });

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
  }, [currentCar.id, from, to]);

  return (
    <BaseLayout>
      <PageTitle>Timeline</PageTitle>

      {/* create timeline with expenses  */}
      <div className="pb-10 lg:py-0 lg:pb-10">
        {!currentCar.id && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {currentCar.id && expenses.length === 0 && (
          <p className="text-center text-gray-500">
            You have no expenses. Please add some.
          </p>
        )}

        {currentCar.id && expenses.length > 0 && (
          <div>
            <div className="mb-8 flex items-center justify-end">
              <button
                className={`${
                  open ? "bg-skin-dark_blue" : "bg-slate-400"
                } ml-4 mt-2 p-1  rounded-md`}
              >
                {!open && (
                  <FiMoreVertical
                    className="text-2xl text-skin-white cursor-pointer"
                    onClick={() => setOpen(!open)}
                  />
                )}

                {open && (
                  <IoMdClose
                    className="text-2xl text-skin-white cursor-pointer"
                    onClick={() => setOpen(!open)}
                  />
                )}
              </button>
            </div>

            <Timeline expenses={expenses} open={open} />

            <div className="mt-8">
              {from > 0 && (
                <button
                  className="mr-4 hover:opacity-80 transition-opacity duration-200 ease-in-out bg-skin-blue py-1 px-4 rounded-md text-white font-semibold"
                  onClick={handlePrev}
                >
                  prev
                </button>
              )}

              {to < count && (
                <button
                  className="hover:opacity-80 transition-opacity duration-200 ease-in-out bg-skin-blue py-1 px-4 rounded-md text-white font-semibold"
                  onClick={handleNext}
                >
                  next
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default TimelinePage;
