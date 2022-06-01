import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../../config/supabaseClient";

interface BarProps {
  active: boolean;
}

const BarChart = ({ active }: BarProps) => {
  // get the data from the database and set it to the state
  const [chartData, setChartData] = useState<any[]>([]);
  const [limit, setLimit] = useState(window.innerWidth > 768 ? 10 : 5);

  const carId = localStorage.getItem("car");
  const carIdNumber = Number(carId);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, date, total, type")
        .eq("car_id", carIdNumber)
        .limit(limit);

      if (error) {
        console.log(error);
      }

      if (data) {
        // display data per day
        const dataPerDay = data.reduce((acc, curr) => {
          const date = new Date(curr.date);
          const day = date.getDate();
          let month = new Intl.DateTimeFormat("en", {
            month: "short",
          }).format(date);

          const year = date.getFullYear();
          const dateString = `${day} ${month} ${year}`;
          if (!acc[dateString]) {
            acc[dateString] = {
              x: dateString,
              y: curr.total,
            };
          } else {
            acc[dateString].total += curr.total;
          }
          return acc;
        }, {});

        console.log(dataPerDay);

        // sort the data per day
        const sortedDataPerDay = Object.values(dataPerDay).sort(
          (a: any, b: any) => {
            return new Date(a.x).getTime() - new Date(b.x).getTime();
          }
        );

        setChartData(sortedDataPerDay);
      }
    })();
  }, [carIdNumber, limit]);

  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      setLimit(5);
    } else {
      setLimit(10);
    }
  });

  //   window.addEventListener("DOMContentLoaded", () => {
  //     if (window.innerWidth < 768) {
  //       setLimit(5);
  //     } else {
  //       setLimit(10);
  //     }
  //   });

  const chartDataBar = [
    {
      data: chartData,
    },
  ];

  const optionsBar = {
    chart: {
      type: "bar" as "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },

    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      tickPlacement: "on",
    },
    yaxis: {},
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return "€ + ";
          },
        },
      },
    },
  };

  return (
    <div
      className={`${
        !active ? "w-full lg:w-3/5 lg:px-6" : "hidden lg:block lg:w-3/5 lg:pl-6"
      }`}
    >
      <h3 className="my-4 ml-4">Expenses per day</h3>
      <Chart
        className=" md:flex md:items-center md:justify-center shadow-lg border border-slate-200 w-full md:h-96"
        //md:max-w-screen-sm md:ml-4 mt-4 md:mt-0
        options={optionsBar}
        series={chartDataBar}
        type="bar"
        height={"90%"}
      />
    </div>
  );
};

export default BarChart;
