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
  Timeline,
} from "./Pages";

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        if (session === null) {
          navigate("/");
        } else {
          setSession(session);
          navigate(paths.HOME);
        }
      }
    );
  }, [navigate]);

  return (
    <Routes>
      <Route path={paths.LANDING} element={<Landing />} />
      <Route path={paths.SIGN_UP} element={<SignUp />} />
      <Route path={paths.SIGN_IN} element={<SignIn />} />

      {session && (
        <>
          <Route path={paths.ACCOUNT} element={<Account />} />
          <Route path={paths.HOME} element={<HomePage />} />
          <Route path={paths.DASHBOARD} element={<Dashboard />} />
          <Route path={paths.TIMELINE} element={<Timeline />} />
          <Route path={paths.PLACES} element={<Places />} />
          <Route path={paths.SETTINGS} element={<Settings />} />
          <Route path={paths.PROFILE} element={<Profile />} />
          <Route path={paths.GARAGE} element={<Garage />} />
          <Route path={paths.CAR_DETAIL_PAGE} element={<CarDetailPage />} />
          <Route path={paths.ADD_CAR} element={<AddCar />} />
          <Route path={paths.ADD_EXPENSE} element={<AddExpense />} />
        </>
      )}
    </Routes>
  );
}
