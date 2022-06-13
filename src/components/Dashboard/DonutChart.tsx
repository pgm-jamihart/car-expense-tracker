import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";

import Chart from "react-apexcharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { BsFilter } from "react-icons/bs";

interface DonutChartProps {
  carId: number;
  active?: boolean;
}

const DonutChart = ({ carId, active }: DonutChartProps) => {
  const [datePickerValue, setDatePickerValue] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [filterByMonth, setFilterByMonth] = useState<boolean>(false);

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
            .select("*")
            .eq("category_id", categoryId)
            .eq("car_id", carId)
            .gt("date", filterByMonth ? valueBeginOfMonth : valueBeginOfYear)
            .lt("date", filterByMonth ? valueEndOfMonth : valueEndOfYear);

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
  }, [
    carId,
    filterByMonth,
    valueBeginOfMonth,
    valueBeginOfYear,
    valueEndOfMonth,
    valueEndOfYear,
  ]);

  const options = {
    chart: {
      width: "100%",
      height: "100%",
    },
    legend: {
      position: "bottom" as "bottom",
    },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,

            total: {
              label: "Total",
              show: true,
              showAlways: true,
            },
          },
        },
      },
    },
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
      className={`${
        active ? "w-full lg:w-2/5 " : "hidden lg:block lg:w-2/5 "
      } bg-slate-200/50 rounded-md border-2 p-4 lg:mr-4 `}
    >
      <div>
        <h3 className="mb-8">
          Expenses per {filterByMonth ? "Month" : "Year"}
        </h3>
      </div>

      <div className="flex items-center w-full justify-between mb-4">
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

      <div
        className="relative h-96 pt-8 md:pt-0  w-full md:flex md:items-center md:justify-center"
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
