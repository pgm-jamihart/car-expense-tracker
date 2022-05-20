import { AuthSession } from "@supabase/supabase-js";
import React from "react";
import { supabase } from "../config/supabaseClient";
import BaseLayout from "../Layouts/BaseLayout";

const Profile = ({ session }: { session: AuthSession }) => {
  return (
    <BaseLayout>
      <div>Profile</div>

      <button
        type="button"
        className="button block"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </BaseLayout>
  );
};

export default Profile;
