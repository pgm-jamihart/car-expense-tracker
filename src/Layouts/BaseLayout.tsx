import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { SnackBarContext } from "../context/SnackBarContext";

interface Props {
  children: React.ReactNode;
  loggedIn?: boolean;
  carChanged?: boolean;
}

const BaseLayout = ({ children, loggedIn, carChanged }: Props) => {
  const [snackBar, setSnackBar] = useState("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar("");
  };

  return (
    <SnackBarContext.Provider value={{ snackBar, setSnackBar }}>
      <div className="flex">
        <NavBar loggedIn={loggedIn} carChanged={carChanged} />
        <div className="px-6 w-full h-screen relative overflow-y-auto">
          <LoadScript
            googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
            loadingElement={
              <div className="absolute left-0 top-0 right-0 bottom-0 bg-skin-white z-20 flex justify-center items-center">
                <CircularProgress />
              </div>
            }
          >
            {children}
          </LoadScript>

          {snackBar && (
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
                variant="standard"
              >
                {snackBar}
              </Alert>
            </Snackbar>
          )}
        </div>
      </div>
    </SnackBarContext.Provider>
  );
};

export default BaseLayout;
