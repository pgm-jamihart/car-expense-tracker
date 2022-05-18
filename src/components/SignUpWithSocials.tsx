import React from "react";
import { GrFacebookOption, GrGooglePlus, GrGithub } from "react-icons/gr";

import { supabase } from "../config/supabaseClient";
import SignUpWithButton from "./Buttons/SignUpWithButton";

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignUpWithSocials = ({ loading, setLoading }: Props) => {
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: "google",
      });
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: "facebook",
      });
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: "github",
      });
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    {
      icon: <GrFacebookOption />,
      onClick: signInWithFacebook,
    },
    {
      icon: <GrGooglePlus />,
      onClick: signInWithGoogle,
    },
    {
      icon: <GrGithub />,
      onClick: signInWithGithub,
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
