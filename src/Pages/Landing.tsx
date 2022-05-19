import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { Devider, SignUpWithSocials } from "../components";

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToSignUpPage = () => {
    navigate(paths.SIGN_UP);
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

            <PrimaryButton
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-sm w-full py-4 rounded-md"
              disabled={loading}
              onClick={goToSignUpPage}
            >
              Sign up with email
            </PrimaryButton>
          </div>

          <Devider />

          <SignUpWithSocials setLoading={setLoading} loading={loading} />

          <div className="my-16">
            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <Link to={paths.SIGN_IN} className="text-blue-500 underline">
                Sign in
              </Link>
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
