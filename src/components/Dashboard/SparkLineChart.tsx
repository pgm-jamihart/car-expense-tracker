import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../../config/supabaseClient";

interface SparkLineChartProps {
  totalExpenses: number;
  carIdNumber: number;
}

const SparkLineChart = ({
  totalExpenses,
  carIdNumber,
}: SparkLineChartProps) => {
  const [chartDataSparkLine, setChartDataSparkLine] = useState<any[]>([]);
  const [labelsSparkLine, setLabelsSparkLine] = useState<any[]>([]);

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
      curve: "straight" as "straight",
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
        fontFamily: "Helvetica, Arial, sans-serif",
      },
    },
    subtitle: {
      text: "All expenses",
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
        .limit(20);

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
  }, [carIdNumber]);

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
