import "./index.css";
import React, { useState, useEffect } from "react";
import { AuthSession } from "@supabase/supabase-js";
import { supabase } from "./config/supabaseClient";

import { Routes, Route, useNavigate } from "react-router-dom";
import * as paths from "./routes";
import {
  Account,
  AddCar,
  AddExpense,
  CarDetailPage,
  Dashboard,
  Garage,
  HomePage,
  Landing,
  Places,
  Profile,
  Settings,
  SignIn,
  SignUp,
  TimelinePage,
  UpdateExpense,
} from "./Pages";

import { useAuth } from "./context/AuthProvider";
import { LoadScript } from "@react-google-maps/api";

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);
  const auth = useAuth();

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        if (session === null) {
          navigate("/");
        } else {
          setSession(session);
          navigate(paths.HOME);

          (async () => {
            if (auth.user) {
              const { data, error } = await supabase
                .from("cars")
                .select("*")
                .eq("user_id", auth.user.id)
                .limit(1)
                .single();

              if (error) {
                console.error(error);
              }

              if (data) {
                localStorage.setItem(
                  "car",
                  JSON.stringify({
                    id: data.id,
                    brand: data.brand,
                    model: data.model,
                    year: data.year,
                    mileage: data.mileage,
                  })
                );
              }
            }
          })();
        }
      }
    );
  }, [auth.user, navigate]);

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
    >
      <Routes>
        <Route path={paths.LANDING} element={<Landing />} />
        <Route path={paths.SIGN_UP} element={<SignUp />} />
        <Route path={paths.SIGN_IN} element={<SignIn />} />

        {session && (
          <>
            <Route path={paths.ACCOUNT} element={<Account />} />
            <Route path={paths.HOME} element={<HomePage />} />
            <Route path={paths.DASHBOARD} element={<Dashboard />} />
            <Route path={paths.TIMELINE} element={<TimelinePage />} />
            <Route path={paths.PLACES} element={<Places />} />
            <Route path={paths.SETTINGS} element={<Settings />} />
            <Route path={paths.PROFILE} element={<Profile />} />
            <Route path={paths.GARAGE} element={<Garage />} />
            <Route path={paths.CAR_DETAIL_PAGE} element={<CarDetailPage />} />
            <Route path={paths.ADD_CAR} element={<AddCar />} />
            <Route path={paths.ADD_EXPENSE} element={<AddExpense />} />
            <Route path={paths.UPDATE_EXPENSE} element={<UpdateExpense />} />
          </>
        )}
      </Routes>
    </LoadScript>
  );
}
