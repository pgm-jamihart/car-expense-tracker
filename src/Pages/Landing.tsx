import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { Devider, LandingImage, SignUpWithSocials } from "../components";

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToSignUpPage = () => {
    navigate(paths.SIGN_UP);
  };

  return (
    <div className="md:flex h-screen bg-skin-light_gray">
      <LandingImage />

      <div className="bg-skin-white rounded-t-3xl p-4 md:rounded-none md:flex md:items-center justify-center w-full md:w-full lg:w-1/2 ">
        <div className="max-w-lg my-0 mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="my-10">Create an account</h2>

            <PrimaryButton
              type="button"
              className="bg-skin-dark_blue"
              disabled={loading}
              onClick={goToSignUpPage}
            >
              Sign up with email
            </PrimaryButton>
          </div>

          <Devider />

          <SignUpWithSocials setLoading={setLoading} loading={loading} />

          <div className="my-16">
            <p className="text-center text-skin-gray">
              Already have an account?{" "}
              <Link to={paths.SIGN_IN} className="text-skin-blue underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-center text-skin-gray text-xs">
              By signing up, you agree to our{" "}
              <button className="text-skin-blue">Terms of Service</button> and{" "}
              <button className="text-skin-blue">Privacy Policy</button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
