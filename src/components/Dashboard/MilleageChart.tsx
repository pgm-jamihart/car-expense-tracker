import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../../config/supabaseClient";

interface Props {
  currentCarId: number;
}

const MilleageChart = ({ currentCarId }: Props) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);

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
    labels: labels,
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
            return "Mileage";
          },
        },
      },
    },
  };
  return (
    <div>
      <h3 className="my-4 ml-4">Mileage</h3>
      <Chart
        className=" md:flex md:items-center md:justify-center shadow-lg border border-slate-200 w-full rounded-md h-[17rem] max-h-[17rem]"
        //md:max-w-screen-sm md:ml-4 mt-4 md:mt-0
        options={optionsBar}
        series={chartDataBar}
        type="bar"
        height={"80%"}
      />
    </div>
  );
};

export default MilleageChart;