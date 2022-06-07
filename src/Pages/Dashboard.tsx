import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import {
  BarChart,
  CarDetails,
  DonutChart,
  MilleageChart,
  Reminders,
  SparkLineChart,
} from "../components/Dashboard";
import { Alert } from "@mui/material";

interface Props {
  loggedIn: boolean;
}

const Dashboard = ({ loggedIn }: Props) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [active, setActive] = useState(true);
  const [success, setSuccess] = useState("");
  // calculate the total expenses
  const totalExpenses = chartData.reduce((acc, curr) => acc + curr, 0);

  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!currentCar.id) return;

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
            .eq("car_id", currentCar.id);

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
  }, [currentCar.id]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess("");
  };

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          message="Note archived"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            variant="filled"
          >
            {success}
          </Alert>
        </Snackbar>
      )}

      <div className="py-10 lg:py-0 lg:pb-10">
        {!currentCar.id && (
          <p className="text-center text-gray-500">
            You have no car selected. Please select one from the list.
          </p>
        )}

        {currentCar.id && chartData.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row mb-10">
              <div className="mb-10 md:mb-0 mr-8 w-full md:w-1/2 lg:w-1/3">
                <CarDetails
                  currentCar={currentCar}
                  setSuccess={setSuccess}
                  success={success}
                />
              </div>
              <div className=" shadow-lg py-2 border border-slate-200 w-full md:w-1/2 lg:w-1/3 rounded-md">
                <SparkLineChart
                  totalExpenses={totalExpenses}
                  carIdNumber={currentCar.id}
                />
              </div>
            </div>

            <div className="min-h-[24rem] flex item-start md:justify-start justify-center w-full flex-wrap">
              <div className="lg:hidden">
                <button className="mr-8" onClick={() => setActive(true)}>
                  Donut
                </button>
                <button onClick={() => setActive(false)}>Bar</button>
              </div>

              <DonutChart
                active={active}
                labels={labels}
                chartData={chartData}
              />

              <BarChart active={active} />
            </div>

            <div className=" lg:flex items-start mt-10">
              <div className="mb-10 lg:mb-0 lg:mr-4 w-full lg:w-1/2">
                <MilleageChart currentCarId={currentCar.id} />
              </div>
              <div className="lg:ml-4 w-full lg:w-1/2">
                <Reminders currentCarId={currentCar.id} />
              </div>
            </div>
          </div>
        )}

        {currentCar.id && chartData.length === 0 && (
          <p className="text-center text-gray-500">
            You have no expenses for this car.
          </p>
        )}
      </div>

      <SpeedDialTooltipOpen />
    </>
  );
};
export default Dashboard;
