import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { GrFacebookOption, GrGooglePlus, GrTwitter } from "react-icons/gr";

export default function Landing() {
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="md:flex h-screen bg-blue-700">
      <div className="bg-blue-700 px-8 py-20 lg:w-1/2">
        <h1 className="text-3xl font-medium text-center text-white">
          Welcome to the expense car tracker app.
        </h1>
      </div>

      <div className="bg-white rounded-t-3xl p-4 md:rounded-none md:flex md:items-center justify-center w-full md:w-full lg:w-1/2 ">
        <div>
          <div className="flex flex-col items-center">
            <h2 className="my-10">Create an account</h2>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-sm w-full py-4 rounded-md"
              disabled={loading}
            >
              Sign up with email
            </button>
          </div>

          <div className="relative flex h-10 items-center justify-center flex-col my-10">
            <span className="bg-white px-10 py-2 absolute">or</span>
            <div className="h-px bg-slate-200 w-full"></div>
          </div>

          <div className="flex items-center justify-between w-48 my-0 mx-auto">
            <button
              className="border-blue-300 hover:border-blue-700 h-14 w-14 flex items-center justify-center border-2 hover:bg-blue-400 text-blue-500 font-bold py-2 px-4 rounded-full text-2xl hover:text-white ease-in-out duration-200 "
              // onClick={signInWithGoogle}
              disabled={loading}
            >
              <GrFacebookOption />
            </button>
            <button
              className="border-blue-300 hover:border-blue-700 h-14 w-14 flex items-center justify-center border-2 hover:bg-blue-400 text-blue-500 font-bold py-2 px-4 rounded-full text-2xl hover:text-white ease-in-out duration-200 "
              // onClick={signInWithGoogle}
              disabled={loading}
            >
              <GrTwitter />
            </button>
            <button
              className="border-blue-300 hover:border-blue-700 h-14 w-14 flex items-center justify-center border-2 hover:bg-blue-400 text-blue-500 font-bold py-2 px-4 rounded-full text-2xl hover:text-white ease-in-out duration-200 "
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <GrGooglePlus />
            </button>
          </div>

          <div className="my-16">
            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 underline">
                Sign in
              </a>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-center text-gray-400 text-xs">
              By signing up, you agree to our{" "}
              <a className="text-blue-700" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-blue-700" href="#">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
