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
import { Alert, CircularProgress } from "@mui/material";

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
            <div className="flex flex-col md:flex-row mb-10">
              <div className="mb-10 md:mb-0 mr-8 w-full md:w-1/2 lg:w-1/3">
                <CarDetails
                  currentCar={currentCar}
                  setSuccess={setSuccess}
                  success={success}
                />
              </div>
              <div className=" shadow-lg py-2 border border-slate-200 w-full md:w-1/2 lg:w-1/3 rounded-md">
                <SparkLineChart carIdNumber={currentCar.id} />
              </div>
            </div>

            <div className="min-h-[24rem] flex item-start md:justify-start justify-center w-full flex-wrap">
              <div className="lg:hidden">
                <button className="mr-8" onClick={() => setActive(true)}>
                  Donut
                </button>
                <button onClick={() => setActive(false)}>Bar</button>
              </div>

              <DonutChart active={active} carId={currentCar.id} />

              <BarChart active={active} carId={currentCar.id} />
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
      </div>

      <SpeedDialTooltipOpen />
    </>
  );
};
export default Dashboard;
