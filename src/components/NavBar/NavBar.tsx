import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../../routes";
import { AiFillHome, AiFillDashboard } from "react-icons/ai";
import { MdTimeline, MdLocationOn, MdSettings } from "react-icons/md";

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
        className={`text-skin-yellow md:hidden absolute`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle
      </button>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } h-screen bg-skin-black w-72 md:block text-skin-white`}
      >
        <ul className="mt-8">
          {navData.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            navigate(paths.PROFILE);
          }}
        >
          Username
        </button>
      </div>
    </>
  );
};

export default NavBar;
