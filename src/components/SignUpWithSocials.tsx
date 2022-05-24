import { Provider } from "@supabase/supabase-js";
import React from "react";
import { GrFacebookOption, GrGooglePlus, GrGithub } from "react-icons/gr";
import { useAuth } from "../AuthProvider";

import SignUpWithButton from "./Buttons/SignUpWithButton";

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignUpWithSocials = ({ loading, setLoading }: Props) => {
  const auth = useAuth();

  const signInWithSocial = async (provider: Provider | undefined) => {
    try {
      setLoading(true);

      auth.signInWithSocial(provider);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    {
      icon: <GrFacebookOption />,
      onClick: () => signInWithSocial("facebook"),
    },
    {
      icon: <GrGooglePlus />,
      onClick: () => signInWithSocial("google"),
    },
    {
      icon: <GrGithub />,
      onClick: () => signInWithSocial("github"),
    },
  ];

  return (
    <div className="flex items-center justify-between w-48 my-0 mx-auto">
      {data.map((item, index) => (
        <SignUpWithButton key={index} onClick={item.onClick} disabled={loading}>
          {item.icon}
        </SignUpWithButton>
      ))}
    </div>
  );
};

export default SignUpWithSocials;
