import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../../routes";
import { AiFillHome, AiFillDashboard } from "react-icons/ai";
import {
  MdTimeline,
  MdLocationOn,
  MdSettings,
  MdAccountCircle,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import { CgMenuLeft } from "react-icons/cg";

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
  ];

  return (
    <>
      <button
        className={`text-skin-yellow md:hidden absolute text-base top-4 left-6`}
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
          isOpen ? "block" : "hidden"
        } h-screen bg-skin-black w-72 md:block text-skin-white p-6 flex flex-col justify-between`}
      >
        <div>
          <div className="mt-8">
            <img
              src="https://images.unsplash.com/photo-1441148345475-03a2e82f9719?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170"
              alt=""
              className="rounded-sm"
            />
          </div>

          <ul className="mt-8">
            {navData.map((item) => (
              <li
                key={item.name}
                className="mb-2 rounded-sm p-2 hover:bg-slate-500/50"
              >
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-xl"
                >
                  {item.icon}
                  <span className="ml-4 ">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => {
            navigate(paths.PROFILE);
          }}
          className="flex items-center text-xl hover:bg-slate-500/50 rounded-sm p-2"
        >
          <MdAccountCircle className="text-4xl mr-4" />
          Username
        </button>
      </div>
    </>
  );
};

export default NavBar;
