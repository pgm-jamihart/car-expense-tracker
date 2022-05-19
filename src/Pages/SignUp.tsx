import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { TextInput } from "../components/Form";
import { supabase } from "../config/supabaseClient";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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
            <div className="flex items-center justify-start w-full">
              <button onClick={() => navigate(paths.LANDING)}>
                <MdOutlineKeyboardBackspace className="text-yellow-500 w-10 h-10 mr-4" />
              </button>

              <h2 className="my-10 text-3xl">Create an account</h2>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { user, session, error } = await supabase.auth.signUp({
                  email: values.email,
                  password: values.password,
                });

                if (error) {
                  setError(error.message);
                  setSubmitting(false);
                }

                setSubmitting(false);
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col my-0 mx-auto "
                >
                  {/* {error && <ErrorBanner error={error} />} */}
                  <div className="mb-4">
                    <Field
                      type="input"
                      as={TextInput}
                      name="email"
                      placeholder="E-mail"
                      label="E-mailadres"
                    />
                    <Field
                      type="password"
                      as={TextInput}
                      name="password"
                      placeholder="Password"
                      label="Wachtwoord"
                    />
                    <Field
                      type="password"
                      as={TextInput}
                      name="passwordConfirmation"
                      placeholder="Repeat Password"
                      label="Repeat passwoord"
                    />
                  </div>

                  <PrimaryButton
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-sm w-full py-4 rounded-md"
                    disabled={isSubmitting}
                  >
                    Create an account
                  </PrimaryButton>
                </form>
              )}
            </Formik>
          </div>

          <div className="my-16">
            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <Link to={paths.SIGN_IN} className="text-blue-500 underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
