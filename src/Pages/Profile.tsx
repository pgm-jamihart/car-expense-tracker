import React from "react";
import { useAuth } from "../context/AuthProvider";
import { PageTitle } from "../components";
import BaseLayout from "../Layouts/BaseLayout";

const Profile = () => {
  const auth = useAuth();

  return (
    <BaseLayout>
      <PageTitle>Profile</PageTitle>

      <button
        type="button"
        className="button block"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    </BaseLayout>
  );
};

export default Profile;
