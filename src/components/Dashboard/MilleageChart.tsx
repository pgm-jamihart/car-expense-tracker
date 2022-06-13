import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../../config/supabaseClient";

interface Props {
  currentCarId: number;
}

const MilleageChart = ({ currentCarId }: Props) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!currentCarId) return;

    (async () => {
      const { data, error } = await supabase
        .from("mileage")
        .select("id, date, mileage")
        .eq("car_id", currentCarId)
        .order("date", {
          ascending: false,
        })
        .limit(5);

      if (error) {
        console.log(error);
      }

      if (data) {
        const dataReversed = data.reverse();

        setChartData(dataReversed.map((mileage) => mileage.mileage));
        setLabels(
          dataReversed.map((mileage) => {
            const date = new Date(mileage?.date);
            return date.toLocaleDateString("en-UK", {
              month: "short",
              day: "numeric",
            });
          })
        );
      }
    })();
  }, [currentCarId]);

  const chartDataBar = [
    {
      data: chartData,
    },
  ];

  const options = {
    chart: {},
    dataLabels: {
      enabled: true,
    },
    labels: labels,
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
    yaxis: {},

    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: function () {
            return "Mileage";
          },
        },
      },
    },
  };
  return (
    <div className=" w-full h-72 ">
      <h3 className="mb-8">Mileage</h3>
      <Chart
        options={options}
        series={chartDataBar}
        type="area"
        height={"100%"}
        width={"100%"}
      />
    </div>
  );
};

export default MilleageChart;
