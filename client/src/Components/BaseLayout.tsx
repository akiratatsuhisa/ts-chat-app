import { FC, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  XIcon,
  MenuAlt1Icon,
  LogoutIcon,
  DatabaseIcon,
  IdentificationIcon,
} from "@heroicons/react/solid";
import { TopNavBarList, TopNavBarListItem } from "./TopNavBarList";
import { SideNavBarList, SideNavBarListItem } from "./SideNavBarList";
import { CogIcon } from "@heroicons/react/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { useTheme } from "../Contexts/ThemeContext";
import { useAuth } from "../Contexts/AuthContext";

const SettingsComponent: FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isDark, setDarkModeHandle } = useTheme();
  return (
    <div className="group mx-3 relative inline-block">
      <div className=" bg-slate-300 dark:bg-slate-700 text-white p-2  rounded-full shadow-md cursor-pointer">
        <CogIcon className="h-6 w-6"></CogIcon>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 hidden group-hover:block absolute right-0 py-3 w-60 rounded-lg shadow-md">
        <div className="flex items-center p-2">
          {isDark ? (
            <>
              <MoonIcon className="h-6 w-6 text-cyan-500" />
              <span className="ml-2 font-semibold">Dark</span>
            </>
          ) : (
            <>
              <SunIcon className="h-6 w-6 text-yellow-500" />
              <span className="ml-2 font-semibold">Light</span>
            </>
          )}
          <div
            className="relative inline-block w-10 ml-auto select-none"
            onClick={() => setDarkModeHandle(!isDark)}
          >
            <input
              readOnly
              checked={isDark}
              type="checkbox"
              className="bg-white border-slate-300 peer checked:border-green-400 checked:right-0 absolute block w-6 h-6 rounded-full border-4 outline-none appearance-none cursor-pointer"
            />
            <label className="bg-slate-300 peer-checked:bg-green-400 block overflow-hidden h-6 rounded-full  cursor-pointer "></label>
          </div>
        </div>
        <hr className="bg-slate-300 my-2" />
        <div className=" hover:bg-slate-300 dark:hover:bg-slate-900 cursor-pointer">
          <div className=" flex items-center p-2">
            <div className=" bg-slate-400 dark:bg-slate-700 text-white p-2 rounded-full">
              <DatabaseIcon className="h-4 w-4" />
            </div>
            <span className="flex-auto ml-2 font-semibold">...</span>
          </div>
        </div>
        <div className=" hover:bg-slate-300 dark:hover:bg-slate-900 cursor-pointer">
          <div className=" flex items-center p-2">
            <div className=" bg-slate-400 dark:bg-slate-700 text-white p-2 rounded-full">
              <IdentificationIcon className="h-4 w-4" />
            </div>
            <span className="flex-auto ml-2 font-semibold">...</span>
          </div>
        </div>
        {currentUser && (
          <>
            <hr className="bg-slate-300  my-2" />
            <div
              className=" hover:bg-slate-300 dark:hover:bg-slate-900 cursor-pointer"
              onClick={() => navigate("/logout")}
            >
              <div className=" flex items-center p-2">
                <div className=" bg-slate-400 dark:bg-slate-700 text-white p-2 rounded-full">
                  <LogoutIcon className="h-4 w-4" />
                </div>
                <span className="flex-auto ml-2 font-semibold">Logout</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const BaseLayout: FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);
  return (
    <div className="text-black dark:text-white h-screen flex flex-col">
      <div className="bg-white dark:bg-slate-900 shadow-md h-14 md:px-5  flex-none flex items-center sticky top-0 z-40">
        <button
          className="flex justify-center items-center w-14 h-14 md:hidden hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onOpenSideBar}
        >
          <MenuAlt1Icon className="h-6 w-6 text-slate-400"></MenuAlt1Icon>
        </button>
        <span className="px-2 text-xl font-bold">Chat App</span>

        <TopNavBarList className="hidden md:flex">
          <TopNavBarListItem to="/">Home</TopNavBarListItem>
          <TopNavBarListItem to="/about">About</TopNavBarListItem>
          <TopNavBarListItem to="/chat">Chat Rooms</TopNavBarListItem>
        </TopNavBarList>

        <div className="flex-auto"></div>

        <TopNavBarList className="hidden sm:flex">
          {!currentUser ? (
            <>
              <TopNavBarListItem to="/login">Login</TopNavBarListItem>
              <TopNavBarListItem to="/register">Register</TopNavBarListItem>
            </>
          ) : (
            <>
              <TopNavBarListItem to="/profile">
                <img
                  src={currentUser.avatarUrl}
                  className="block mr-2 h-10 w-10 rounded-full shadow-lg object-cover object-center"
                  alt="..."
                ></img>
                <span>{currentUser.displayName}</span>
              </TopNavBarListItem>
            </>
          )}
        </TopNavBarList>
        <SettingsComponent />
      </div>

      <div
        className={`bg-black/20 backdrop-blur-sm dark:bg-slate-900/80 fixed inset-0 z-40 md:hidden ${
          isOpen ? "" : "hidden"
        }`}
      ></div>

      <div
        className={` bg-white dark:bg-slate-900  shadow-lg w-60 fixed inset-y-0 left-0 z-40 flex flex-col transform transition duration-200 ease-in-out md:-translate-x-full ${
          isOpen ? "" : "-translate-x-full"
        }`}
      >
        <div className="shadow-lg h-14 flex-none flex items-center">
          <span className="px-2 text-xl font-bold">Chat App</span>
          <button
            className="ml-auto flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onCloseSideBar}
          >
            <XIcon className="h-6 w-6 text-slate-400"></XIcon>
          </button>
        </div>
        <div className=" dark:bg-slate-800 flex-auto overflow-y-auto">
          <SideNavBarList>
            <SideNavBarListItem to="/" onClick={onCloseSideBar}>
              Home
            </SideNavBarListItem>
            <SideNavBarListItem to="/about" onClick={onCloseSideBar}>
              About
            </SideNavBarListItem>
            <SideNavBarListItem to="/chat" onClick={onCloseSideBar}>
              Chat Rooms
            </SideNavBarListItem>
          </SideNavBarList>
          <hr className="my-3" />
          <SideNavBarList>
            {!currentUser ? (
              <>
                <SideNavBarListItem to="/login" onClick={onCloseSideBar}>
                  Login
                </SideNavBarListItem>
                <SideNavBarListItem to="/register" onClick={onCloseSideBar}>
                  Register
                </SideNavBarListItem>
              </>
            ) : (
              <>
                <SideNavBarListItem to="/profile" onClick={onCloseSideBar}>
                  <div className="flex items-center justify-between">
                    <span>{currentUser.displayName}</span>
                    <img
                      src={currentUser.avatarUrl}
                      className="block mr-2 h-7 w-7 rounded-full shadow-lg object-cover object-center"
                      alt="..."
                    ></img>
                  </div>
                </SideNavBarListItem>
              </>
            )}
          </SideNavBarList>
        </div>
      </div>

      <div className=" bg-slate-100 dark:bg-slate-800 flex-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
};
