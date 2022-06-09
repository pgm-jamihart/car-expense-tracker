import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";

import Chart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, compareAsc } from "date-fns";
import { BsFilter } from "react-icons/bs";

interface BarProps {
  active: boolean;
  carId: number;
}

const BarChart = ({ active, carId }: BarProps) => {
  // get the data from the database and set it to the state
  const [chartData, setChartData] = useState<any[]>([]);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [filterByMonth, setFilterByMonth] = useState(false);

  // value begin of the month
  const valueBeginOfMonth = format(
    new Date(datePickerValue.getFullYear(), datePickerValue.getMonth(), 1),
    "yyyy-MM-dd"
  );

  // value end of the month
  const valueEndOfMonth = format(
    new Date(datePickerValue.getFullYear(), datePickerValue.getMonth() + 1, 0),
    "yyyy-MM-dd"
  );

  //value begin of the year
  const valueBeginOfYear = format(
    new Date(datePickerValue.getFullYear(), 0, 1),
    "yyyy-MM-dd"
  );

  // value end of the year
  const valueEndOfYear = format(
    new Date(datePickerValue.getFullYear(), 11, 31),
    "yyyy-MM-dd"
  );

  useEffect(() => {
    if (!carId) return;

    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, date, total, category_id")
        .eq("car_id", carId)
        .order("date", {
          ascending: true,
        })
        .gt("date", filterByMonth ? valueBeginOfMonth : valueBeginOfYear)
        .lt("date", filterByMonth ? valueEndOfMonth : valueEndOfYear);

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

        if (filterByMonth) {
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

          setChartData(expensesPerWeek);
        } else {
          const months = [
            {
              name: "January",
              month: 1,
            },
            {
              name: "February",
              month: 2,
            },
            {
              name: "March",
              month: 3,
            },
            {
              name: "April",
              month: 4,
            },
            {
              name: "May",
              month: 5,
            },
            {
              name: "June",
              month: 6,
            },
            {
              name: "July",
              month: 7,
            },
            {
              name: "August",
              month: 8,
            },
            {
              name: "September",
              month: 9,
            },
            {
              name: "October",
              month: 10,
            },
            {
              name: "November",
              month: 11,
            },
            {
              name: "December",
              month: 12,
            },
          ];

          const expensesPerMonth = months.map((month) => {
            const expenses = expensesPerCategory.filter((expense) => {
              const expenseMonth = new Date(expense.date).getMonth() + 1;
              return expenseMonth === month.month;
            });

            const total = expenses.reduce(
              (total, expense) => total + expense.total,
              0
            );

            return {
              x: month.name,
              y: total,
            };
          });

          setChartData(expensesPerMonth);
        }
      }
    })();
  }, [
    carId,
    filterByMonth,
    valueBeginOfMonth,
    valueBeginOfYear,
    valueEndOfMonth,
    valueEndOfYear,
  ]);

  const chartDataBar = [
    {
      data: chartData,
    },
  ];

  const optionsBar = {
    chart: {
      type: "bar" as "bar",

      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",

        dataLabels: {
          enabled: true,
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      position: "top",
      style: {
        colors: ["#ffffff"],
      },
      formatter: function (val: any) {
        return `${val > 0 ? "€ " + val : ""}`;
      },

      background: {
        enabled: true,
        foreColor: "#000000",
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: "#fff",
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.5,
          color: "#000",
        },
      },
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
        !active ? "w-full lg:w-3/5" : "hidden lg:block lg:w-3/5"
      } bg-slate-200/50 rounded-md border-2 p-4 lg:ml-4`}
    >
      <h3 className="mb-8">Expenses per day</h3>

      <div className="flex mb-4 items-center justify-between">
        <div className="w-40">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {filterByMonth ? (
              <DatePicker
                views={["year", "month"]}
                label="Year and Month"
                minDate={new Date("2019-01-01")}
                maxDate={new Date()}
                value={datePickerValue}
                onChange={(newValue: any) => {
                  setDatePickerValue(newValue);
                }}
                renderInput={(params: any) => (
                  <TextField size="small" {...params} helperText={null} />
                )}
              />
            ) : (
              <DatePicker
                views={["year"]}
                label="Year only"
                minDate={new Date("2019-01-01")}
                maxDate={new Date()}
                value={datePickerValue}
                onChange={(newValue: any) => {
                  setDatePickerValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} helperText={null} />
                )}
              />
            )}
          </LocalizationProvider>
        </div>

        <button
          className="flex items-center border border-skin-light_gray rounded-[4px] px-4 py-2 text-skin-dark_gray  hover:border-skin-black transition-all duration-200 ease-in-out"
          onClick={() => setFilterByMonth(!filterByMonth)}
        >
          <span className="mr-2 text-2xl">
            <BsFilter />
          </span>
          <span>{filterByMonth ? "Yearly" : "Monthly"}</span>
        </button>
      </div>

      <Chart
        className=" md:flex md:items-center md:justify-center  w-full h-96 md:h-96 rounded-md"
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
