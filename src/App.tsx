import "./index.css";
import React, { useState, useEffect } from "react";
import { AuthSession } from "@supabase/supabase-js";
import { supabase } from "./config/supabaseClient";

import { Routes, Route, useNavigate } from "react-router-dom";
import * as test from "./routes";
import { Account, Landing } from "./Pages";

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
          navigate(test.ACCOUNT);
        }
      }
    );
  }, [navigate]);

  return (
    <Routes>
      <Route path={test.LANDING} element={<Landing />} />

      {session && (
        <Route path={test.ACCOUNT} element={<Account session={session} />} />
      )}
    </Routes>
  );
}
