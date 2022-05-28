import React, { useEffect, useState } from "react";

import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import Chart from "react-apexcharts";
import { supabase } from "../config/supabaseClient";

const Dashboard = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);

  const options = {
    chart: {
      width: "100%",
      height: "100%",
    },
    legend: {
      position: "bottom" as "bottom",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
            height: "100%",
          },
          legend: {
            position: "bottom" as "bottom",
            horizontalAlign: "center" as "center",
          },
        },
      },
    ],
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("type, total, id")
        .eq("car_id", 19)
        .order("id", {
          ascending: true,
        });
      if (error) {
        console.log(error);
      } else {
        setChartData(data.map((item: any) => item.total));
        setLabels(data.map((item) => item.type));
      }
    })();
  }, []);

  return (
    <BaseLayout>
      <PageTitle>Dashboard</PageTitle>

      <div className="flex item-start md:justify-start justify-center w-full flex-wrap">
        <Chart
          className="md:flex md:items-center md:justify-center bg-skin-light_blue h-96 md:max-w-screen-sm md:mr-4 mb-4 md:mb-0"
          options={options}
          series={chartData}
          type="donut"
        />
        <Chart
          className="md:flex md:items-center md:justify-center bg-skin-light_blue  md:max-w-screen-sm md:ml-4 mt-4 md:mt-0"
          options={options}
          series={chartData}
          type="donut"
        />
      </div>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};
export default Dashboard;
