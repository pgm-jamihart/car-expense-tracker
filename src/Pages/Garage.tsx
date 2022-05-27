import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../routes";

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
        .select(`id, brand, model, year, millage`)
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
        <h1 className="text-center my-6 md:text-left">My Garage</h1>

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
                  src="https://via.placeholder.com/150"
                  alt="car"
                />
              </div>
              <div>
                <h2 className="text-xl">{car.brand}</h2>
                <h3 className="text-lg">{car.model}</h3>
              </div>
              <div className="ml-auto">
                <div className="w-10 h-10 bg-skin-white rounded-full"></div>
              </div>
            </Link>
          ))}

        <div className="fixed md:absolute bottom-0 pb-6 pt-2 w-full left-0 px-6 bg-skin-white">
          <PrimaryButton
            onClick={handleAddCar}
            className="bg-skin-dark_blue md:max-w-xs"
            type="button"
          >
            Add car
          </PrimaryButton>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Garage;
