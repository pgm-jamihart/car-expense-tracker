import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as paths from "../../routes";

import { MdDashboard, MdOutlineKeyboardBackspace } from "react-icons/md";
import { CgMenuLeft } from "react-icons/cg";
import { FaCar, FaHistory, FaSearchLocation } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider";
import { BsChevronRight } from "react-icons/bs";
import { supabase } from "../../config/supabaseClient";
import { HiOutlinePhotograph } from "react-icons/hi";

interface Props {
  loggedIn?: boolean;
}

const NavBar = ({ loggedIn }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const [active, setActive] = useState<number | undefined>();
  const [currentCar, setCurrentCar] = useState<any>({});
  let location = useLocation();
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, [loggedIn]);

  useEffect(() => {
    switch (location.pathname) {
      case paths.DASHBOARD:
        setActive(0);
        break;
      case paths.TIMELINE:
        setActive(1);
        break;
      case paths.PLACES:
        setActive(2);
        break;
      case paths.GARAGE:
        setActive(3);
        break;
      case paths.ACCOUNT:
        setActive(4);
        break;
      default:
        setActive(undefined);
        break;
    }
  }, [location]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", auth.user!.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error: any) {
        alert(error.message);
      }
    };

    getProfile();
  }, [auth]);

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

  const ImageComponent = () => {
    if (avatar_url) {
      return (
        <img
          src={`https://togpdpbjnxnodlpvzjco.supabase.co/storage/v1/object/public/${avatar_url}`}
          alt="avatar"
          className="mr-4 w-14 h-14 object-cover min-w-[3rem] min-h-[3rem] max-h-[3rem] max-w-[3rem] rounded-full bg-skin-blue"
        />
      );
    } else if (auth?.user?.user_metadata.avatar_url) {
      return (
        <img
          className="bg-skin-blue w-12 h-12 mr-4 rounded-full min-w-[3rem] min-h-[3rem] max-h-[3rem] max-w-[3rem]"
          src={auth?.user?.user_metadata.avatar_url}
          alt="profile"
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full min-w-[3rem] min-h-[3rem] max-h-[3rem] max-w-[3rem] bg-skin-dark_blue">
          <HiOutlinePhotograph className="text-2xl" />
        </div>
      );
    }
  };

  return (
    <>
      <button
        className={`${
          isOpen ? "left-2" : "left-6"
        } text-skin-yellow md:hidden absolute text-base top-4 z-50`}
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
          className={`h-screen bg-skin-black  w-72  min-w-18 text-skin-white p-2  `}
        >
          <div className="flex items-center mt-16 md:mt-6">
            <img src="./logo.png" alt="logo" className="h-16" />
            <h1 className="text-3xl font-extrabold">Car expense</h1>
          </div>

          <ul className="mt-6 border-b-2 pb-4 border-t-2 border-skin-dark_gray pt-4">
            {navData.map((item, index) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    active === index
                      ? "bg-slate-700/50  border-slate-500/30 border"
                      : "border border-transparent"
                  } flex items-center text-lg rounded-sm p-2 hover:bg-slate-600/50 transition-all duration-200 ease-in-out`}
                >
                  {item.icon}
                  <span className="ml-4 ">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {currentCar.id ? (
            <div className="p-2">
              <h3 className="font-bold text-base text-skin-light_gray">
                Selected car
              </h3>
              <div className="flex items-center mt-4">
                <img
                  className="rounded-lg h-12 mr-4"
                  src="https://cdn.dribbble.com/users/627451/screenshots/15867068/media/175783d726a3db789733c9eef9d17697.png?compress=1&resize=1200x900&vertical=top"
                  alt="car"
                />

                <ul>
                  <li className="">{currentCar.brand}</li>
                  <li className="">{currentCar.model}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-2 mt-2">
              <Link to={paths.ADD_CAR}>
                <div className="bg-skin-blue text-skin-light_white text-base text-center py-2 px-4 border-2 border-transparent hover:border-skin-blue rounded-sm hover:bg-slate-900 hover:shadow-[0_0px_0px_5px_#3504fb90] transition-all duration-200 ease-in-out">
                  Add your first car
                </div>
              </Link>
            </div>
          )}

          <Link
            to={paths.ACCOUNT}
            className="absolute bottom-4 left-0 w-full p-2 "
          >
            <div className="flex   bg-slate-800 p-4 rounded-md border-2 border-slate-500/50 hover:border-skin-blue transition-all ease-in-out duration-200 shadow-lg hover:shadow-[0_0px_0px_5px_#3504fb90] hover:bg-slate-900">
              <ImageComponent />

              <div className="flex justify-between w-full">
                <div className="block">
                  <span
                    className={`w-36 text-skin-white font-semibold block truncate`}
                  >
                    {username ||
                      auth?.user?.user_metadata.full_name ||
                      auth?.user?.email}
                  </span>

                  {auth?.user?.user_metadata.email ? (
                    <span className="block text-xs text-skin-light_gray truncate w-36">
                      {auth?.user?.user_metadata.email}
                    </span>
                  ) : (
                    <span className="block text-xs text-skin-light_gray truncate w-36">
                      {auth?.user?.email}
                    </span>
                  )}
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
