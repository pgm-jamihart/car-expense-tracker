import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../routes";
import { PageTitle } from "../components";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";

const Garage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);

  const handleAddCar = async () => {
    navigate(paths.ADD_CAR);
  };

  useEffect(() => {
    (async () => {
      let { data, error, status } = await supabase
        .from("cars")
        .select(`id, brand, model, year, mileage`)
        .eq("user_id", auth.user!.id);
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setData(data);
      }
    })();
  }, [auth.user]);

  return (
    <BaseLayout>
      <div className="">
        <PageTitle>My Garage</PageTitle>

        <button
          onClick={handleAddCar}
          className="flex items-center text-skin-white p-2 my-5 mr-6 bg-skin-dark_blue md:max-w-xs absolute right-0 top-0 rounded-md"
          type="button"
        >
          <AiOutlinePlus />
          <span className="ml-2 hidden md:inline-block">Add car</span>
        </button>

        {data?.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            Add a car to your garage
          </div>
        )}

        {data &&
          data.map((car: any) => (
            <Link
              className="flex items-center p-4 bg-skin-light_gray rounded-lg shadow-lg my-3"
              key={car.id}
              to={paths.CAR_DETAIL_PAGE.replace(":id", car.id.toString())}
            >
              <div>
                <img
                  className="rounded-lg h-20 mr-4"
                  src="https://cdn.dribbble.com/users/627451/screenshots/15867068/media/175783d726a3db789733c9eef9d17697.png?compress=1&resize=1200x900&vertical=top"
                  alt="car"
                />
              </div>
              <div>
                <h2 className="text-xl">{car.brand}</h2>
                <h3 className="text-lg">{car.model}</h3>
              </div>
              <div className="ml-auto">
                <BsChevronRight className="shadow-lg p-2 w-10 h-10 rounded-full bg-skin-white text-skin-blue text-xl" />
              </div>
            </Link>
          ))}
      </div>
    </BaseLayout>
  );
};

export default Garage;
