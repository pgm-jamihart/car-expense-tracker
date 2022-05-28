import React from "react";
import { useAuth } from "../AuthProvider";
import { Title } from "../components";
import BaseLayout from "../Layouts/BaseLayout";

const Profile = () => {
  const auth = useAuth();

  return (
    <BaseLayout>
      <Title>Profile</Title>

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
