import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { PrimaryButton } from "../Buttons";
import ErrorBanner from "./ErrorBanner";

import TextInput from "./TextInput";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import * as paths from "../../routes";
import SelectInput from "./SelectInput";

const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required()
    .label("Date")
    .min(new Date(), "Date must be today or later"),
  time: Yup.string().required().label("Time"),
  type: Yup.string().required().label("Type"),
  name: Yup.string().required().label("Name"),
});

const ReminderFrom = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  const getDateToday = () => {
    const d = new Date();
    const mm =
      d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    const dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    const yyyy = d.getFullYear();
    const today = `${yyyy}-${mm}-${dd}`;

    return today;
  };

  return (
    <Formik
      initialValues={{
        date: "",
        time: "",
        type: "",
        name: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { data, error } = await supabase.from("reminders").insert({
            car_id: currentCar.id,
            date: values.date + " " + values.time,
            type: values.type,
            name: values.name,
          });

          if (error) {
            setError(error.message);
            console.log(error);
          } else {
            navigate(paths.DASHBOARD);
          }
        } catch (error: any) {
          setError(error.message);
          setSubmitting(false);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit} className="flex flex-col  mx-auto my-8">
          {error && <ErrorBanner error={error} />}

          <div>
            <Field
              name="date"
              as={TextInput}
              type="date"
              label="Date"
              min={getDateToday()}
            />

            <Field name="time" as={TextInput} type="time" label="Time" />

            <Field
              name="type"
              as={SelectInput}
              label="Type"
              options={[
                "Fuel",
                "Maintenance",
                "Insurance",
                "Repair",
                "Taxes",
                "Other",
              ]}
            />

            <Field
              name="name"
              as={TextInput}
              type="text"
              label="Name"
              placeholder="Name"
            />
          </div>

          <PrimaryButton
            type="submit"
            className="bg-skin-dark_blue max-w-md"
            disabled={isSubmitting}
          >
            Add Reminder
          </PrimaryButton>
        </form>
      )}
    </Formik>
  );
};

export default ReminderFrom;
