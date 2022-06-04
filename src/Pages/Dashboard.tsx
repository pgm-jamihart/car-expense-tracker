import React, { useEffect, useState } from "react";

import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { BarChart, DonutChart, SparkLineChart } from "../components/Dashboard";

interface Props {
  loggedIn: boolean;
}

const Dashboard = ({ loggedIn }: Props) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [active, setActive] = useState(true);
  // calculate the total expenses
  const totalExpenses = chartData.reduce((acc, curr) => acc + curr, 0);

  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!currentCar.id) return;

    (async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, type");

      if (categoriesError) {
        console.log(categoriesError);
      }

      if (categories) {
        const categoryIds = categories.map((category) => category.id);
        const categoryTypes = categories.map((category) => category.type);

        const promises = categoryIds.map(async (categoryId, index) => {
          const { data, error } = await supabase
            .from("expenses")
            .select("total")
            .eq("category_id", categoryId)
            .eq("car_id", currentCar.id);

          if (error) {
            console.log(error);
          }

          if (data) {
            const total = data.reduce((acc, curr) => acc + curr.total, 0);
            return {
              id: categoryId,
              type: categoryTypes[index],
              total,
            };
          }
        });

        const data = await Promise.all(promises);

        setLabels(data.map((item) => item?.type));
        setChartData(data.map((item) => item?.total));
      }
    })();
  }, [currentCar.id]);

  return (
    <BaseLayout>
      <PageTitle>Dashboard</PageTitle>

      <div className="py-10 lg:py-0 lg:pb-10">
        {!currentCar.id && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {currentCar.id && chartData.length > 0 && (
          <div>
            <div className="mb-10 shadow-lg py-2 border border-slate-200">
              <SparkLineChart
                totalExpenses={totalExpenses}
                carIdNumber={currentCar.id}
              />
            </div>
            <div className="min-h-[24rem] flex item-start md:justify-start justify-center w-full flex-wrap">
              <div className="lg:hidden">
                <button className="mr-8" onClick={() => setActive(true)}>
                  Donut
                </button>
                <button onClick={() => setActive(false)}>Bar</button>
              </div>

              <DonutChart
                active={active}
                labels={labels}
                chartData={chartData}
              />

              <BarChart active={active} />
            </div>
          </div>
        )}

        {currentCar.id && chartData.length === 0 && (
          <p className="text-center text-gray-500">
            You have no expenses for this car.
          </p>
        )}
      </div>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};
export default Dashboard;
