import React from "react";
import { useAuth } from "../AuthProvider";
import BaseLayout from "../Layouts/BaseLayout";

const Profile = () => {
  const auth = useAuth();

  return (
    <BaseLayout>
      <div>Profile</div>

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
