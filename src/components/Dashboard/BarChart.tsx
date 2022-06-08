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
        .select("id, date, total, category_id")
        .eq("car_id", currentCar.id)
        .limit(limit)
        .order("date", {
          ascending: true,
        })
        .lt("date", "2022-05-31")
        .gt("date", "2022-05-1");

      if (error) {
        console.log(error);
      }

      if (data) {
        const categoryIds = data.map((expense) => expense.category_id);

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

        const expensesPerCategory = data.map((expense, index) => ({
          ...expense,
          category: categories[index],
        }));

        const weeks = [
          {
            name: "Week 1",
            from: 1,
            to: 7,
          },
          {
            name: "Week 2",
            from: 8,
            to: 14,
          },
          {
            name: "Week 3",
            from: 15,
            to: 21,
          },
          {
            name: "Week 4",
            from: 22,
            to: 28,
          },
          {
            name: "Week 5",
            from: 29,
            to: 31,
          },
        ];

        console.log(expensesPerCategory);

        const expensesPerWeek = weeks.map((week) => {
          const expenses = expensesPerCategory.filter(
            (expense) =>
              expense.date.split("-")[2] >= week.from &&
              expense.date.split("-")[2] <= week.to
          );

          const total = expenses.reduce(
            (total, expense) => total + expense.total,
            0
          );

          return {
            x: week.name,
            y: total,
          };
        });

        console.log(expensesPerWeek);
        setChartData(expensesPerWeek);
      }
    })();
  }, [currentCar.id, limit]);

  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      setLimit(5);
    } else {
      setLimit(10);
    }
  });

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
            return "€  ";
          },
        },
      },
    },
  };

  return (
    <div
      className={`${
        !active ? "w-full lg:w-3/5 lg:pl-6" : "hidden lg:block lg:w-3/5 lg:pl-6"
      }`}
    >
      <h3 className="my-4 ml-4">Expenses per day</h3>
      <Chart
        className=" md:flex md:items-center md:justify-center shadow-lg border border-slate-200 w-full h-96 md:h-96 rounded-md"
        //md:max-w-screen-sm md:ml-4 mt-4 md:mt-0
        options={optionsBar}
        series={chartDataBar}
        type="bar"
        height={"80%"}
      />
    </div>
  );
};

export default BarChart;
