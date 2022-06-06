import React from "react";
import Chart from "react-apexcharts";

interface DonutChartProps {
  labels: any[];
  chartData: any[];
  active?: boolean;
}

const DonutChart = ({ labels, chartData, active }: DonutChartProps) => {
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
  return (
    <div
      className={`${active ? "w-full lg:w-2/5 " : "hidden lg:block lg:w-2/5 "}`}
    >
      <h3 className="my-4 ml-4">Expenses in Total</h3>
      <div
        className="h-96 pt-8 md:pt-0 bg-skin-light_blue rounded-md w-full md:flex md:items-center md:justify-center"
        //md:max-w-screen-sm md:mr-4 mb-4 md:mb-0
      >
        <Chart
          className="h-full w-full md:h-2/3 md:w-2/3 lg:w-full lg:h-full md:flex md:items-center md:justify-center"
          options={options}
          series={chartData}
          type="donut"
        />
      </div>
    </div>
  );
};

export default DonutChart;
