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

  const chartDataBar = [
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Free Cash Flow",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ];

  const optionsBar = {
    chart: {
      width: "100%",
      height: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: { 
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
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
        setChartData(data.map((item) => item.total));
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
          options={optionsBar}
          series={chartDataBar}
          type="bar"
        />
      </div>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};
export default Dashboard;
