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
  AddReminder,
  CarDetailPage,
  Dashboard,
  Garage,
  Landing,
  Places,
  SignIn,
  SignUp,
  TimelinePage,
  UpdateExpense,
} from "./Pages";

import BaseLayout from "./Layouts/BaseLayout";

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [carChanged, setCarChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        if (session === null) {
          navigate("/");
        } else {
          navigate(paths.DASHBOARD);
          setSession(session);

          (async () => {
            if (session.user) {
              const { data, error } = await supabase
                .from("cars")
                .select("*")
                .eq("user_id", session.user.id)
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
                    photo_url: data.photo_url,
                  })
                );

                setLoggedIn(true);
              }
            }
          })();
        }
      }
    );

    setLoading(false);
  }, [navigate]);

  return (
    <>
      {!session && (
        <>
          {loading ? (
            <div className="flex items-center justify-center absolute left-0 right-0 top-0 bottom-0 w-full h-full z-[999] bg-skin-white"></div>
          ) : (
            <Routes>
              <Route path={paths.LANDING} element={<Landing />} />
              <Route path={paths.SIGN_UP} element={<SignUp />} />
              <Route path={paths.SIGN_IN} element={<SignIn />} />
            </Routes>
          )}
        </>
      )}

      {session && (
        <BaseLayout loggedIn={loggedIn} carChanged={carChanged}>
          <Routes>
            <Route path={paths.ACCOUNT} element={<Account />} />
            <Route
              path={paths.DASHBOARD}
              element={<Dashboard loggedIn={loggedIn} />}
            />
            <Route path={paths.TIMELINE} element={<TimelinePage />} />
            <Route path={paths.PLACES} element={<Places />} />
            <Route path={paths.GARAGE} element={<Garage />} />
            <Route
              path={paths.CAR_DETAIL_PAGE}
              element={
                <CarDetailPage
                  carChanged={carChanged}
                  setCarChanged={setCarChanged}
                />
              }
            />
            <Route path={paths.ADD_CAR} element={<AddCar />} />
            <Route path={paths.ADD_EXPENSE} element={<AddExpense />} />
            <Route path={paths.ADD_REMINDER} element={<AddReminder />} />
            <Route path={paths.UPDATE_EXPENSE} element={<UpdateExpense />} />
          </Routes>
        </BaseLayout>
      )}
    </>
  );
}
