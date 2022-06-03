import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../../routes";
import { AiFillHome, AiFillDashboard } from "react-icons/ai";
import {
  MdTimeline,
  MdLocationOn,
  MdSettings,
  MdOutlineKeyboardBackspace,
  MdAccountCircle,
} from "react-icons/md";
import { CgMenuLeft } from "react-icons/cg";
import { FaCarSide } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  const navData = [
    {
      name: "Home",
      icon: <AiFillHome />,
      path: paths.HOME,
    },
    {
      name: "Dashboard",
      icon: <AiFillDashboard />,
      path: paths.DASHBOARD,
    },
    {
      name: "Timeline",
      icon: <MdTimeline />,
      path: paths.TIMELINE,
    },
    {
      name: "Places",
      icon: <MdLocationOn />,
      path: paths.PLACES,
    },
    {
      name: "Settings",
      icon: <MdSettings />,
      path: paths.SETTINGS,
    },
    {
      name: "Profile",
      icon: <MdAccountCircle />,
      path: paths.PROFILE,
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

          <button
            onClick={() => {
              navigate(paths.GARAGE);
            }}
            className="flex items-center text-lg hover:bg-slate-500/50 rounded-sm p-2"
          >
            <FaCarSide className="w-12 h-12 mr-4 bg-skin-blue rounded-full p-2" />
            <span className="ml-4">{currentCar.brand}</span>

            <span className="ml-4">{currentCar.model}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
