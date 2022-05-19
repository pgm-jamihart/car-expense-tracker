import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { ErrorBanner, TextInput } from "../components/Form";
import { supabase } from "../config/supabaseClient";
import { Devider, SignUpWithSocials } from "../components";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="md:flex h-screen bg-blue-700">
      <div className="bg-blue-700 px-8 py-20 lg:w-1/2 hidden md:block">
        <h1 className="text-3xl font-medium text-center text-white">
          Welcome back.
        </h1>
      </div>

      <div className="bg-white h-full p-4 md:rounded-none md:flex md:items-center justify-center w-full md:w-full lg:w-1/2 ">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-start w-full">
              <button onClick={() => navigate(paths.LANDING)}>
                <MdOutlineKeyboardBackspace className="text-yellow-500 w-10 h-10 mr-4" />
              </button>

              <h2 className="my-10 text-3xl">Sign in to your account</h2>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);
                  const { user, session, error } = await supabase.auth.signIn({
                    email: values.email,
                    password: values.password,
                  });

                  if (error) {
                    setError(error.message);
                    setSubmitting(false);
                  }
                } catch (error: any) {
                  setError(error.message);
                  setSubmitting(false);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="w-full">
                  {error && <ErrorBanner error={error} />}
                  {isSubmitting ? (
                    "Loading"
                  ) : (
                    <div className="mb-4">
                      <Field
                        type="input"
                        as={TextInput}
                        name="email"
                        placeholder="E-mail"
                        label="E-mail"
                      />
                      <Field
                        type="password"
                        as={TextInput}
                        name="password"
                        placeholder="Password"
                        label="Password"
                      />
                    </div>
                  )}

                  <PrimaryButton
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-sm w-full py-4 rounded-md"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </PrimaryButton>
                </form>
              )}
            </Formik>
            <Devider />
          </div>

          <SignUpWithSocials loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
