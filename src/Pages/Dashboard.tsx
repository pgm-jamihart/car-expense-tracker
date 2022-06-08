import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";

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
  const [active, setActive] = useState(true);
  const [success, setSuccess] = useState("");

  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, [loggedIn]);

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
        {/* {loading && (
          <div className="absolute left-0 top-0 right-0 bottom-0 bg-skin-white z-20 flex justify-center items-center">
            <CircularProgress />
          </div>
        )} */}

        {currentCar.id && (
          <div>
            <div className="flex flex-col md:flex-row mb-20">
              <div className="mb-10 md:mb-0 mr-8 w-full md:w-1/2 lg:w-2/5">
                <CarDetails
                  currentCar={currentCar}
                  setSuccess={setSuccess}
                  success={success}
                />
              </div>
              <div className=" w-full md:w-1/2 lg:w-3/5">
                <Reminders currentCarId={currentCar.id} />
              </div>
            </div>

            <div className="min-h-[24rem] flex item-start md:justify-start justify-center w-full flex-wrap lg:flex-nowrap">
              <div className="mb-5 lg:hidden border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <button
                  className={`${
                    active
                      ? "text-skin-blue bg-slate-200"
                      : "hover:bg-slate-300 text-skin-dark_gray"
                  } inline-block p-4  rounded-t-lg transition-all duration-200 ease-in-out`}
                  onClick={() => setActive(true)}
                >
                  Donut chart
                </button>
                <button
                  className={`${
                    !active
                      ? "text-skin-blue bg-slate-200  "
                      : "hover:bg-slate-300 text-skin-dark_gray"
                  } inline-block p-4 rounded-t-lg transition-all duration-200 ease-in-out `}
                  onClick={() => setActive(false)}
                >
                  Bar chart
                </button>
              </div>

              <DonutChart active={active} carId={currentCar.id} />

              <BarChart active={active} carId={currentCar.id} />
            </div>

            <div className="mt-10 lg:mt-20 mb-10 w-full h-96 bg-slate-100/50 rounded-md border-2 p-4">
              <MilleageChart currentCarId={currentCar.id} />
            </div>
          </div>
        )}
      </div>

      <SpeedDialTooltipOpen />
    </>
  );
};
export default Dashboard;
