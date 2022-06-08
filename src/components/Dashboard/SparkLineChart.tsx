import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../../config/supabaseClient";

interface SparkLineChartProps {
  carIdNumber: number;
}

const SparkLineChart = ({ carIdNumber }: SparkLineChartProps) => {
  const [chartDataSparkLine, setChartDataSparkLine] = useState<any[]>([]);
  const [labelsSparkLine, setLabelsSparkLine] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // start of month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const startOfMonthString = startOfMonth.toISOString().slice(0, 10);

  // startOfMonth get month name
  const startOfMonthName = startOfMonth.toLocaleString("en-US", {
    month: "long",
  });

  const startOfMonthYear = startOfMonth.getFullYear();
  const startOfMonthDateString = `(${startOfMonthName} ${startOfMonthYear})`;

  const series1 = [
    {
      data: chartDataSparkLine,
    },
  ];
  const options1 = {
    chart: {
      height: 160,
      sparkline: {
        enabled: true,
      },
    },
    labels: labelsSparkLine,
    stroke: {
      width: 2,
      curve: "smooth" as "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    yaxis: {
      show: false,
    },
    title: {
      text: `€ ${totalExpenses}`,
      offsetX: 0,
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "Open sans, Arial, sans-serif",
      },
    },
    subtitle: {
      text: "Expenses this month " + startOfMonthDateString,
      offsetX: 0,
      style: {
        fontSize: "14px",
        fontFamily: "Raleway, sans-serif",
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
            return "€";
          },
        },
      },
    },
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("car_id", carIdNumber)
        .order("date", {
          ascending: false,
        })
        .gt("date", startOfMonthString);

      if (error) {
        console.log(error);
      }

      if (data) {
        const total = data.reduce((acc, curr) => acc + curr.total, 0);
        setTotalExpenses(total);

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

        setLabelsSparkLine(
          expensesPerCategory.map(
            (expense) => expense.category.type + " " + expense.date
          )
        );

        setChartDataSparkLine(
          expensesPerCategory.map((expense) => expense.total)
        );
      }
    })();
  }, [carIdNumber, startOfMonthString]);

  return (
    <Chart
      options={options1}
      series={series1}
      type="area"
      height={"100%"}
      width={"100%"}
    />
  );
};

export default SparkLineChart;
