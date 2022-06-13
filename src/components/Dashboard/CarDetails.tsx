import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Formik } from "formik";
import * as Yup from "yup";
import { supabase } from "../../config/supabaseClient";
import ErrorMessage from "../Form/ErrorMessage";

interface Props {
  currentCar: {
    id: number;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    photo_url: string;
  };
  setSuccess: (success: string) => void;
  success: string;
}

const CarDetails = ({ currentCar, setSuccess, success }: Props) => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("mileage")
        .select("date")
        .eq("car_id", currentCar.id)
        .order("date", {
          ascending: false,
        });

      if (error) {
        console.log(error);
      }

      if (data) {
        setLastUpdated(data[0].date);
      }
    })();
  }, [currentCar.id]);

  return (
    <div className=" ">
      <div className="flex items-baseline">
        <h1 className="text-skin-gray">{currentCar.brand}</h1>
        <span className="ml-2 text-xl font-light md:italic block md:inline ">
          {currentCar.model}
        </span>
      </div>

      <div className="flex rounded-md py-2">
        {currentCar.photo_url ? (
          <img
            className="w-full h-full rounded-md max-h-[20rem] md:max-h-[13.5rem] object-cover"
            src={`https://togpdpbjnxnodlpvzjco.supabase.co/storage/v1/object/public/${currentCar.photo_url}`}
            alt="car"
          />
        ) : (
          <img
            className="w-full h-full rounded-md max-h-[10rem] object-cover bg-slate-200"
            src="./car_illustration.png"
            alt="car"
          />
        )}
      </div>

      <Formik
        enableReinitialize={true}
        initialValues={{ mileage: currentCar.mileage }}
        validationSchema={Yup.object().shape({
          mileage: Yup.number()
            .required("Required")
            .min(currentCar.mileage, "Must be greater than current mileage"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          (async () => {
            try {
              const { error } = await supabase
                .from("cars")
                .update({
                  mileage: values.mileage,
                })
                .match({
                  id: currentCar.id,
                });

              if (error) {
                console.log(error.message);
              }

              const d = new Date();
              const mm =
                d.getMonth() + 1 < 10
                  ? "0" + (d.getMonth() + 1)
                  : d.getMonth() + 1;
              const dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
              const yyyy = d.getFullYear();
              const today = `${yyyy}-${mm}-${dd}`;

              if (lastUpdated === today) {
                const { error: updateMileageError } = await supabase
                  .from("mileage")
                  .update({
                    mileage: values.mileage,
                  })
                  .match({
                    car_id: currentCar.id,
                    date: today,
                  });

                if (updateMileageError) {
                  console.log(updateMileageError);
                }
              } else {
                const { error: mileageError } = await supabase
                  .from("mileage")
                  .insert({
                    car_id: currentCar.id,
                    mileage: values.mileage,
                    date: today,
                  });

                if (mileageError) {
                  console.log(mileageError.message);
                }
              }

              localStorage.setItem(
                "car",
                JSON.stringify({
                  id: currentCar.id,
                  brand: currentCar.brand,
                  model: currentCar.model,
                  year: currentCar.year,
                  mileage: values.mileage,
                  photo_url: currentCar.photo_url,
                })
              );

              setSuccess(`Succes! Mileage updated to ${values.mileage} km`);

              setTimeout(() => {
                setSuccess("");
              }, 6000);

              setSubmitting(false);
            } catch (error: any) {
              console.log(error.message);
              setSubmitting(false);
            }
          })();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="mt-1 flex justify-between items-start"
          >
            <div>
              <span className="text-xs block text-skin-blue">Mileage</span>

              <div className="flex items-end mr-8">
                <input
                  className="text-4xl px-2 w-full font-bold number bg-skin-light_blue border-b-2 border-skin-blue"
                  type="number"
                  name="mileage"
                  id="mileage"
                  value={values.mileage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <span className="text-xs ml-1 text-skin-blue">km</span>
              </div>

              {errors.mileage ? (
                <ErrorMessage errorText={errors.mileage} />
              ) : (
                <span className="text-xs">last updated on {lastUpdated}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-skin-blue rounded-md text-skin-white p-1 hover:bg-skin-dark_blue transition-all duration-200 ease-in-out"
            >
              <AiOutlinePlus className="text-2xl" />
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CarDetails;
