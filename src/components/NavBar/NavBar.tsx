import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../../routes";

import { MdDashboard, MdOutlineKeyboardBackspace } from "react-icons/md";
import { CgMenuLeft } from "react-icons/cg";
import { FaCar, FaHistory, FaSearchLocation } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider";
import { BsChevronRight } from "react-icons/bs";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<any>({});
  const auth = useAuth();

  console.log(auth.user);

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  const navData = [
    {
      name: "Dashboard",
      icon: <MdDashboard />,
      path: paths.DASHBOARD,
    },
    {
      name: "Timeline",
      icon: <FaHistory />,
      path: paths.TIMELINE,
    },
    {
      name: "Places",
      icon: <FaSearchLocation />,
      path: paths.PLACES,
    },
    {
      name: "My Garage",
      icon: <FaCar />,
      path: paths.GARAGE,
    },
  ];

  return (
    <>
      <button
        className={`text-skin-yellow md:hidden absolute text-base top-4 left-6 z-50`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <MdOutlineKeyboardBackspace className="text-skin-yellow w-8 h-10 mr-4" />
        ) : (
          <CgMenuLeft className="text-skin-yellow w-8 h-10 mr-4" />
        )}
      </button>
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } absolute z-30 md:relative md:block transition-all duration-200 ease-in-out md:translate-x-0`}
      >
        <div
          className={`h-screen bg-skin-black  w-72 flex min-w-18 text-skin-white p-6 flex-col justify-between `}
        >
          <ul className="mt-8">
            {navData.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-lg rounded-sm p-2 hover:bg-slate-500/50"
                >
                  {item.icon}
                  <span className="ml-4 ">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={paths.ACCOUNT}
            className="absolute bottom-4 left-0 w-full p-2 "
          >
            <div className="flex items-center  bg-slate-800 p-4 rounded-md border-2 border-slate-500/50 hover:border-skin-blue transition-all ease-in-out duration-200 shadow-lg hover:shadow-[0_0px_0px_5px_#3504fb90] hover:bg-slate-900">
              <img
                className="w-12 h-12 mr-4 border-skin-blue border-2 rounded-full p-2"
                src={auth?.user?.user_metadata.avatar_url}
                alt="profile"
              />

              <div className="flex justify-between w-full">
                <div>
                  <span className="text-skin-white font-semibold block">
                    {auth?.user?.user_metadata.full_name}
                  </span>

                  <span className="block text-xs text-skin-light_gray">
                    {auth?.user?.user_metadata.email}
                  </span>
                </div>

                <span
                  className="flex items-center justify-center w-10
              2 h-12 "
                >
                  <BsChevronRight className="text-skin-white text-2xl font-semibold" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
