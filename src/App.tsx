import "./index.css";
import React, { useState, useEffect } from "react";
import { AuthSession } from "@supabase/supabase-js";
import { supabase } from "./config/supabaseClient";

import { Routes, Route, useNavigate } from "react-router-dom";
import * as paths from "./routes";
import { Account, Landing, SignIn, SignUp } from "./Pages";

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
          navigate(paths.ACCOUNT);
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
        <Route path={paths.ACCOUNT} element={<Account session={session} />} />
      )}
    </Routes>
  );
}
