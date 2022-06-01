import React, { useEffect, useState } from "react";

import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { BarChart, DonutChart, SparkLineChart } from "../components/Dashboard";

const Dashboard = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [active, setActive] = useState(true);
  // calculate the total expenses
  const totalExpenses = chartData.reduce((acc, curr) => acc + curr, 0);

  const carId = localStorage.getItem("car");
  const carIdNumber = Number(carId);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("type, total, id")
        .eq("car_id", carIdNumber)
        .order("id", {
          ascending: true,
        });
      if (error) {
        console.log(error);
      } else {
        setChartData(data.map((item) => item.total));
        setLabels(data.map((item) => item.type));
      }
    })();
  }, [carIdNumber]);

  return (
    <BaseLayout>
      <PageTitle>Dashboard</PageTitle>

      <div className="py-10 lg:py-0 lg:pb-10">
        {!carIdNumber && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {carIdNumber && chartData.length > 0 && (
          <div>
            <div className="mb-10 shadow-lg py-2 border border-slate-200">
              <SparkLineChart
                totalExpenses={totalExpenses}
                carIdNumber={carIdNumber}
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

        {carIdNumber && chartData.length === 0 && (
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
